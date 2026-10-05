import { useState } from 'react'
import { Clock3, Flame, LoaderCircle, Minus, Plus } from 'lucide-react'
import { formatCurrency, formatTime, scheduleStatusLabels } from '../lib/format'
import StatusBadge from './StatusBadge'

const nextStatus = {
  SCHEDULED: { status: 'BAKING', label: 'Iniciar fornada' },
  BAKING: { status: 'READY', label: 'Pão pronto!' },
}

export default function ScheduleCard({ schedule, onReserve, onUpdateStatus, isBusy = false }) {
  const [quantity, setQuantity] = useState(1)
  const canReserve = onReserve && schedule.status !== 'SOLD_OUT' && schedule.disponivel > 0
  const nextStep = onUpdateStatus ? nextStatus[schedule.status] : null

  return (
    <article className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold text-[#30231d]">{schedule.produto.nome}</h3>
          <p className="truncate text-sm text-[#866e60]">{schedule.estabelecimento.nome}</p>
        </div>
        <StatusBadge status={schedule.status} labels={scheduleStatusLabels} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-[#806a5d]">
        <span className="inline-flex items-center gap-1.5"><Clock3 size={15} /> Fornada às {formatTime(schedule.horario_previsto)}</span>
        <span>{schedule.disponivel} de {schedule.quantidade} disponíveis</span>
        <strong className="text-[#d25730]">{formatCurrency(schedule.produto.preco)}</strong>
      </div>
      {canReserve && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center rounded-2xl border border-[#ead9ce] bg-[#fffdfb]">
            <button className="grid size-11 place-items-center text-[#8b6856]" type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Diminuir quantidade"><Minus size={16} /></button>
            <span className="w-8 text-center text-sm font-extrabold" aria-live="polite">{quantity}</span>
            <button className="grid size-11 place-items-center text-[#8b6856]" type="button" onClick={() => setQuantity((current) => Math.min(schedule.disponivel, current + 1))} aria-label="Aumentar quantidade"><Plus size={16} /></button>
          </div>
          <button className="button-primary flex-1 !py-2.5" type="button" onClick={() => onReserve(schedule, quantity)} disabled={isBusy}>
            {isBusy ? <><LoaderCircle className="animate-spin" size={17} /> Pagando...</> : <>Reservar · {formatCurrency(schedule.produto.preco * quantity)}</>}
          </button>
        </div>
      )}
      {nextStep && (
        <button className="button-secondary mt-4 w-full !py-2.5" type="button" onClick={() => onUpdateStatus(schedule, nextStep.status)} disabled={isBusy}>
          <Flame size={17} /> {nextStep.label}
        </button>
      )}
    </article>
  )
}
