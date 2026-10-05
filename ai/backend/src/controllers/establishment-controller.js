import { createEstablishment, findEstablishments } from '../repositories/establishment-repository.js'
import { findSchedules } from '../repositories/schedule-repository.js'
import { haversineDistance, roundTwo } from '../utils/geo.js'

const defaultRadiusKm = 10
const schedulesPerEstablishment = 5
const lookbackMs = 60 * 60 * 1000

function isValidProduct(product) {
  return Boolean(product?.nome?.trim()) && Number.isFinite(product.preco) && product.preco > 0
}

export async function listEstablishments(request, response) {
  const lat = Number.parseFloat(request.query.lat)
  const lng = Number.parseFloat(request.query.lng)
  const radius = Number.parseFloat(request.query.raio) || defaultRadiusKm
  const hasLocation = Number.isFinite(lat) && Number.isFinite(lng)

  try {
    const [establishments, schedules] = await Promise.all([
      findEstablishments(),
      findSchedules({ statuses: ['SCHEDULED', 'BAKING', 'READY'], since: new Date(Date.now() - lookbackMs) }),
    ])

    const estabelecimentos = establishments
      .map((establishment) => ({
        ...establishment,
        fornadas: schedules
          .filter((schedule) => schedule.estabelecimento_id === establishment.id)
          .slice(0, schedulesPerEstablishment),
        distancia_km: hasLocation ? roundTwo(haversineDistance(lat, lng, establishment.lat, establishment.lng)) : null,
      }))
      .filter((establishment) => !hasLocation || establishment.distancia_km <= radius)
      .sort((first, second) => (first.distancia_km ?? 0) - (second.distancia_km ?? 0))

    response.json({ estabelecimentos })
  } catch (error) {
    console.error('Erro ao listar estabelecimentos:', error)
    response.status(500).json({ error: 'Nao foi possivel listar os estabelecimentos.' })
  }
}

export async function registerEstablishment(request, response) {
  const { nome, endereco, telefone, produtos = [] } = request.body ?? {}
  const lat = Number.parseFloat(request.body?.lat)
  const lng = Number.parseFloat(request.body?.lng)

  if (
    !nome?.trim()
    || !endereco?.trim()
    || !Number.isFinite(lat)
    || !Number.isFinite(lng)
    || !Array.isArray(produtos)
    || !produtos.every(isValidProduct)
  ) {
    response.status(400).json({
      error: 'Nome, endereco, latitude, longitude e produtos com nome e preco positivo sao obrigatorios.',
    })
    return
  }

  try {
    const estabelecimento = await createEstablishment({
      nome: nome.trim(),
      endereco: endereco.trim(),
      lat,
      lng,
      telefone: telefone?.trim() || null,
      adminUserId: request.user.userId,
      produtos: produtos.map((product) => ({ ...product, nome: product.nome.trim() })),
    })

    response.status(201).json({ estabelecimento })
  } catch (error) {
    console.error('Erro ao cadastrar estabelecimento:', error)
    response.status(500).json({ error: 'Nao foi possivel cadastrar o estabelecimento.' })
  }
}
