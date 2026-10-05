import assert from 'node:assert/strict'
import test from 'node:test'

process.env.DATABASE_PATH = './data/test-marketplace.db'
process.env.PAYMENT_APPROVAL_RATE = '1'

const { app } = await import('../server.js')
const { initializeDatabase, run } = await import('../database/database.js')

const tables = ['agente_logs', 'rotas_entrega', 'reservas', 'pagamentos', 'assinaturas', 'fornadas', 'produtos', 'estabelecimentos', 'usuarios']
const bakeryLocation = { lat: -23.567, lng: -46.691 }
let server
let baseUrl

async function request(method, path, { body, token } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })

  return { status: response.status, payload: await response.json() }
}

async function registerUser(papel, overrides = {}) {
  const { payload } = await request('POST', '/auth/cadastro', {
    body: { nome: `Pessoa ${papel}`, email: `${papel.toLowerCase()}@teste.com`, senha: '123456', papel, ...overrides },
  })

  return payload.token
}

async function createBakery(adminToken, overrides = {}) {
  const { payload } = await request('POST', '/estabelecimentos', {
    token: adminToken,
    body: { nome: 'Padaria Teste', endereco: 'Rua A, 1', ...bakeryLocation, produtos: [{ nome: 'Pão Francês', preco: 1.5 }], ...overrides },
  })

  return payload.estabelecimento
}

async function createSchedule(staffToken, bakery, { quantidade = 10, status } = {}) {
  const { payload } = await request('POST', '/fornadas', {
    token: staffToken,
    body: {
      estabelecimento_id: bakery.id,
      produto_id: bakery.produtos[0].id,
      horario_previsto: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      quantidade,
    },
  })

  if (status) {
    await request('PATCH', `/fornadas/${payload.fornada.id}`, { token: staffToken, body: { status } })
  }

  return payload.fornada
}

test.before(async () => {
  await initializeDatabase()
  server = app.listen(0)
  baseUrl = `http://127.0.0.1:${server.address().port}/api`
})

test.beforeEach(async () => {
  process.env.PAYMENT_APPROVAL_RATE = '1'

  for (const table of tables) {
    await run(`DELETE FROM ${table}`)
  }
})

test.after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
})

test('POST /api/auth/cadastro and /login create a session and reject duplicates and wrong passwords', async () => {
  const created = await request('POST', '/auth/cadastro', { body: { nome: 'Ana', email: 'Ana@Teste.com', senha: '123456' } })
  assert.equal(created.status, 201)
  assert.equal(created.payload.usuario.papel, 'CONSUMER')
  assert.equal(created.payload.usuario.email, 'ana@teste.com')

  const duplicate = await request('POST', '/auth/cadastro', { body: { nome: 'Ana', email: 'ana@teste.com', senha: 'outra' } })
  assert.equal(duplicate.status, 409)

  const login = await request('POST', '/auth/login', { body: { email: 'ana@teste.com', senha: '123456' } })
  assert.equal(login.status, 200)
  assert.ok(login.payload.token)

  const wrongPassword = await request('POST', '/auth/login', { body: { email: 'ana@teste.com', senha: 'errada' } })
  assert.equal(wrongPassword.status, 401)
})

test('role permissions protect reservations, schedules and bakery registration', async () => {
  const adminToken = await registerUser('ESTABLISHMENT_ADMIN')
  const operatorToken = await registerUser('ESTABLISHMENT_OPERATOR')
  const consumerToken = await registerUser('CONSUMER')
  const bakery = await createBakery(adminToken)
  const schedule = await createSchedule(operatorToken, bakery)
  const reservation = { fornada_id: schedule.id, quantidade: 1 }

  assert.equal((await request('POST', '/reservas', { body: reservation })).status, 401)
  assert.equal((await request('POST', '/reservas', { body: reservation, token: adminToken })).status, 403)
  assert.equal((await request('PATCH', `/fornadas/${schedule.id}`, { body: { status: 'READY' }, token: consumerToken })).status, 403)
  assert.equal((await request('POST', '/estabelecimentos', { body: {}, token: operatorToken })).status, 403)
  assert.equal((await request('POST', '/agentes/rotas', { body: { estabelecimento_id: bakery.id }, token: consumerToken })).status, 403)
})

test('POST /api/reservas confirms with approved payment, takes stock and sells the batch out', async () => {
  const adminToken = await registerUser('ESTABLISHMENT_ADMIN')
  const consumerToken = await registerUser('CONSUMER')
  const schedule = await createSchedule(adminToken, await createBakery(adminToken), { quantidade: 5 })

  const tooMany = await request('POST', '/reservas', { token: consumerToken, body: { fornada_id: schedule.id, quantidade: 6 } })
  assert.equal(tooMany.status, 400)

  const reserved = await request('POST', '/reservas', { token: consumerToken, body: { fornada_id: schedule.id, quantidade: 5 } })
  assert.equal(reserved.status, 201)
  assert.equal(reserved.payload.reserva.status, 'CONFIRMED')
  assert.equal(reserved.payload.reserva.valor_total, 7.5)
  assert.equal(reserved.payload.reserva.pagamento.status, 'APPROVED')

  const { payload } = await request('GET', `/fornadas?estabelecimento_id=${schedule.estabelecimento_id}`)
  assert.equal(payload.fornadas[0].disponivel, 0)
  assert.equal(payload.fornadas[0].status, 'SOLD_OUT')
})

test('POST /api/reservas cancels the reservation when the payment is declined', async () => {
  const adminToken = await registerUser('ESTABLISHMENT_ADMIN')
  const consumerToken = await registerUser('CONSUMER')
  const schedule = await createSchedule(adminToken, await createBakery(adminToken), { quantidade: 5 })
  process.env.PAYMENT_APPROVAL_RATE = '0'

  const declined = await request('POST', '/reservas', { token: consumerToken, body: { fornada_id: schedule.id, quantidade: 2 } })
  assert.equal(declined.status, 402)
  assert.equal(declined.payload.reserva.status, 'CANCELLED')

  const { payload } = await request('GET', '/fornadas')
  assert.equal(payload.fornadas[0].disponivel, 5)
})

test('concurrent reservations for the last units confirm only one and refund the other', async () => {
  const adminToken = await registerUser('ESTABLISHMENT_ADMIN')
  const consumerToken = await registerUser('CONSUMER')
  const schedule = await createSchedule(adminToken, await createBakery(adminToken), { quantidade: 5 })
  const body = { fornada_id: schedule.id, quantidade: 4 }

  const results = await Promise.all([
    request('POST', '/reservas', { token: consumerToken, body }),
    request('POST', '/reservas', { token: consumerToken, body }),
  ])

  assert.deepEqual(results.map((result) => result.status).sort(), [201, 409])
  const refunded = results.find((result) => result.status === 409)
  assert.equal(refunded.payload.reserva.status, 'CANCELLED')

  const { payload } = await request('GET', '/reservas', { token: consumerToken })
  assert.deepEqual(payload.reservas.map((reservation) => reservation.pagamento.status).sort(), ['APPROVED', 'REFUNDED'])
})

test('POST /api/assinaturas activates the plan with 5% cashback and rejects unknown plans', async () => {
  const adminToken = await registerUser('ESTABLISHMENT_ADMIN')
  const consumerToken = await registerUser('CONSUMER')
  const bakery = await createBakery(adminToken)

  const subscribed = await request('POST', '/assinaturas', { token: consumerToken, body: { estabelecimento_id: bakery.id, plano: 'semanal' } })
  assert.equal(subscribed.status, 201)
  assert.equal(subscribed.payload.assinatura.status, 'ACTIVE')
  assert.equal(subscribed.payload.assinatura.saldo_cashback, 10)

  const unknownPlan = await request('POST', '/assinaturas', { token: consumerToken, body: { estabelecimento_id: bakery.id, plano: 'anual' } })
  assert.equal(unknownPlan.status, 400)
})

test('matchmaking agent prefers the ready batch inside the radius', async () => {
  const adminToken = await registerUser('ESTABLISHMENT_ADMIN')
  const consumerToken = await registerUser('CONSUMER')
  const nearBakery = await createBakery(adminToken)
  const farBakery = await createBakery(adminToken, { nome: 'Padaria Longe', lat: -22.9, lng: -43.2 })
  await createSchedule(adminToken, nearBakery)
  const readySchedule = await createSchedule(adminToken, nearBakery, { status: 'READY' })
  await createSchedule(adminToken, farBakery, { status: 'READY' })

  const { status, payload } = await request('POST', '/agentes/matchmaking', { token: consumerToken, body: { lat: -23.563, lng: -46.654 } })
  assert.equal(status, 200)
  assert.equal(payload.matches.length, 2)
  assert.equal(payload.melhor_match.fornada_id, readySchedule.id)
  assert.equal(payload.melhor_match.espera_minutos, 0)
})

test('route agent visits subscribers and reservations by nearest neighbour', async () => {
  const adminToken = await registerUser('ESTABLISHMENT_ADMIN')
  const farToken = await registerUser('CONSUMER', { nome: 'Longe', email: 'longe@teste.com', endereco: 'Rua Longe', lat: -23.555, lng: -46.662 })
  const nearToken = await registerUser('CONSUMER', { nome: 'Perto', email: 'perto@teste.com', endereco: 'Rua Perto', lat: -23.566, lng: -46.689 })
  const bakery = await createBakery(adminToken)
  const schedule = await createSchedule(adminToken, bakery, { status: 'READY' })

  await request('POST', '/assinaturas', { token: farToken, body: { estabelecimento_id: bakery.id, plano: 'diario' } })
  await request('POST', '/reservas', { token: nearToken, body: { fornada_id: schedule.id, quantidade: 1 } })

  const { status, payload } = await request('POST', '/agentes/rotas', { token: adminToken, body: { estabelecimento_id: bakery.id } })
  assert.equal(status, 200)
  assert.deepEqual(payload.paradas.map((stop) => stop.usuario_nome), ['Perto', 'Longe'])
  assert.deepEqual(payload.paradas.map((stop) => stop.ordem), [1, 2])
  assert.ok(payload.distancia_total_km > 0)
})

test('demand and retention agents answer for the bakery', async () => {
  const adminToken = await registerUser('ESTABLISHMENT_ADMIN')
  const consumerToken = await registerUser('CONSUMER')
  const bakery = await createBakery(adminToken)
  const schedule = await createSchedule(adminToken, bakery, { quantidade: 20, status: 'READY' })

  for (const quantidade of [2, 4]) {
    await request('POST', '/reservas', { token: consumerToken, body: { fornada_id: schedule.id, quantidade } })
  }

  const demand = await request('POST', '/agentes/previsao-demanda', { token: adminToken, body: { estabelecimento_id: bakery.id } })
  assert.equal(demand.status, 200)
  assert.equal(demand.payload.sugestoes.length, 1)
  assert.equal(demand.payload.sugestoes[0].confianca, 0.65)
  assert.ok(demand.payload.sugestoes[0].quantidade_sugerida >= 3)

  const retention = await request('POST', '/agentes/retencao', { token: adminToken, body: { estabelecimento_id: bakery.id } })
  assert.equal(retention.status, 200)
  assert.equal(retention.payload.notificacoes.length, 1)
  assert.match(retention.payload.notificacoes[0].mensagem, /Pão Francês/)

  const unknownBakery = await request('POST', '/agentes/previsao-demanda', { token: adminToken, body: { estabelecimento_id: 9999 } })
  assert.equal(unknownBakery.status, 404)
})
