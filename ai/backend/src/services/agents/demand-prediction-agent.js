import { logAgentRun } from '../../repositories/agent-repository.js'
import { findProductsByEstablishment } from '../../repositories/establishment-repository.js'
import { findReservationsForAnalysis } from '../../repositories/reservation-repository.js'
import { findActiveSubscribersByEstablishment } from '../../repositories/subscription-repository.js'

const agentType = 'DEMAND_PREDICTION'
const dayWeights = [0.8, 0.9, 0.95, 1.0, 1.1, 1.3, 1.2]
const bakeHours = [6, 7, 8, 9, 17, 18]
const historyWindowMs = 30 * 24 * 60 * 60 * 1000
const breadsPerSubscription = 2
const defaultAverage = 5

function getConfidence(historySize) {
  if (historySize > 5) return 0.85
  if (historySize > 0) return 0.65
  return 0.45
}

// PCP autonomo: sugere a quantidade por fornada a partir das assinaturas ativas,
// do historico de reservas dos ultimos 30 dias e do peso do dia da semana.
export async function runDemandPrediction({ establishmentId, targetDate = new Date() }) {
  const [subscribers, recentReservations, products] = await Promise.all([
    findActiveSubscribersByEstablishment(establishmentId),
    findReservationsForAnalysis({
      establishmentId,
      statuses: ['CONFIRMED', 'DELIVERED'],
      since: new Date(Date.now() - historyWindowMs),
    }),
    findProductsByEstablishment(establishmentId),
  ])

  const dayWeight = dayWeights[targetDate.getDay()]
  const subscriptionDemand = subscribers.length * breadsPerSubscription

  const sugestoes = products.map((product) => {
    const history = recentReservations
      .filter((reservation) => reservation.produto_id === product.id)
      .map((reservation) => reservation.quantidade)
    const average = history.length > 0
      ? history.reduce((total, quantity) => total + quantity, 0) / history.length
      : defaultAverage

    const scheduledAt = new Date(targetDate)
    scheduledAt.setHours(bakeHours[product.nome.length % bakeHours.length], 0, 0, 0)

    return {
      produto_id: product.id,
      produto_nome: product.nome,
      quantidade_sugerida: Math.ceil((average + subscriptionDemand / products.length) * dayWeight),
      horario_previsto: scheduledAt.toISOString(),
      confianca: getConfidence(history.length),
      justificativa: `${history.length} pedidos nos últimos 30 dias, ${subscribers.length} assinaturas ativas, peso do dia ${dayWeight}`,
    }
  })

  const output = { estabelecimento_id: establishmentId, sugestoes }
  await logAgentRun(agentType, { establishmentId, targetDate }, output)
  return output
}
