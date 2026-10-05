import { logAgentRun } from '../../repositories/agent-repository.js'
import { findReservationsForAnalysis } from '../../repositories/reservation-repository.js'
import { findSchedules } from '../../repositories/schedule-repository.js'

const agentType = 'RETENTION_UPSELL'
const dayLabels = ['aos domingos', 'às segundas', 'às terças', 'às quartas', 'às quintas', 'às sextas', 'aos sábados']
const historyWindowMs = 60 * 24 * 60 * 60 * 1000
const minimumPurchases = 2

// Retencao e upsell: cruza as fornadas prontas com quem costuma pedir aquele produto
// no mesmo dia da semana e gera um convite personalizado (um por consumidor).
export async function runRetentionUpsell({ establishmentId }) {
  const today = new Date().getDay()
  const readySchedules = await findSchedules({ establishmentId, statuses: ['READY'], onlyAvailable: true })

  const notificacoes = []
  const notifiedUsers = new Set()

  for (const schedule of readySchedules) {
    const reservations = await findReservationsForAnalysis({
      establishmentId: schedule.estabelecimento_id,
      productId: schedule.produto_id,
      statuses: ['CONFIRMED', 'DELIVERED'],
      since: new Date(Date.now() - historyWindowMs),
    })

    const purchasesToday = new Map()
    reservations
      .filter((reservation) => new Date(reservation.created_at).getDay() === today)
      .forEach((reservation) => {
        const current = purchasesToday.get(reservation.usuario_id) ?? { nome: reservation.usuario_nome, total: 0 }
        purchasesToday.set(reservation.usuario_id, { ...current, total: current.total + 1 })
      })

    for (const [userId, { nome, total }] of purchasesToday) {
      if (total < minimumPurchases || notifiedUsers.has(userId)) continue

      notificacoes.push({
        usuario_id: userId,
        usuario_nome: nome,
        mensagem: `Olá ${nome}! Notei que você costuma pedir ${schedule.produto.nome} ${dayLabels[today]}. A ${schedule.estabelecimento.nome} acabou de tirar uma fornada — quer adicionar à sua entrega de hoje?`,
        produto_id: schedule.produto_id,
        produto_nome: schedule.produto.nome,
        estabelecimento_id: schedule.estabelecimento_id,
        estabelecimento_nome: schedule.estabelecimento.nome,
        fornada_id: schedule.id,
      })
      notifiedUsers.add(userId)
    }
  }

  const output = { notificacoes }
  await logAgentRun(agentType, { establishmentId }, output)
  return output
}
