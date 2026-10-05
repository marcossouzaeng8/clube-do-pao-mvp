import { findProductById } from '../repositories/establishment-repository.js'
import {
  createSchedule,
  findScheduleById,
  findSchedules,
  updateScheduleStatus,
} from '../repositories/schedule-repository.js'

const scheduleStatuses = ['SCHEDULED', 'BAKING', 'READY', 'SOLD_OUT']
const lookbackMs = 2 * 60 * 60 * 1000

export async function listSchedules(request, response) {
  const { estabelecimento_id: establishmentId, status } = request.query

  if (status && !scheduleStatuses.includes(status)) {
    response.status(400).json({ error: 'Status invalido.' })
    return
  }

  try {
    const fornadas = await findSchedules({
      establishmentId: establishmentId ? Number(establishmentId) : undefined,
      statuses: status ? [status] : undefined,
      since: new Date(Date.now() - lookbackMs),
    })

    response.json({ fornadas })
  } catch (error) {
    console.error('Erro ao listar fornadas:', error)
    response.status(500).json({ error: 'Nao foi possivel listar as fornadas.' })
  }
}

export async function registerSchedule(request, response) {
  const {
    estabelecimento_id: establishmentId,
    produto_id: productId,
    horario_previsto: scheduledAtInput,
    quantidade,
  } = request.body ?? {}
  const scheduledAt = new Date(scheduledAtInput)
  const quantity = Number(quantidade)

  if (
    !Number.isInteger(establishmentId)
    || !Number.isInteger(productId)
    || !scheduledAtInput
    || Number.isNaN(scheduledAt.getTime())
    || !Number.isInteger(quantity)
    || quantity <= 0
  ) {
    response.status(400).json({
      error: 'Estabelecimento, produto, horario previsto e quantidade inteira positiva sao obrigatorios.',
    })
    return
  }

  try {
    const product = await findProductById(productId)

    if (!product || product.estabelecimento_id !== establishmentId) {
      response.status(400).json({ error: 'Produto nao pertence ao estabelecimento informado.' })
      return
    }

    const fornada = await createSchedule({ establishmentId, productId, scheduledAt, quantity })
    response.status(201).json({ fornada })
  } catch (error) {
    console.error('Erro ao criar fornada:', error)
    response.status(500).json({ error: 'Nao foi possivel criar a fornada.' })
  }
}

export async function changeScheduleStatus(request, response) {
  const scheduleId = Number(request.params.id)
  const { status } = request.body ?? {}

  if (!Number.isInteger(scheduleId) || !scheduleStatuses.includes(status)) {
    response.status(400).json({ error: 'Status invalido.' })
    return
  }

  try {
    if (!(await findScheduleById(scheduleId))) {
      response.status(404).json({ error: 'Fornada nao encontrada.' })
      return
    }

    const fornada = await updateScheduleStatus(scheduleId, status)
    console.log(`[FORNADA #${fornada.id}] ${fornada.produto.nome} em ${fornada.estabelecimento.nome}: ${status}`)
    response.json({ fornada })
  } catch (error) {
    console.error('Erro ao atualizar fornada:', error)
    response.status(500).json({ error: 'Nao foi possivel atualizar a fornada.' })
  }
}
