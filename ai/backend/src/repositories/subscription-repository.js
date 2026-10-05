import { all, get, run } from '../database/database.js'

const subscriptionSelect = `
  SELECT a.id, a.plano, a.preco, a.status, a.saldo_cashback, a.created_at,
         e.id AS estabelecimento_id, e.nome AS estabelecimento_nome
  FROM assinaturas a
  JOIN estabelecimentos e ON e.id = a.estabelecimento_id`

function mapSubscription(row) {
  return {
    id: row.id,
    plano: row.plano,
    preco: row.preco,
    status: row.status,
    saldo_cashback: row.saldo_cashback,
    created_at: row.created_at,
    estabelecimento: { id: row.estabelecimento_id, nome: row.estabelecimento_nome },
  }
}

export async function createSubscription({ userId, establishmentId, plano, preco, status, saldoCashback }) {
  const result = await run(
    `INSERT INTO assinaturas (usuario_id, estabelecimento_id, plano, preco, status, saldo_cashback)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, establishmentId, plano, preco, status, saldoCashback],
  )

  return mapSubscription(await get(`${subscriptionSelect} WHERE a.id = ?`, [result.id]))
}

export async function findSubscriptionsByUser(userId) {
  const rows = await all(`${subscriptionSelect} WHERE a.usuario_id = ? ORDER BY a.id DESC`, [userId])
  return rows.map(mapSubscription)
}

export function findActiveSubscribersByEstablishment(establishmentId) {
  return all(
    `SELECT a.id, a.usuario_id, u.nome AS usuario_nome, u.endereco AS usuario_endereco,
            u.lat AS usuario_lat, u.lng AS usuario_lng
     FROM assinaturas a
     JOIN usuarios u ON u.id = a.usuario_id
     WHERE a.estabelecimento_id = ? AND a.status = ?
     ORDER BY a.id ASC`,
    [establishmentId, 'ACTIVE'],
  )
}
