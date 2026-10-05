import Feedback from '../components/Feedback'
import { PageShell } from '../components/PageShell'
import ScheduleCard from '../components/ScheduleCard'
import { isStaff } from '../lib/session'
import { useSchedules } from '../hooks/useSchedules'

const filters = [
  { status: '', label: 'Todas' },
  { status: 'READY', label: 'Quentinho' },
  { status: 'BAKING', label: 'Assando' },
  { status: 'SCHEDULED', label: 'Agendadas' },
]

export default function Fornadas() {
  const { schedules, filter, setFilter, isLoading, busyScheduleId, feedback, user, handleReserve } = useSchedules()

  return (
    <PageShell showNav>
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-4 sm:px-8 sm:pt-8">
        <div className="animate-rise">
          <p className="eyebrow">Direto do forno</p>
          <h1 className="page-title">Cronograma de fornadas</h1>
          <p className="page-lead">Veja o que está saindo agora e reserve com pagamento antecipado.</p>
        </div>
        <div className="-mx-1 mt-8 flex gap-2 overflow-x-auto px-1 pb-1">
          {filters.map((option) => (
            <button key={option.status} className={`chip ${filter === option.status ? 'chip-active' : ''}`} type="button" onClick={() => setFilter(option.status)}>
              {option.label}
            </button>
          ))}
        </div>
        <Feedback className="mt-5" feedback={feedback} />
        <section className="mt-5 grid gap-4">
          {isLoading && <p className="py-10 text-center text-sm text-[#91796a]">Carregando fornadas...</p>}
          {!isLoading && schedules.length === 0 && <p className="py-10 text-center text-sm text-[#91796a]">Nenhuma fornada encontrada.</p>}
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} onReserve={isStaff(user) ? undefined : handleReserve} isBusy={busyScheduleId === schedule.id} />
          ))}
        </section>
      </main>
    </PageShell>
  )
}
