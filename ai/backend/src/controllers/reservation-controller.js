import { createPayment, updatePaymentStatus } from '../repositories/payment-repository.js'
import { createReservation, findReservationsByUser } from '../repositories/reservation-repository.js'
import { findScheduleById, takeScheduleUnits } from '../repositories/schedule-repository.js'
import { processPayment } from '../services/payment-service.js'

export async function listReservations(request, response) {
  try {
    const reservas = await findReservationsByUser(request.user.userId)
    response.json({ reservas })
  } catch (error) {
    console.error('Erro ao listar reservas:', error)
    response.status(500).json({ error: 'Nao foi possivel listar as reservas.' })
  }
}

export async function registerReservation(request, response) {
  const { fornada_id: scheduleId, quantidade: quantity, metodo_pagamento: paymentMethod = 'card' } = request.body ?? {}

  if (!Number.isInteger(scheduleId) || !Number.isInteger(quantity) || quantity <= 0) {
    response.status(400).json({ error: 'Fornada e quantidade inteira positiva sao obrigatorias.' })
    return
  }

  try {
    const schedule = await findScheduleById(scheduleId)

    if (!schedule) {
      response.status(404).json({ error: 'Fornada nao encontrada.' })
      return
    }

    if (schedule.status === 'SOLD_OUT' || schedule.disponivel < quantity) {
      response.status(400).json({ error: 'Quantidade indisponivel.' })
      return
    }

    const totalPrice = Math.round(schedule.produto.preco * quantity * 100) / 100
    const paymentResult = await processPayment()
    const payment = await createPayment({
      valor: totalPrice,
      metodo: paymentMethod,
      status: paymentResult.status,
      tipo: 'RESERVATION',
      idExterno: paymentResult.externalId,
    })

    // Outra reserva pode ter levado as ultimas unidades enquanto o pagamento era processado.
    const unitsTaken = paymentResult.success && (await takeScheduleUnits(scheduleId, quantity))

    if (paymentResult.success && !unitsTaken) {
      await updatePaymentStatus(payment.id, 'REFUNDED')
    }

    const reserva = await createReservation({
      userId: request.user.userId,
      scheduleId,
      quantity,
      totalPrice,
      status: unitsTaken ? 'CONFIRMED' : 'CANCELLED',
      paymentId: payment.id,
    })

    if (!paymentResult.success) {
      response.status(402).json({ error: 'Pagamento recusado. A reserva foi cancelada.', reserva })
      return
    }

    if (!unitsTaken) {
      response.status(409).json({ error: 'A fornada esgotou. O pagamento foi estornado.', reserva })
      return
    }

    response.status(201).json({ reserva })
  } catch (error) {
    console.error('Erro ao criar reserva:', error)
    response.status(500).json({ error: 'Nao foi possivel criar a reserva.' })
  }
}
