import { Bell, ChartNoAxesColumn, LoaderCircle, Plus, Route as RouteIcon } from 'lucide-react'
import Feedback from '../components/Feedback'
import { PageShell } from '../components/PageShell'
import ScheduleCard from '../components/ScheduleCard'
import { useBakeryOperation } from '../hooks/useBakeryOperation'
import { useEstablishmentForm } from '../hooks/useEstablishmentForm'
import { formatTime } from '../lib/format'

const agents = [
  { id: 'demand', icon: ChartNoAxesColumn, title: 'PCP · Previsão de demanda', description: 'Sugere a quantidade de cada fornada' },
  { id: 'route', icon: RouteIcon, title: 'Otimização de rotas', description: 'Ordena as entregas por proximidade' },
  { id: 'retention', icon: Bell, title: 'Retenção e upsell', description: 'Convites personalizados para a fornada pronta' },
]

function EstablishmentForm({ onCreated }) {
  const { form, isSubmitting, error, handleChange, handleSubmit } = useEstablishmentForm(onCreated)

  return (
    <details className="card mt-6">
      <summary className="cursor-pointer text-sm font-bold text-[#574238]">Cadastrar nova padaria</summary>
      <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
        <input className="field-input field-plain" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome da padaria" aria-label="Nome da padaria" required />
        <input className="field-input field-plain" name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone (opcional)" aria-label="Telefone" type="tel" />
        <input className="field-input field-plain sm:col-span-2" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço" aria-label="Endereço" required />
        <input className="field-input field-plain" name="lat" value={form.lat} onChange={handleChange} placeholder="Latitude (ex.: -23.567)" aria-label="Latitude" type="number" step="any" required />
        <input className="field-input field-plain" name="lng" value={form.lng} onChange={handleChange} placeholder="Longitude (ex.: -46.691)" aria-label="Longitude" type="number" step="any" required />
        <input className="field-input field-plain" name="produto" value={form.produto} onChange={handleChange} placeholder="Primeiro produto (ex.: Pão Francês)" aria-label="Primeiro produto" required />
        <input className="field-input field-plain" name="preco" value={form.preco} onChange={handleChange} placeholder="Preço unitário (R$)" aria-label="Preço unitário" type="number" min="0.01" step="0.01" required />
        <Feedback className="sm:col-span-2" feedback={error && { type: 'error', text: error }} />
        <button className="button-primary sm:col-span-2" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" size={18} /> : <Plus size={18} />} Cadastrar padaria
        </button>
      </form>
    </details>
  )
}

export default function Operacao() {
  const {
    establishments,
    selectedId,
    setSelectedId,
    selected,
    schedules,
    newSchedule,
    results,
    busy,
    feedback,
    isAdmin,
    handleScheduleChange,
    handleEstablishmentCreated,
    handleCreateSchedule,
    handleUpdateStatus,
    runAgent,
  } = useBakeryOperation()

  return (
    <PageShell showNav>
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-4 sm:px-8 sm:pt-8">
        <div className="animate-rise flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Fornadas e agentes de IA</p>
            <h1 className="page-title">Operação da padaria</h1>
          </div>
          {establishments.length > 1 && (
            <label className="block sm:w-72">
              <span className="mb-2 block text-sm font-bold text-[#574238]">Padaria</span>
              <select className="field-input field-plain field-select" value={selectedId ?? ''} onChange={(event) => setSelectedId(Number(event.target.value))}>
                {establishments.map((establishment) => <option key={establishment.id} value={establishment.id}>{establishment.nome}</option>)}
              </select>
            </label>
          )}
        </div>
        <Feedback className="mt-6" feedback={feedback} />
        {isAdmin && <EstablishmentForm onCreated={handleEstablishmentCreated} />}

        {selected && (
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <section>
              <h2 className="section-title">Nova fornada</h2>
              <form className="card mt-4 grid gap-3" onSubmit={handleCreateSchedule}>
                <select className="field-input field-plain field-select" name="produto_id" value={newSchedule.produto_id} onChange={handleScheduleChange} aria-label="Produto">
                  {selected.produtos.map((product) => <option key={product.id} value={product.id}>{product.nome}</option>)}
                </select>
                <input className="field-input field-plain" name="horario_previsto" value={newSchedule.horario_previsto} onChange={handleScheduleChange} type="datetime-local" aria-label="Horário previsto" required />
                <input className="field-input field-plain" name="quantidade" value={newSchedule.quantidade} onChange={handleScheduleChange} type="number" min="1" placeholder="Quantidade" aria-label="Quantidade" required />
                <button className="button-primary" type="submit" disabled={busy === 'schedule'}>
                  {busy === 'schedule' ? <LoaderCircle className="animate-spin" size={18} /> : <Plus size={18} />} Agendar fornada
                </button>
              </form>

              <h2 className="section-title mt-10">Fornadas ativas</h2>
              <div className="mt-4 grid gap-4">
                {schedules.length === 0 && <p className="text-sm text-[#91796a]">Nenhuma fornada nas últimas horas.</p>}
                {schedules.map((schedule) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} onUpdateStatus={handleUpdateStatus} isBusy={busy === `schedule-${schedule.id}`} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="section-title">Agentes de IA</h2>
              <div className="mt-4 grid gap-3">
                {agents.map((agent) => (
                  <button key={agent.id} className="card flex items-center gap-4 text-left transition hover:bg-white" type="button" onClick={() => runAgent(agent)} disabled={busy === agent.id}>
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#30231d] text-[#ffd6a8]">
                      {busy === agent.id ? <LoaderCircle className="animate-spin" size={20} /> : <agent.icon size={20} />}
                    </span>
                    <span>
                      <strong className="block text-[#44332a]">{agent.title}</strong>
                      <span className="text-sm text-[#866e60]">{agent.description}</span>
                    </span>
                  </button>
                ))}
              </div>

              {results.demand && (
                <article className="card mt-5">
                  <h3 className="font-bold text-[#44332a]">Sugestões de produção</h3>
                  <ul className="mt-3 divide-y divide-[#f0dfd2]">
                    {results.demand.sugestoes.map((suggestion) => (
                      <li className="py-3 text-sm" key={suggestion.produto_id}>
                        <div className="flex items-baseline justify-between gap-3">
                          <strong>{suggestion.produto_nome}</strong>
                          <span className="font-extrabold text-[#d25730]">{suggestion.quantidade_sugerida} un. às {formatTime(suggestion.horario_previsto)}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#91796a]">Confiança {Math.round(suggestion.confianca * 100)}% · {suggestion.justificativa}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {results.route && (
                <article className="card mt-5">
                  <h3 className="font-bold text-[#44332a]">Rota otimizada</h3>
                  <p className="mt-1 text-sm text-[#866e60]">{results.route.distancia_total_km} km · cerca de {results.route.minutos_estimados} min</p>
                  {results.route.paradas.length === 0 && <p className="mt-3 text-sm text-[#91796a]">Nenhuma entrega com endereço localizado para hoje.</p>}
                  <ol className="mt-3 space-y-2">
                    {results.route.paradas.map((stop) => (
                      <li className="flex items-start gap-3 text-sm" key={stop.usuario_id}>
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#fff0e6] text-xs font-extrabold text-[#d25730]">{stop.ordem}</span>
                        <span><strong className="text-[#44332a]">{stop.usuario_nome}</strong><br /><span className="text-[#806a5d]">{stop.endereco}</span></span>
                      </li>
                    ))}
                  </ol>
                </article>
              )}

              {results.retention && (
                <article className="card mt-5">
                  <h3 className="font-bold text-[#44332a]">Notificações de upsell</h3>
                  {results.retention.notificacoes.length === 0 && <p className="mt-3 text-sm text-[#91796a]">Nenhum padrão de compra para as fornadas prontas de hoje.</p>}
                  <ul className="mt-3 space-y-3">
                    {results.retention.notificacoes.map((notification) => (
                      <li className="rounded-2xl bg-[#f0fbef] p-3 text-sm leading-6 text-[#285e35]" key={notification.usuario_id}>{notification.mensagem}</li>
                    ))}
                  </ul>
                </article>
              )}
            </section>
          </div>
        )}
        {!selected && establishments.length === 0 && !feedback && (
          <p className="mt-10 text-sm text-[#91796a]">Nenhuma padaria cadastrada ainda. {isAdmin ? 'Cadastre a primeira acima.' : 'Peça para um administrador cadastrar a padaria.'}</p>
        )}
      </main>
    </PageShell>
  )
}
