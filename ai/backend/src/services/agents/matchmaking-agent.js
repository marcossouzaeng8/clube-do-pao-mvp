import { logAgentRun } from '../../repositories/agent-repository.js'
import { findSchedules } from '../../repositories/schedule-repository.js'
import { haversineDistance, roundTwo } from '../../utils/geo.js'

const agentType = 'MATCHMAKING'
const statusScores = { READY: 100, BAKING: 80, SCHEDULED: 40 }
const defaultRadiusKm = 5
const lookbackMs = 2 * 60 * 60 * 1000
const bakingWaitMinutes = 10

function estimateWaitMinutes(schedule) {
  if (schedule.status === 'SCHEDULED') {
    return Math.max(0, Math.round((new Date(schedule.horario_previsto).getTime() - Date.now()) / 60000))
  }

  return schedule.status === 'BAKING' ? bakingWaitMinutes : 0
}

// Matchmaking dinamico: pontua as fornadas no raio do consumidor priorizando
// pao pronto (50%), proximidade (30%) e unidades disponiveis (20%).
export async function runMatchmaking({ userLat, userLng, productName, maxRadiusKm = defaultRadiusKm }) {
  const schedules = await findSchedules({
    statuses: Object.keys(statusScores),
    since: new Date(Date.now() - lookbackMs),
    productName,
    onlyAvailable: true,
  })

  const matches = schedules
    .map((schedule) => ({
      schedule,
      distance: haversineDistance(userLat, userLng, schedule.estabelecimento.lat, schedule.estabelecimento.lng),
    }))
    .filter(({ distance }) => distance <= maxRadiusKm)
    .map(({ schedule, distance }) => {
      const distanceScore = Math.max(0, 100 - distance * 20)
      const availabilityScore = Math.min(100, schedule.disponivel * 10)

      return {
        estabelecimento_id: schedule.estabelecimento_id,
        estabelecimento_nome: schedule.estabelecimento.nome,
        fornada_id: schedule.id,
        produto_nome: schedule.produto.nome,
        status: schedule.status,
        distancia_km: roundTwo(distance),
        espera_minutos: estimateWaitMinutes(schedule),
        score: roundTwo(statusScores[schedule.status] * 0.5 + distanceScore * 0.3 + availabilityScore * 0.2),
      }
    })
    .sort((first, second) => second.score - first.score)

  const output = { matches, melhor_match: matches[0] ?? null }
  await logAgentRun(agentType, { userLat, userLng, productName, maxRadiusKm }, output)
  return output
}
