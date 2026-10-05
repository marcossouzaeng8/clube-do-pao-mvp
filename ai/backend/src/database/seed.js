import 'dotenv/config'
import { createEstablishment } from '../repositories/establishment-repository.js'
import { createPayment } from '../repositories/payment-repository.js'
import { createSchedule, findSchedules, takeScheduleUnits, updateScheduleStatus } from '../repositories/schedule-repository.js'
import { createSubscription } from '../repositories/subscription-repository.js'
import { createUser } from '../repositories/user-repository.js'
import { hashPassword } from '../services/auth-service.js'
import { initializeDatabase, run } from './database.js'

const demoPassword = '123456'
const hourMs = 60 * 60 * 1000
const dayMs = 24 * hourMs

// Mantem a tabela `clientes` (assinatura simples do MVP base) intacta.
const seededTables = [
  'agente_logs',
  'rotas_entrega',
  'reservas',
  'pagamentos',
  'assinaturas',
  'fornadas',
  'produtos',
  'estabelecimentos',
  'usuarios',
]

async function seedReservation({ userId, scheduleId, quantity, totalPrice, createdAt }) {
  const payment = await createPayment({
    valor: totalPrice,
    metodo: 'card',
    status: 'APPROVED',
    tipo: 'RESERVATION',
    idExterno: `mock_seed_${scheduleId}_${createdAt.getTime()}`,
  })

  await run(
    `INSERT INTO reservas (usuario_id, fornada_id, quantidade, valor_total, status, pagamento_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, scheduleId, quantity, totalPrice, 'CONFIRMED', payment.id, createdAt.toISOString()],
  )
}

async function seed() {
  const connection = await initializeDatabase()

  for (const table of seededTables) {
    await run(`DELETE FROM ${table}`)
  }
  await run(`DELETE FROM sqlite_sequence WHERE name IN (${seededTables.map(() => '?').join(', ')})`, seededTables)

  const senhaHash = await hashPassword(demoPassword)

  const admin = await createUser({
    email: 'joao@padaria.com',
    senhaHash,
    nome: 'João Silva',
    papel: 'ESTABLISHMENT_ADMIN',
    endereco: 'Rua das Flores, 100 — Pinheiros, SP',
    lat: -23.567,
    lng: -46.691,
  })
  await createUser({
    email: 'operador@padaria.com',
    senhaHash,
    nome: 'Carlos Operador',
    papel: 'ESTABLISHMENT_OPERATOR',
  })
  const maria = await createUser({
    email: 'maria@email.com',
    senhaHash,
    nome: 'Maria Consumidora',
    papel: 'CONSUMER',
    endereco: 'Av. Paulista, 500 — Bela Vista, SP',
    lat: -23.563,
    lng: -46.654,
  })
  const pedro = await createUser({
    email: 'pedro@email.com',
    senhaHash,
    nome: 'Pedro Santos',
    papel: 'CONSUMER',
    endereco: 'Rua Augusta, 200 — Consolação, SP',
    lat: -23.555,
    lng: -46.662,
  })

  const padariaDoJoao = await createEstablishment({
    nome: 'Padaria do João',
    endereco: 'Rua das Flores, 100 — Pinheiros, SP',
    lat: -23.567,
    lng: -46.691,
    telefone: '(11) 3456-7890',
    adminUserId: admin.id,
    produtos: [
      { nome: 'Pão Francês', preco: 1.5 },
      { nome: 'Pão de Queijo', preco: 3.0 },
      { nome: 'Croissant', preco: 8.0, categoria: 'paes_especiais' },
    ],
  })
  const fornoDeOuro = await createEstablishment({
    nome: 'Forno de Ouro',
    endereco: 'Av. Brigadeiro Faria Lima, 300 — Itaim, SP',
    lat: -23.578,
    lng: -46.686,
    telefone: '(11) 9876-5432',
    adminUserId: admin.id,
    produtos: [
      { nome: 'Pão Francês', preco: 1.8 },
      { nome: 'Pão Integral', preco: 2.5 },
      { nome: 'Baguete', preco: 12.0, categoria: 'paes_especiais' },
    ],
  })

  const schedules = [
    { product: padariaDoJoao.produtos[0], status: 'READY', hoursFromNow: -0.5, quantity: 30 },
    { product: padariaDoJoao.produtos[1], status: 'BAKING', hoursFromNow: 0.2, quantity: 20 },
    { product: padariaDoJoao.produtos[0], status: 'SCHEDULED', hoursFromNow: 2, quantity: 40 },
    { product: fornoDeOuro.produtos[0], status: 'READY', hoursFromNow: -0.3, quantity: 25 },
    { product: fornoDeOuro.produtos[2], status: 'SCHEDULED', hoursFromNow: 1.5, quantity: 15 },
  ]

  for (const schedule of schedules) {
    const created = await createSchedule({
      establishmentId: schedule.product.estabelecimento_id,
      productId: schedule.product.id,
      scheduledAt: new Date(Date.now() + schedule.hoursFromNow * hourMs),
      quantity: schedule.quantity,
    })

    if (schedule.status !== 'SCHEDULED') {
      await updateScheduleStatus(created.id, schedule.status)
    }
  }

  await createSubscription({
    userId: maria.id,
    establishmentId: padariaDoJoao.id,
    plano: 'diario',
    preco: 49.9,
    status: 'ACTIVE',
    saldoCashback: 2.5,
  })

  const [readySchedule] = await findSchedules({ establishmentId: padariaDoJoao.id, statuses: ['READY'] })
  const unitPrice = readySchedule.produto.preco

  await takeScheduleUnits(readySchedule.id, 2)
  await seedReservation({
    userId: maria.id,
    scheduleId: readySchedule.id,
    quantity: 2,
    totalPrice: unitPrice * 2,
    createdAt: new Date(),
  })

  // Historico de Pedro no mesmo dia da semana: alimenta o agente de retencao e upsell.
  for (const weeksAgo of [1, 2]) {
    await seedReservation({
      userId: pedro.id,
      scheduleId: readySchedule.id,
      quantity: 6,
      totalPrice: unitPrice * 6,
      createdAt: new Date(Date.now() - weeksAgo * 7 * dayMs),
    })
  }

  await connection.close()

  console.log('Seed concluido! Contas demo (senha 123456):')
  console.log('  Consumidor: maria@email.com')
  console.log('  Admin da padaria: joao@padaria.com')
  console.log('  Operador: operador@padaria.com')
}

seed().catch((error) => {
  console.error('Nao foi possivel popular o banco:', error)
  process.exit(1)
})
