import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback'
import { PageShell } from '../components/PageShell'
import StatusBadge from '../components/StatusBadge'
import { formatCurrency, formatTime, orderStatusLabels } from '../lib/format'
import { useReservations } from '../hooks/useReservations'

export default function Reservas() {
  const { reservations, isLoading, error } = useReservations()

  return (
    <PageShell showNav>
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-4 sm:px-8 sm:pt-8">
        <div className="animate-rise">
          <p className="eyebrow">Seu pão garantido</p>
          <h1 className="page-title">Minhas reservas</h1>
        </div>
        <Feedback className="mt-6" feedback={error && { type: 'error', text: error }} />
        <section className="mt-8 grid gap-4">
          {isLoading && <p className="py-10 text-center text-sm text-[#91796a]">Carregando reservas...</p>}
          {!isLoading && !error && reservations.length === 0 && (
            <div className="card text-center">
              <p className="text-sm text-[#866e60]">Você ainda não reservou nenhuma fornada.</p>
              <Link className="button-primary mt-4" to="/fornadas">Ver fornadas <ArrowRight size={18} /></Link>
            </div>
          )}
          {reservations.map((reservation) => (
            <article className="card flex items-start justify-between gap-3" key={reservation.id}>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold">{reservation.quantidade}x {reservation.fornada.produto.nome}</h2>
                <p className="truncate text-sm text-[#866e60]">{reservation.fornada.estabelecimento.nome} · fornada das {formatTime(reservation.fornada.horario_previsto)}</p>
                <p className="mt-2 text-sm font-extrabold text-[#d25730]">{formatCurrency(reservation.valor_total)}</p>
              </div>
              <StatusBadge status={reservation.status} labels={orderStatusLabels} />
            </article>
          ))}
        </section>
      </main>
    </PageShell>
  )
}
