import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { readSession, saveSession } from './lib/session'

const schedule = {
  id: 7,
  estabelecimento_id: 1,
  produto_id: 1,
  horario_previsto: '2026-10-05T09:00:00.000Z',
  quantidade: 30,
  disponivel: 12,
  status: 'READY',
  produto: { id: 1, nome: 'Pão Francês', preco: 1.5 },
  estabelecimento: { id: 1, nome: 'Padaria do João', endereco: 'Rua das Flores, 100' },
}

function mockApi(routes) {
  global.fetch = vi.fn(async (url, options = {}) => {
    const key = `${options.method ?? 'GET'} ${url.split('?')[0]}`
    const { status = 200, body } = routes[key] ?? { status: 404, body: { error: `Rota não mockada: ${key}` } }
    return { ok: status < 400, status, json: async () => body }
  })
}

function renderAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Marketplace de fornadas', () => {
  beforeEach(() => {
    // Armazenamento em memória: o localStorage do jsdom não fica disponível em todas as versões do Node.
    const entries = new Map()
    vi.stubGlobal('localStorage', {
      getItem: (key) => entries.get(key) ?? null,
      setItem: (key, value) => entries.set(key, String(value)),
      removeItem: (key) => entries.delete(key),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends visitors to the login page when they open the bakery operation panel', () => {
    mockApi({})
    renderAt('/operacao')

    expect(screen.getByRole('heading', { name: 'Entrar.' })).toBeInTheDocument()
  })

  it('logs a bakery admin in and opens the operation panel', async () => {
    mockApi({
      'POST /api/auth/login': { body: { token: 'token-admin', usuario: { id: 1, nome: 'João', email: 'joao@padaria.com', papel: 'ESTABLISHMENT_ADMIN' } } },
      'GET /api/estabelecimentos': { body: { estabelecimentos: [] } },
    })
    renderAt('/login')

    fireEvent.click(screen.getByRole('button', { name: 'Admin da padaria' }))
    fireEvent.click(screen.getByRole('button', { name: /^Entrar/ }))

    expect(await screen.findByRole('heading', { name: 'Operação da padaria' })).toBeInTheDocument()
    expect(readSession().token).toBe('token-admin')
    expect(await screen.findByText(/Nenhuma padaria cadastrada ainda/)).toBeInTheDocument()
  })

  it('shows the login error returned by the API', async () => {
    mockApi({ 'POST /api/auth/login': { status: 401, body: { error: 'Credenciais invalidas.' } } })
    renderAt('/login')

    fireEvent.click(screen.getByRole('button', { name: 'Consumidor' }))
    fireEvent.click(screen.getByRole('button', { name: /^Entrar/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciais invalidas.')
  })

  it('lists the batches and asks visitors to log in before reserving', async () => {
    mockApi({ 'GET /api/fornadas': { body: { fornadas: [schedule] } } })
    renderAt('/fornadas')

    expect(await screen.findByRole('heading', { name: 'Pão Francês' })).toBeInTheDocument()
    expect(screen.getByText('12 de 30 disponíveis')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Reservar/ }))

    expect(await screen.findByRole('heading', { name: 'Entrar.' })).toBeInTheDocument()
  })

  it('reserves the chosen quantity for a logged-in consumer', async () => {
    saveSession({ token: 'token-maria', usuario: { id: 3, nome: 'Maria', papel: 'CONSUMER' } })
    mockApi({
      'GET /api/fornadas': { body: { fornadas: [schedule] } },
      'POST /api/reservas': { status: 201, body: { reserva: { id: 1, status: 'CONFIRMED' } } },
    })
    renderAt('/fornadas')

    fireEvent.click(await screen.findByRole('button', { name: 'Aumentar quantidade' }))
    fireEvent.click(screen.getByRole('button', { name: /Reservar · R\$\s3,00/ }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Reserva confirmada: 2x Pão Francês')
    })

    const [, reservationOptions] = global.fetch.mock.calls.find(([url]) => url === '/api/reservas')
    expect(JSON.parse(reservationOptions.body)).toEqual({ fornada_id: 7, quantidade: 2 })
    expect(reservationOptions.headers.Authorization).toBe('Bearer token-maria')
  })

  it('hides the reserve button from bakery staff', async () => {
    saveSession({ token: 'token-admin', usuario: { id: 1, nome: 'João', papel: 'ESTABLISHMENT_ADMIN' } })
    mockApi({ 'GET /api/fornadas': { body: { fornadas: [schedule] } } })
    renderAt('/fornadas')

    expect(await screen.findByRole('heading', { name: 'Pão Francês' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Reservar/ })).not.toBeInTheDocument()
  })
})
