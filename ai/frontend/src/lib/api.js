import { readSession } from './session'

// Caminho relativo: o proxy do Vite encaminha /api para o backend, inclusive no acesso pelo IP da rede local.
const apiUrl = '/api'

async function request(path, { method = 'GET', body } = {}) {
  const token = readSession()?.token
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.error || 'Não foi possível concluir a requisição.')
    error.status = response.status
    throw error
  }

  return data
}

function toQuery(parameters) {
  const query = new URLSearchParams()
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })
  return query.size > 0 ? `?${query}` : ''
}

export const api = {
  register: (form) => request('/auth/cadastro', { method: 'POST', body: form }),
  login: (email, senha) => request('/auth/login', { method: 'POST', body: { email, senha } }),

  getEstablishments: ({ lat, lng, raio } = {}) => request(`/estabelecimentos${toQuery({ lat, lng, raio })}`),
  createEstablishment: (form) => request('/estabelecimentos', { method: 'POST', body: form }),

  getSchedules: ({ establishmentId, status } = {}) =>
    request(`/fornadas${toQuery({ estabelecimento_id: establishmentId, status })}`),
  createSchedule: (form) => request('/fornadas', { method: 'POST', body: form }),
  updateScheduleStatus: (id, status) => request(`/fornadas/${id}`, { method: 'PATCH', body: { status } }),

  getReservations: () => request('/reservas'),
  createReservation: (scheduleId, quantity) =>
    request('/reservas', { method: 'POST', body: { fornada_id: scheduleId, quantidade: quantity } }),

  getSubscriptions: () => request('/assinaturas'),
  createSubscription: (establishmentId, plano) =>
    request('/assinaturas', { method: 'POST', body: { estabelecimento_id: establishmentId, plano } }),

  runMatchmaking: ({ lat, lng, raioKm }) =>
    request('/agentes/matchmaking', { method: 'POST', body: { lat, lng, raio_km: raioKm } }),
  runDemandPrediction: (establishmentId) =>
    request('/agentes/previsao-demanda', { method: 'POST', body: { estabelecimento_id: establishmentId } }),
  runRouteOptimization: (establishmentId) =>
    request('/agentes/rotas', { method: 'POST', body: { estabelecimento_id: establishmentId } }),
  runRetention: (establishmentId) =>
    request('/agentes/retencao', { method: 'POST', body: { estabelecimento_id: establishmentId } }),
}
