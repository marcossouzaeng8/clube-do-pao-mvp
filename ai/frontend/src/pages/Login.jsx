import { ArrowRight, KeyRound, LoaderCircle, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback'
import Field from '../components/Field'
import { PageShell } from '../components/PageShell'
import { useLogin } from '../hooks/useLogin'

const demoAccounts = [
  { label: 'Consumidor', email: 'maria@email.com' },
  { label: 'Admin da padaria', email: 'joao@padaria.com' },
  { label: 'Operador', email: 'operador@padaria.com' },
]

export default function Login() {
  const { form, isSubmitting, error, handleChange, handleSubmit, fillDemoAccount } = useLogin()

  return (
    <PageShell showNav>
      <main className="mx-auto max-w-xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="animate-rise">
          <p className="eyebrow">Que bom te ver</p>
          <h1 className="page-title">Entrar.</h1>
          <p className="page-lead">Acesse suas reservas, assinaturas ou a operação da sua padaria.</p>
        </div>
        <form className="form-panel animate-rise mt-10" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <Field label="Email" name="email" value={form.email} onChange={handleChange} placeholder="voce@email.com" type="email" icon={Mail} />
            <Field label="Senha" name="senha" value={form.senha} onChange={handleChange} placeholder="Sua senha" type="password" icon={KeyRound} />
          </div>
          <Feedback className="mt-5" feedback={error && { type: 'error', text: error }} />
          <button className="button-primary mt-7 w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><LoaderCircle className="animate-spin" size={18} /> Entrando...</> : <>Entrar <ArrowRight size={18} /></>}
          </button>
          <p className="mt-4 text-center text-sm text-[#866e60]">
            Não tem conta? <Link className="font-bold text-[#d25730] hover:underline" to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
        <section className="mt-6 rounded-2xl border border-dashed border-[#e8cdbb] p-4 text-sm text-[#806a5d]">
          <p className="font-bold text-[#574238]">Contas de demonstração</p>
          <p className="mt-1 text-xs">Criadas por <code>npm run seed</code>. Toque para preencher.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {demoAccounts.map((account) => (
              <button key={account.email} className="chip" type="button" onClick={() => fillDemoAccount(account.email)}>
                {account.label}
              </button>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  )
}
