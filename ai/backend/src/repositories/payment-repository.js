import { get, run } from '../database/database.js'

export async function createPayment({ valor, metodo, status, tipo, idExterno, assinaturaId }) {
  const result = await run(
    `INSERT INTO pagamentos (valor, metodo, status, tipo, id_externo, assinatura_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [valor, metodo, status, tipo, idExterno, assinaturaId ?? null],
  )

  return get('SELECT id, valor, metodo, status, tipo, id_externo FROM pagamentos WHERE id = ?', [result.id])
}

export function updatePaymentStatus(id, status) {
  return run('UPDATE pagamentos SET status = ? WHERE id = ?', [status, id])
}
