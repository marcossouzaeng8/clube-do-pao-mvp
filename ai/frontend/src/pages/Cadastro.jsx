import { ArrowRight, KeyRound, LoaderCircle, Mail, MapPin, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback'
import Field from '../components/Field'
import { PageShell } from '../components/PageShell'
import { useRegistration } from '../hooks/useRegistration'

const roleOptions = [
  { value: 'CONSUMER', label: 'Consumidor' },
  { value: 'ESTABLISHMENT_ADMIN', label: 'Dono de padaria (ADM)' },
  { value: 'ESTABLISHMENT_OPERATOR', label: 'Operador de padaria' },
]

export default function Cadastro() {
  const { form, isSubmitting, error, handleChange, handleSubmit } = useRegistration()

  return (
    <PageShell showNav>
      <main className="mx-auto max-w-xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="animate-rise">
          <p className="eyebrow">Bem-vindo ao clube</p>
          <h1 className="page-title">Criar conta.</h1>
          <p className="page-lead">Reserve pão quente perto de você ou coloque a sua padaria no mapa.</p>
        </div>
        <form className="form-panel animate-rise mt-10" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <Field label="Nome" name="nome" value={form.nome} onChange={handleChange} placeholder="Como podemos chamar você?" icon={UserRound} />
            <Field label="Email" name="email" value={form.email} onChange={handleChange} placeholder="voce@email.com" type="email" icon={Mail} />
            <Field label="Senha" name="senha" value={form.senha} onChange={handleChange} placeholder="Crie uma senha" type="password" icon={KeyRound} />
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#574238]">Tipo de conta</span>
              <select className="field-input field-plain field-select" name="papel" value={form.papel} onChange={handleChange}>
                {roleOptions.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
              </select>
            </label>
            <Field label="Endereço (opcional)" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número e bairro" icon={MapPin} required={false} />
          </div>
          <Feedback className="mt-5" feedback={error && { type: 'error', text: error }} />
          <button className="button-primary mt-7 w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><LoaderCircle className="animate-spin" size={18} /> Cadastrando...</> : <>Criar conta <ArrowRight size={18} /></>}
          </button>
          <p className="mt-4 text-center text-sm text-[#866e60]">
            Já tem conta? <Link className="font-bold text-[#d25730] hover:underline" to="/login">Entrar</Link>
          </p>
        </form>
      </main>
    </PageShell>
  )
}
