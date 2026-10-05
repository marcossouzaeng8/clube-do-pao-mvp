export default function Field({ label, name, value, onChange, placeholder, type = 'text', icon: Icon, min, step, required = true }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#574238]">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b49584]" size={18} />
        <input className="field-input" name={name} value={value} onChange={onChange} placeholder={placeholder} type={type} min={min} step={step} required={required} />
      </span>
    </label>
  )
}
