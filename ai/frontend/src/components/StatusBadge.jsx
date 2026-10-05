export default function StatusBadge({ status, labels }) {
  const { label, className } = labels[status] ?? { label: status, className: 'bg-[#f3ece6] text-[#806a5d]' }

  return <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-extrabold ${className}`}>{label}</span>
}
