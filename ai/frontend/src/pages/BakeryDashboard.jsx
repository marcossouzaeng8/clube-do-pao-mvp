import { ArrowRight, Check, CircleAlert, Clock3, LoaderCircle, MapPin, RefreshCw, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'
import { usePcp } from '../hooks/usePcp'

export default function BakeryPage() {
  const {
    demand,
    deliveryRoute,
    isLoading,
    isDispatching,
    isClearing,
    error,
    toast,
    loadDashboard,
    clearCustomers,
    startRoute,
  } = usePcp()

  return (
    <PageShell>
      <main className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="animate-rise flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Operação de hoje</p><h1 className="page-title">Painel da padaria</h1><p className="page-lead">Tudo pronto para a próxima fornada.</p></div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link className="button-secondary !rounded-xl !px-3.5 !py-2 text-sm" to="/operacao">Fornadas e agentes de IA <ArrowRight size={16} /></Link>
            <button className="icon-button" onClick={loadDashboard} disabled={isLoading} aria-label="Atualizar demanda e rota" title="Atualizar demanda e rota"><RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /></button>
          </div>
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
