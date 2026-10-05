import { findEstablishmentById } from '../repositories/establishment-repository.js'
import { runDemandPrediction } from '../services/agents/demand-prediction-agent.js'
import { runMatchmaking } from '../services/agents/matchmaking-agent.js'
import { runRetentionUpsell } from '../services/agents/retention-upsell-agent.js'
import { runRouteOptimization } from '../services/agents/route-optimization-agent.js'

async function findRequestedEstablishment(request, response) {
  const establishmentId = request.body?.estabelecimento_id

  if (!Number.isInteger(establishmentId)) {
    response.status(400).json({ error: 'Estabelecimento obrigatorio.' })
    return null
  }

  const establishment = await findEstablishmentById(establishmentId)

  if (!establishment) {
    response.status(404).json({ error: 'Estabelecimento nao encontrado.' })
    return null
  }

  return establishment
}

export async function predictDemand(request, response) {
  try {
    const establishment = await findRequestedEstablishment(request, response)
    if (!establishment) return

    response.json(await runDemandPrediction({ establishmentId: establishment.id }))
  } catch (error) {
    console.error('Erro no agente de previsao de demanda:', error)
    response.status(500).json({ error: 'Nao foi possivel prever a demanda.' })
  }
}

export async function findBestMatch(request, response) {
  const { produto } = request.body ?? {}
  const userLat = Number.parseFloat(request.body?.lat)
  const userLng = Number.parseFloat(request.body?.lng)
  const maxRadiusKm = Number.parseFloat(request.body?.raio_km)

  if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) {
    response.status(400).json({ error: 'Localizacao obrigatoria.' })
    return
  }

  try {
    response.json(await runMatchmaking({
      userLat,
      userLng,
      productName: produto?.trim() || undefined,
      maxRadiusKm: Number.isFinite(maxRadiusKm) ? maxRadiusKm : undefined,
    }))
  } catch (error) {
    console.error('Erro no agente de matchmaking:', error)
    response.status(500).json({ error: 'Nao foi possivel buscar o pao quente mais proximo.' })
  }
}

export async function optimizeRoute(request, response) {
  try {
    const establishment = await findRequestedEstablishment(request, response)
    if (!establishment) return

    response.json(await runRouteOptimization({ establishment }))
  } catch (error) {
    console.error('Erro no agente de rotas:', error)
    response.status(500).json({ error: 'Nao foi possivel otimizar a rota.' })
  }
}

export async function suggestUpsell(request, response) {
  try {
    const establishment = await findRequestedEstablishment(request, response)
    if (!establishment) return

    response.json(await runRetentionUpsell({ establishmentId: establishment.id }))
  } catch (error) {
    console.error('Erro no agente de retencao:', error)
    response.status(500).json({ error: 'Nao foi possivel gerar as notificacoes.' })
  }
}
