import { all, get, run } from '../database/database.js'

const scheduleSelect = `
  SELECT f.id, f.estabelecimento_id, f.produto_id, f.horario_previsto, f.pronto_em,
         f.quantidade, f.disponivel, f.status,
         p.nome AS produto_nome, p.preco AS produto_preco, p.categoria AS produto_categoria,
         e.nome AS estabelecimento_nome, e.endereco AS estabelecimento_endereco,
         e.lat AS estabelecimento_lat, e.lng AS estabelecimento_lng
  FROM fornadas f
  JOIN produtos p ON p.id = f.produto_id
  JOIN estabelecimentos e ON e.id = f.estabelecimento_id`

function mapSchedule(row) {
  if (!row) {
    return row
  }

  return {
    id: row.id,
    estabelecimento_id: row.estabelecimento_id,
    produto_id: row.produto_id,
    horario_previsto: row.horario_previsto,
    pronto_em: row.pronto_em,
    quantidade: row.quantidade,
    disponivel: row.disponivel,
    status: row.status,
    produto: {
      id: row.produto_id,
      nome: row.produto_nome,
      preco: row.produto_preco,
      categoria: row.produto_categoria,
    },
    estabelecimento: {
      id: row.estabelecimento_id,
      nome: row.estabelecimento_nome,
      endereco: row.estabelecimento_endereco,
      lat: row.estabelecimento_lat,
      lng: row.estabelecimento_lng,
    },
  }
}

export async function findSchedules({ establishmentId, statuses, since, productName, onlyAvailable } = {}) {
  const conditions = []
  const parameters = []

  if (establishmentId) {
    conditions.push('f.estabelecimento_id = ?')
    parameters.push(establishmentId)
  }

  if (statuses?.length) {
    conditions.push(`f.status IN (${statuses.map(() => '?').join(', ')})`)
    parameters.push(...statuses)
  }

  if (since) {
    conditions.push('f.horario_previsto >= ?')
    parameters.push(since.toISOString())
  }

  if (productName) {
    conditions.push('p.nome LIKE ?')
    parameters.push(`%${productName}%`)
  }

  if (onlyAvailable) {
    conditions.push('f.disponivel > 0')
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const rows = await all(`${scheduleSelect} ${where} ORDER BY f.horario_previsto ASC, f.id ASC`, parameters)
  return rows.map(mapSchedule)
}

export async function findScheduleById(id) {
  return mapSchedule(await get(`${scheduleSelect} WHERE f.id = ?`, [id]))
}

export async function createSchedule({ establishmentId, productId, scheduledAt, quantity }) {
  const result = await run(
    `INSERT INTO fornadas (estabelecimento_id, produto_id, horario_previsto, quantidade, disponivel)
     VALUES (?, ?, ?, ?, ?)`,
    [establishmentId, productId, scheduledAt.toISOString(), quantity, quantity],
  )

  return findScheduleById(result.id)
}

export async function updateScheduleStatus(id, status) {
  await run(
    `UPDATE fornadas
     SET status = ?, pronto_em = CASE WHEN ? = 'READY' THEN ? ELSE pronto_em END
     WHERE id = ?`,
    [status, status, new Date().toISOString(), id],
  )

  return findScheduleById(id)
}

// Baixa atomica do estoque da fornada: so desconta se ainda houver unidades suficientes.
export async function takeScheduleUnits(id, quantity) {
  const result = await run(
    `UPDATE fornadas
     SET disponivel = disponivel - ?,
         status = CASE WHEN disponivel - ? = 0 THEN 'SOLD_OUT' ELSE status END
     WHERE id = ? AND status != 'SOLD_OUT' AND disponivel >= ?`,
    [quantity, quantity, id, quantity],
  )

  return result.changes === 1
}
