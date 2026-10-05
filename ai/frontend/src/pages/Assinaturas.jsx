import { LoaderCircle } from 'lucide-react'
import Feedback from '../components/Feedback'
import { PageShell } from '../components/PageShell'
import StatusBadge from '../components/StatusBadge'
import { formatCurrency, orderStatusLabels } from '../lib/format'
import { useSubscriptions } from '../hooks/useSubscriptions'

const plans = [
  { id: 'diario', name: 'Diário', price: 49.9, description: 'Pão fresco todo dia' },
  { id: 'semanal', name: 'Semanal', price: 199.9, description: '5 dias por semana' },
  { id: 'mensal', name: 'Mensal', price: 699.9, description: 'O mês inteiro garantido' },
]
const planNames = Object.fromEntries(plans.map((plan) => [plan.id, plan.name]))

export default function Assinaturas() {
  const { subscriptions, establishments, selectedEstablishment, setSelectedEstablishment, isLoading, busyPlan, feedback, subscribe } = useSubscriptions()

  return (
    <PageShell showNav>
      <main className="mx-auto max-w-4xl px-5 pb-16 pt-4 sm:px-8 sm:pt-8">
        <div className="animate-rise">
          <p className="eyebrow">Receita de todo dia</p>
          <h1 className="page-title">Assinaturas</h1>
          <p className="page-lead">Assine uma padaria e acumule 5% de cashback a cada pagamento.</p>
        </div>
        <Feedback className="mt-6" feedback={feedback} />
        {isLoading ? <p className="py-10 text-center text-sm text-[#91796a]">Carregando assinaturas...</p> : (
          <>
            {subscriptions.length > 0 && (
              <section className="mt-8">
                <h2 className="section-title">Suas assinaturas</h2>
                <div className="mt-4 grid gap-3">
                  {subscriptions.map((subscription) => (
                    <article className="card flex items-start justify-between gap-3" key={subscription.id}>
                      <div>
                        <h3 className="font-bold text-[#44332a]">{subscription.estabelecimento.nome}</h3>
                        <p className="text-sm text-[#866e60]">Plano {planNames[subscription.plano] ?? subscription.plano} · {formatCurrency(subscription.preco)}</p>
                        <p className="mt-2 text-sm font-extrabold text-[#d25730]">Cashback: {formatCurrency(subscription.saldo_cashback)}</p>
                      </div>
                      <StatusBadge status={subscription.status} labels={orderStatusLabels} />
                    </article>
                  ))}
                </div>
              </section>
            )}
            <section className="mt-10">
              <h2 className="section-title">Escolha um plano</h2>
              <label className="mt-4 block max-w-md">
                <span className="mb-2 block text-sm font-bold text-[#574238]">Padaria</span>
                <select className="field-input field-plain field-select" value={selectedEstablishment} onChange={(event) => setSelectedEstablishment(event.target.value)}>
                  {establishments.map((establishment) => <option key={establishment.id} value={establishment.id}>{establishment.nome}</option>)}
                </select>
              </label>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <article className="card text-center" key={plan.id}>
                    <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                    <p className="font-display my-3 text-4xl font-bold tracking-tight text-[#e35b32]">{formatCurrency(plan.price)}</p>
                    <p className="text-sm text-[#866e60]">{plan.description}</p>
                    <button className="button-primary mt-5 w-full !py-2.5" type="button" onClick={() => subscribe(plan)} disabled={busyPlan !== null || !selectedEstablishment}>
                      {busyPlan === plan.id ? <><LoaderCircle className="animate-spin" size={17} /> Pagando...</> : 'Assinar'}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </PageShell>
  )
}
