export const scheduleStatusLabels = {
  SCHEDULED: { label: 'Agendada', className: 'bg-[#f3ece6] text-[#806a5d]' },
  BAKING: { label: 'Assando', className: 'bg-[#fff0c9] text-[#96690d]' },
  READY: { label: 'Quentinho!', className: 'bg-[#d5f0d4] text-[#317c42]' },
  SOLD_OUT: { label: 'Esgotada', className: 'bg-[#ffe1dc] text-[#b33d32]' },
}

export const orderStatusLabels = {
  ACTIVE: { label: 'Ativa', className: 'bg-[#d5f0d4] text-[#317c42]' },
  CONFIRMED: { label: 'Confirmada', className: 'bg-[#d5f0d4] text-[#317c42]' },
  DELIVERED: { label: 'Entregue', className: 'bg-[#d5f0d4] text-[#317c42]' },
  PENDING: { label: 'Pendente', className: 'bg-[#f3ece6] text-[#806a5d]' },
  CANCELLED: { label: 'Cancelada', className: 'bg-[#ffe1dc] text-[#b33d32]' },
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatCurrency(value) {
  return currencyFormatter.format(value)
}

export function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
