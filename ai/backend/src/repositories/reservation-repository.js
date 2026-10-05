import { all, get, run } from '../database/database.js'

const reservationSelect = `
  SELECT r.id, r.quantidade, r.valor_total, r.status, r.created_at,
         f.id AS fornada_id, f.horario_previsto, f.status AS fornada_status,
         p.nome AS produto_nome, p.preco AS produto_preco,
         e.id AS estabelecimento_id, e.nome AS estabelecimento_nome, e.endereco AS estabelecimento_endereco,
         pg.status AS pagamento_status, pg.id_externo AS pagamento_id_externo
  FROM reservas r
  JOIN fornadas f ON f.id = r.fornada_id
  JOIN produtos p ON p.id = f.produto_id
  JOIN estabelecimentos e ON e.id = f.estabelecimento_id
  LEFT JOIN pagamentos pg ON pg.id = r.pagamento_id`

function mapReservation(row) {
  return {
    id: row.id,
    quantidade: row.quantidade,
    valor_total: row.valor_total,
    status: row.status,
    created_at: row.created_at,
    fornada: {
      id: row.fornada_id,
      horario_previsto: row.horario_previsto,
      status: row.fornada_status,
      produto: { nome: row.produto_nome, preco: row.produto_preco },
      estabelecimento: {
        id: row.estabelecimento_id,
        nome: row.estabelecimento_nome,
        endereco: row.estabelecimento_endereco,
      },
    },
    pagamento: { status: row.pagamento_status, id_externo: row.pagamento_id_externo },
  }
}

export async function createReservation({ userId, scheduleId, quantity, totalPrice, status, paymentId }) {
  const result = await run(
    `INSERT INTO reservas (usuario_id, fornada_id, quantidade, valor_total, status, pagamento_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, scheduleId, quantity, totalPrice, status, paymentId, new Date().toISOString()],
  )

  return mapReservation(await get(`${reservationSelect} WHERE r.id = ?`, [result.id]))
}

export async function findReservationsByUser(userId) {
  const rows = await all(`${reservationSelect} WHERE r.usuario_id = ? ORDER BY r.created_at DESC, r.id DESC`, [userId])
  return rows.map(mapReservation)
}

// Base de leitura dos agentes: reservas de um estabelecimento com os dados de entrega do consumidor.
export function findReservationsForAnalysis({ establishmentId, productId, statuses, since, until }) {
  const conditions = ['f.estabelecimento_id = ?', `r.status IN (${statuses.map(() => '?').join(', ')})`, 'r.created_at >= ?']
  const parameters = [establishmentId, ...statuses, since.toISOString()]

  if (productId) {
    conditions.push('f.produto_id = ?')
    parameters.push(productId)
  }

  if (until) {
    conditions.push('r.created_at <= ?')
    parameters.push(until.toISOString())
  }

  return all(
    `SELECT r.id, r.usuario_id, r.quantidade, r.created_at, f.produto_id,
            u.nome AS usuario_nome, u.endereco AS usuario_endereco, u.lat AS usuario_lat, u.lng AS usuario_lng
     FROM reservas r
     JOIN fornadas f ON f.id = r.fornada_id
     JOIN usuarios u ON u.id = r.usuario_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY r.id ASC`,
    parameters,
  )
}
