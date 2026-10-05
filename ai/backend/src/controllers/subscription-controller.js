import { findEstablishmentById } from '../repositories/establishment-repository.js'
import { createPayment } from '../repositories/payment-repository.js'
import { createSubscription, findSubscriptionsByUser } from '../repositories/subscription-repository.js'
import { calculateCashback, processPayment } from '../services/payment-service.js'

const planPrices = { diario: 49.9, semanal: 199.9, mensal: 699.9 }

export async function listSubscriptions(request, response) {
  try {
    const assinaturas = await findSubscriptionsByUser(request.user.userId)
    response.json({ assinaturas })
  } catch (error) {
    console.error('Erro ao listar assinaturas:', error)
    response.status(500).json({ error: 'Nao foi possivel listar as assinaturas.' })
  }
}

export async function registerSubscription(request, response) {
  const { estabelecimento_id: establishmentId, plano, metodo_pagamento: paymentMethod = 'card' } = request.body ?? {}
  const price = planPrices[plano]

  if (!Number.isInteger(establishmentId) || !price) {
    response.status(400).json({ error: 'Plano ou estabelecimento invalido.' })
    return
  }

  try {
    if (!(await findEstablishmentById(establishmentId))) {
      response.status(404).json({ error: 'Estabelecimento nao encontrado.' })
      return
    }

    const paymentResult = await processPayment()
    const assinatura = await createSubscription({
      userId: request.user.userId,
      establishmentId,
      plano,
      preco: price,
      status: paymentResult.success ? 'ACTIVE' : 'CANCELLED',
      saldoCashback: paymentResult.success ? calculateCashback(price) : 0,
    })

    await createPayment({
      valor: price,
      metodo: paymentMethod,
      status: paymentResult.status,
      tipo: 'SUBSCRIPTION',
      idExterno: paymentResult.externalId,
      assinaturaId: assinatura.id,
    })

    if (!paymentResult.success) {
      response.status(402).json({ error: 'Pagamento recusado. A assinatura nao foi ativada.', assinatura })
      return
    }

    response.status(201).json({ assinatura })
  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    response.status(500).json({ error: 'Nao foi possivel criar a assinatura.' })
  }
}
