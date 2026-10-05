import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'

export default function HomePage() {
  return (
    <PageShell backTo={null}>
      <main className="mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl items-center gap-12 px-5 pb-12 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pb-20 lg:pt-12">
        <section className="animate-rise">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f5cbb9] bg-[#fff2ea] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#c9532b]">
            <span className="size-2 rounded-full bg-[#f26a3d]" />
            Entrega todo dia
          </div>
          <h1 className="font-display max-w-xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-[#30231d] sm:text-7xl">
            O seu dia começa com pão <span className="text-[#e35b32]">quente.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#806a5d] sm:text-xl">
            Receba o Kit Pão Quente na porta de casa. Simples, fresco e feito para a sua rotina.
          </p>
          <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
            <Link className="button-primary justify-between sm:min-w-52" to="/cliente">
              Sou Cliente <ArrowRight size={18} />
            </Link>
            <Link className="button-secondary justify-between sm:min-w-64" to="/padaria">
              Acessar Painel da Padaria <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:flex sm:flex-wrap">
            <Link className="button-secondary justify-between sm:min-w-52" to="/mapa">
              <span className="inline-flex items-center gap-2"><MapPin size={18} /> Pão quente no mapa</span> <ArrowRight size={18} />
            </Link>
            <Link className="button-secondary justify-between sm:min-w-64" to="/login">
              Entrar ou criar conta <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm font-semibold text-[#9a8274]">
            <span className="flex -space-x-2">
              <span className="grid size-8 place-items-center rounded-full border-2 border-[#fffaf2] bg-[#f4c095] text-xs">M</span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-[#fffaf2] bg-[#c9d7b7] text-xs">J</span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-[#fffaf2] bg-[#e9b0a0] text-xs">A</span>
            </span>
            Feito para o seu bairro
          </div>
        </section>
        <section className="relative hidden min-h-[440px] lg:block" aria-label="Ilustração de pão quente">
          <div className="absolute inset-8 rotate-3 rounded-[3rem] bg-[#f6d8bd]" />
          <div className="absolute inset-0 grid place-items-center rounded-[3rem] bg-[#f3b276] shadow-[0_30px_80px_-35px_#b65f36]">
            <div className="relative h-60 w-72 -rotate-6 rounded-[48%_52%_45%_55%] bg-[#b96232] shadow-[inset_0_-16px_0_#994722,0_26px_28px_-15px_#93451f]">
              <span className="absolute left-20 top-16 h-3 w-28 rotate-12 rounded-full bg-[#e9a466]" />
              <span className="absolute left-16 top-28 h-3 w-32 -rotate-6 rounded-full bg-[#e9a466]" />
              <span className="absolute left-24 top-40 h-3 w-24 rotate-6 rounded-full bg-[#e9a466]" />
            </div>
            <span className="absolute bottom-12 right-14 rounded-full bg-[#fff5e5] px-4 py-2 text-sm font-bold text-[#a94c28] shadow-sm">Saiu quentinho!</span>
          </div>
        </section>
      </main>
    </PageShell>
  )
}
