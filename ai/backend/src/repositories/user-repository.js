import { get, run } from '../database/database.js'

export function findUserByEmail(email) {
  return get('SELECT * FROM usuarios WHERE email = ?', [email])
}

export async function createUser({ email, senhaHash, nome, papel, endereco, lat, lng }) {
  const result = await run(
    `INSERT INTO usuarios (email, senha_hash, nome, papel, endereco, lat, lng)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [email, senhaHash, nome, papel, endereco ?? null, lat ?? null, lng ?? null],
  )

  return get('SELECT * FROM usuarios WHERE id = ?', [result.id])
}
