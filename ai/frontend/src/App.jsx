import { useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronLeft, CircleAlert, Clock3, Flame, LoaderCircle, MapPin, Phone, RefreshCw, Trash2, Users } from 'lucide-react'
import { Link, Route, Routes } from 'react-router-dom'
import Sobre from './pages/Sobre'
import CardapioCinematico from './pages/CardapioCinematico'

const apiUrl = 'http://localhost:3000/api'

function BrandMark() {
  return (
    <Link className="flex items-center gap-3" to="/" aria-label="Clube do Pao - inicio">
      <span className="grid size-10 place-items-center rounded-2xl bg-[#f26a3d] text-white shadow-[0_8px_20px_-10px_#b53e1b]">
        <Flame size={21} strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-[#30231d]">Clube do Pao</span>
    </Link>
  )
}

function PageShell({ children, backTo = '/', backLabel = 'Inicio' }) {
  return (
    <div className="min-h-screen bg-[#fffaf2] text-[#30231d]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <BrandMark />
        {backTo === null ? (
          <nav aria-label="Navegação principal" className="flex items-center gap-2 sm:gap-3">
            <Link className="button-secondary !rounded-xl !px-3.5 !py-2 text-sm !border-[#f26a3d]/30 !text-[#c9532b] hover:!bg-[#fff0e6]" to="/cardapio">
              🥖 Cardápio
            </Link>
            <Link className="button-secondary !rounded-xl !px-3.5 !py-2 text-sm" to="/sobre">
              Sobre o projeto <ArrowRight size={16} />
            </Link>
          </nav>
        ) : (
          <Link className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#866e60] transition hover:text-[#d45128]" to={backTo}>
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            {backLabel}
          </Link>
        )}
      </header>
      {children}
    </div>
  )
}

function HomePage() {
  return (
    <PageShell backTo={null}>
      <main className="mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl items-center gap-12 px-5 pb-12 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pb-20 lg:pt-12">
        <section className="animate-rise">
          <div className="mb-6 flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f5cbb9] bg-[#fff2ea] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#c9532b]">
              <span className="size-2 rounded-full bg-[#f26a3d]" />
              Entrega todo dia
            </div>
            <Link to="/cardapio" className="inline-flex items-center gap-1.5 rounded-full border border-[#e07a3c]/30 bg-[#fff5ea] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b44820] transition hover:bg-[#ffe8d6]">
              ✨ Conheça os Pães
            </Link>
          </div>
          <h1 className="font-display max-w-xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-[#30231d] sm:text-7xl">
            O seu dia começa com pão <span className="text-[#e35b32]">quente.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#806a5d] sm:text-xl">
            Receba o Kit Pão Quente na porta de casa. Simples, fresco e feito para a sua rotina.
          </p>
          <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
            <Link className="button-primary justify-between sm:min-w-52" to="/cliente">
              Sou Cliente <ArrowRight size={18} />
            </Link>
            <Link className="button-secondary justify-between sm:min-w-64" to="/padaria">
              Acessar Painel da Padaria <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm font-semibold text-[#9a8274]">
            <span className="flex -space-x-2">
              <span className="grid size-8 place-items-center rounded-full border-2 border-[#fffaf2] bg-[#f4c095] text-xs">M</span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-[#fffaf2] bg-[#c9d7b7] text-xs">J</span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-[#fffaf2] bg-[#e9b0a0] text-xs">A</span>
            </span>
            Feito para o seu bairro
          </div>
        </section>
        <section className="relative hidden min-h-[440px] lg:block" aria-label="Ilustração de pão quente">
          <div className="absolute inset-8 rotate-3 rounded-[3rem] bg-[#f6d8bd]" />
          <div className="absolute inset-0 grid place-items-center rounded-[3rem] bg-[#f3b276] shadow-[0_30px_80px_-35px_#b65f36]">
            <div className="relative h-60 w-72 -rotate-6 rounded-[48%_52%_45%_55%] bg-[#b96232] shadow-[inset_0_-16px_0_#994722,0_26px_28px_-15px_#93451f]">
              <span className="absolute left-20 top-16 h-3 w-28 rotate-12 rounded-full bg-[#e9a466]" />
              <span className="absolute left-16 top-28 h-3 w-32 -rotate-6 rounded-full bg-[#e9a466]" />
              <span className="absolute left-24 top-40 h-3 w-24 rotate-6 rounded-full bg-[#e9a466]" />
            </div>
            <span className="absolute bottom-12 right-14 rounded-full bg-[#fff5e5] px-4 py-2 text-sm font-bold text-[#a94c28] shadow-sm">Saiu quentinho!</span>
          </div>
        </section>
      </main>
    </PageShell>
  )
}

function Field({ label, name, value, onChange, placeholder, type = 'text', icon: Icon, min }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#574238]">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b49584]" size={18} />
        <input className="field-input" name={name} value={value} onChange={onChange} placeholder={placeholder} type={type} min={min} required />
      </span>
    </label>
  )
}

function CustomerPage() {
  const [form, setForm] = useState({ nome: '', endereco: '', whatsapp: '', quantidade: '1', horario_entrega: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${apiUrl}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quantidade: Number(form.quantidade) }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Não foi possível concluir sua assinatura.')
      setIsSuccess(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell>
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="animate-rise">
          <p className="eyebrow">Sua mesa, todos os dias</p>
          <h1 className="page-title">Garanta seu pão quente.</h1>
          <p className="page-lead">Preencha seus dados e comece a receber o Kit Pão Quente na sua porta.</p>
        </div>
        {isSuccess ? (
          <section className="success-panel animate-rise mt-10" role="status">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#d5f0d4] text-[#317c42]"><Check size={28} strokeWidth={3} /></span>
            <p className="eyebrow mt-7 text-[#317c42]">Tudo certo por aqui</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-[#285e35]">Assinatura Ativa!</h2>
            <p className="mt-3 max-w-sm text-base leading-7 text-[#4d7656]">Seu pão quente diário está garantido.</p>
            <Link className="button-primary mt-8" to="/">Voltar ao início <ArrowRight size={18} /></Link>
          </section>
        ) : (
          <form className="form-panel animate-rise mt-10" onSubmit={handleSubmit}>
            <div className="mb-7 flex items-center gap-3 border-b border-[#f0e1d5] pb-5">
              <span className="grid size-10 place-items-center rounded-xl bg-[#fff0e6] text-[#d95a31]"><Flame size={20} /></span>
              <div><h2 className="font-bold text-[#44332a]">Dados da entrega</h2><p className="text-sm text-[#9a8274]">Só precisamos do essencial.</p></div>
            </div>
            <div className="space-y-5">
              <Field label="Nome completo" name="nome" value={form.nome} onChange={handleChange} placeholder="Como podemos chamar você?" icon={Users} />
              <Field label="Endereço de entrega" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número e complemento" icon={MapPin} />
              <Field label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="(00) 00000-0000" type="tel" icon={Phone} />
              <Field label="Quantidade de pães" name="quantidade" value={form.quantidade} onChange={handleChange} placeholder="Ex.: 4" type="number" min="1" icon={Users} />
              <label className="block"><span className="mb-2 block text-sm font-bold text-[#574238]">Faixa de horário</span><span className="relative block"><Clock3 className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#b49584]" size={18} /><select className="field-input field-select" name="horario_entrega" value={form.horario_entrega} onChange={handleChange} required><option value="" disabled>Escolha o melhor horário</option><option value="05:30-06:00">05:30 - 06:00</option><option value="06:00-06:30">06:00 - 06:30</option><option value="06:30-07:00">06:30 - 07:00</option><option value="07:00-07:30">07:00 - 07:30</option><option value="07:30-08:00">07:30 - 08:00</option></select></span></label>
            </div>
            {error && <p className="error-message" role="alert"><CircleAlert size={17} />{error}</p>}
            <button className="button-primary mt-7 w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><LoaderCircle className="animate-spin" size={18} /> Ativando assinatura...</> : <>Quero meu pão quente <ArrowRight size={18} /></>}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-[#a68d7d]">Sua assinatura é ativada na hora. Sem cartão, sem complicação.</p>
          </form>
        )}
      </main>
    </PageShell>
  )
}

function BakeryPage() {
  const [demand, setDemand] = useState(null)
  const [deliveryRoute, setDeliveryRoute] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDispatching, setIsDispatching] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  async function loadDashboard() {
    setIsLoading(true)
    setError('')
    try {
      const [demandResponse, routeResponse] = await Promise.all([
        fetch(`${apiUrl}/pcp/demanda`),
        fetch(`${apiUrl}/pcp/rota`),
      ])
      const [demandData, routeData] = await Promise.all([demandResponse.json(), routeResponse.json()])
      if (!demandResponse.ok) throw new Error(demandData.error || 'Não foi possível carregar a demanda.')
      if (!routeResponse.ok) throw new Error(routeData.error || 'Não foi possível carregar a rota.')
      setDemand(demandData)
      setDeliveryRoute(routeData.rota)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadDashboard() }, [])

  async function clearCustomers() {
    const confirmed = window.confirm('Tem certeza que deseja excluir todos os clientes cadastrados? Esta ação não pode ser desfeita.')
    if (!confirmed) return

    setIsClearing(true)
    setError('')
    try {
      const response = await fetch(`${apiUrl}/clientes`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Não foi possível limpar a base de clientes.')
      setToast(`Base limpa: ${data.deleted_customers} clientes removidos.`)
      window.setTimeout(() => setToast(''), 4500)
      await loadDashboard()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsClearing(false)
    }
  }

  async function startRoute() {
    setIsDispatching(true)
    setError('')
    try {
      const response = await fetch(`${apiUrl}/pcp/despacho`, { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Não foi possível iniciar a rota.')
      setToast(`${data.notifications_sent} notificações enviadas. A rota começou!`)
      window.setTimeout(() => setToast(''), 4500)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsDispatching(false)
    }
  }

  return (
    <PageShell>
      <main className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="animate-rise flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Operação de hoje</p><h1 className="page-title">Painel da padaria</h1><p className="page-lead">Tudo pronto para a próxima fornada.</p></div>
          <button className="icon-button self-start sm:self-auto" onClick={loadDashboard} disabled={isLoading} aria-label="Atualizar demanda e rota" title="Atualizar demanda e rota"><RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /></button>
        </div>
        {error && <p className="error-message mt-7" role="alert"><CircleAlert size={17} />{error}</p>}
        <section className="demand-card animate-rise mt-8">
          <div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-[#fff0e6] text-[#d95a31]"><Users size={23} /></span><span className="status-pill"><span className="size-2 rounded-full bg-[#53a85d]" />Atualizado agora</span></div>
          <p className="mt-10 text-sm font-bold uppercase tracking-[0.13em] text-[#a27762]">Demanda diária</p>
          <div className="mt-1 flex items-end gap-3"><strong className="font-display text-7xl font-bold leading-none tracking-[-0.06em] text-[#30231d]">{isLoading ? '—' : demand?.total_production ?? 0}</strong><span className="pb-1 text-lg font-semibold text-[#806a5d]">pães a produzir</span></div>
          <p className="mt-5 flex items-center gap-2 text-sm text-[#91796a]"><Clock3 size={16} />{isLoading ? 'Atualizando assinaturas...' : `${demand?.total_customers ?? 0} clientes ativos`}</p>
        </section>
        <section className="mt-8 rounded-[2rem] border border-[#f0dfd2] bg-white/70 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl bg-[#30231d] text-[#ffd6a8]"><MapPin size={19} /></span>
            <div><h2 className="font-display text-2xl font-bold">Rota do bairro</h2><p className="mt-1 text-sm leading-6 text-[#866e60]">Entregas organizadas do horário mais cedo para o mais tarde.</p></div>
          </div>
          <div className="mt-7 overflow-hidden rounded-2xl border border-[#f0dfd2] bg-[#fffdfb]">
            <div className="hidden grid-cols-[1.1fr_1.5fr_1fr_0.7fr] gap-4 border-b border-[#f0dfd2] bg-[#fff6ef] px-4 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-[#a27762] sm:grid">
              <span>Horário</span><span>Cliente</span><span>Endereço</span><span>Quantidade</span>
            </div>
            {isLoading ? <p className="px-4 py-8 text-center text-sm text-[#91796a]">Carregando rota...</p> : deliveryRoute.length === 0 ? <p className="px-4 py-8 text-center text-sm text-[#91796a]">Nenhum cliente ativo na rota de hoje.</p> : deliveryRoute.map((customer, index) => (
              <div className="grid gap-2 border-b border-[#f0dfd2] px-4 py-4 last:border-b-0 sm:grid-cols-[1.1fr_1.5fr_1fr_0.7fr] sm:items-center sm:gap-4" key={customer.id}>
                <span className="flex items-center gap-2 text-sm font-extrabold text-[#d25730]"><span className="grid size-6 place-items-center rounded-full bg-[#fff0e6] text-xs">{index + 1}</span>{customer.horario_entrega}</span>
                <span className="font-bold text-[#44332a]">{customer.nome}</span>
                <span className="text-sm text-[#806a5d]">{customer.endereco}</span>
                <span className="text-sm font-bold text-[#574238]">{customer.quantidade} pães</span>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button className="button-primary min-h-14 w-full text-base sm:w-auto sm:min-w-72" onClick={startRoute} disabled={isDispatching || isLoading || isClearing}>{isDispatching ? <><LoaderCircle className="animate-spin" size={20} /> Disparando avisos...</> : <>Iniciar Rota de Entrega <ArrowRight size={19} /></>}</button>
            <button className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-[#e6b5aa] bg-[#fff7f5] px-5 text-sm font-bold text-[#a63f32] transition hover:bg-[#ffebe7] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto" onClick={clearCustomers} disabled={isLoading || isClearing || isDispatching}>
              {isClearing ? <><LoaderCircle className="animate-spin" size={18} /> Limpando base...</> : <><Trash2 size={18} /> Limpar base de clientes</>}
            </button>
          </div>
        </section>
      </main>
      {toast && <div className="toast" role="status"><span className="grid size-9 place-items-center rounded-xl bg-[#d5f0d4] text-[#317c42]"><Check size={18} strokeWidth={3} /></span><div><strong className="block text-sm text-[#285e35]">Rota iniciada</strong><span className="text-xs text-[#4d7656]">{toast}</span></div></div>}
    </PageShell>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cardapio" element={<CardapioCinematico />} />
      <Route path="/cliente" element={<CustomerPage />} />
      <Route path="/padaria" element={<BakeryPage />} />
      <Route path="/sobre" element={<Sobre />} />
    </Routes>
  )
}
