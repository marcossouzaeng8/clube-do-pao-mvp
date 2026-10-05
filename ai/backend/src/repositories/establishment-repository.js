import { all, get, run } from '../database/database.js'

export function findEstablishmentById(id) {
  return get('SELECT id, nome, endereco, lat, lng, telefone FROM estabelecimentos WHERE id = ?', [id])
}

export function findProductById(id) {
  return get('SELECT id, estabelecimento_id, nome, preco, categoria FROM produtos WHERE id = ?', [id])
}

export function findProductsByEstablishment(establishmentId) {
  return all(
    'SELECT id, estabelecimento_id, nome, preco, categoria FROM produtos WHERE estabelecimento_id = ? ORDER BY id ASC',
    [establishmentId],
  )
}

export async function findEstablishments() {
  const [establishments, products] = await Promise.all([
    all('SELECT id, nome, endereco, lat, lng, telefone FROM estabelecimentos ORDER BY id ASC'),
    all('SELECT id, estabelecimento_id, nome, preco, categoria FROM produtos ORDER BY id ASC'),
  ])

  return establishments.map((establishment) => ({
    ...establishment,
    produtos: products.filter((product) => product.estabelecimento_id === establishment.id),
  }))
}

export async function createEstablishment({ nome, endereco, lat, lng, telefone, adminUserId, produtos }) {
  const result = await run(
    `INSERT INTO estabelecimentos (nome, endereco, lat, lng, telefone, admin_usuario_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nome, endereco, lat, lng, telefone ?? null, adminUserId],
  )

  for (const product of produtos) {
    await run(
      'INSERT INTO produtos (estabelecimento_id, nome, preco, categoria) VALUES (?, ?, ?, ?)',
      [result.id, product.nome, product.preco, product.categoria ?? 'pao'],
    )
  }

  const establishment = await findEstablishmentById(result.id)
  return { ...establishment, produtos: await findProductsByEstablishment(result.id) }
}
