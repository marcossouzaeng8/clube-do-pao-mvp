import { run } from '../database/database.js'

export function logAgentRun(agentType, input, output) {
  return run(
    'INSERT INTO agente_logs (tipo_agente, entrada, saida) VALUES (?, ?, ?)',
    [agentType, JSON.stringify(input), JSON.stringify(output)],
  )
}

export async function createDeliveryRoute({ establishmentId, date, stops, totalDistanceKm, estimatedMinutes }) {
  const result = await run(
    `INSERT INTO rotas_entrega (estabelecimento_id, data, paradas, distancia_total_km, minutos_estimados)
     VALUES (?, ?, ?, ?, ?)`,
    [establishmentId, date.toISOString(), JSON.stringify(stops), totalDistanceKm, estimatedMinutes],
  )

  return result.id
}
