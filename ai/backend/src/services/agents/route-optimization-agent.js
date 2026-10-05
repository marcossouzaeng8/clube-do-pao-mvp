import { createDeliveryRoute, logAgentRun } from '../../repositories/agent-repository.js'
import { findReservationsForAnalysis } from '../../repositories/reservation-repository.js'
import { findActiveSubscribersByEstablishment } from '../../repositories/subscription-repository.js'
import { haversineDistance, roundTwo } from '../../utils/geo.js'

const agentType = 'ROUTE_OPTIMIZATION'
const minutesPerKm = 3
const minutesPerStop = 5

function toStop(row, referencia) {
  return {
    ordem: 0,
    usuario_id: row.usuario_id,
    usuario_nome: row.usuario_nome,
    endereco: row.usuario_endereco ?? 'Sem endereço',
    lat: row.usuario_lat,
    lng: row.usuario_lng,
    referencia,
  }
}

function orderByNearestNeighbor(origin, stops) {
  const remaining = [...stops]
  const ordered = []
  let current = origin

  while (remaining.length > 0) {
    let nearestIndex = 0
    let nearestDistance = Infinity

    remaining.forEach((stop, index) => {
      const distance = haversineDistance(current.lat, current.lng, stop.lat, stop.lng)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    const [next] = remaining.splice(nearestIndex, 1)
    ordered.push({ ...next, ordem: ordered.length + 1 })
    current = next
  }

  return ordered
}

function measureRoundTrip(origin, stops) {
  let total = 0
  let current = origin

  for (const stop of stops) {
    total += haversineDistance(current.lat, current.lng, stop.lat, stop.lng)
    current = stop
  }

  return total + haversineDistance(current.lat, current.lng, origin.lat, origin.lng)
}

// Otimizacao de rotas: junta assinantes ativos e reservas confirmadas do dia em uma
// unica saida e ordena as paradas pelo vizinho mais proximo a partir da padaria.
export async function runRouteOptimization({ establishment, date = new Date() }) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const [subscribers, reservations] = await Promise.all([
    findActiveSubscribersByEstablishment(establishment.id),
    findReservationsForAnalysis({
      establishmentId: establishment.id,
      statuses: ['CONFIRMED'],
      since: startOfDay,
      until: endOfDay,
    }),
  ])

  const stopsByUser = new Map()
  const hasCoordinates = (row) => row.usuario_lat != null && row.usuario_lng != null

  subscribers.filter(hasCoordinates).forEach((subscriber) => {
    stopsByUser.set(subscriber.usuario_id, toStop(subscriber, `assinatura_${subscriber.id}`))
  })
  reservations.filter(hasCoordinates).forEach((reservation) => {
    stopsByUser.set(reservation.usuario_id, toStop(reservation, `reserva_${reservation.id}`))
  })

  const paradas = orderByNearestNeighbor(establishment, [...stopsByUser.values()])
  const totalDistanceKm = roundTwo(measureRoundTrip(establishment, paradas))
  const estimatedMinutes = Math.ceil(totalDistanceKm * minutesPerKm + paradas.length * minutesPerStop)

  const routeId = await createDeliveryRoute({
    establishmentId: establishment.id,
    date: startOfDay,
    stops: paradas,
    totalDistanceKm,
    estimatedMinutes,
  })

  const output = {
    rota_id: routeId,
    paradas,
    distancia_total_km: totalDistanceKm,
    minutos_estimados: estimatedMinutes,
  }
  await logAgentRun(agentType, { establishmentId: establishment.id, date }, output)
  return output
}
