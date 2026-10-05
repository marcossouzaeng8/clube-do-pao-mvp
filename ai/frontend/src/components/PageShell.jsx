import { ArrowRight, ChevronLeft, Flame, LogOut } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { clearSession, isStaff, readSession } from '../lib/session'

export function BrandMark() {
  return (
    <Link className="flex items-center gap-3" to="/" aria-label="Clube do Pao - inicio">
      <span className="grid size-10 place-items-center rounded-2xl bg-[#f26a3d] text-white shadow-[0_8px_20px_-10px_#b53e1b]">
        <Flame size={21} strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-[#30231d]">Clube do Pao</span>
    </Link>
  )
}

function MainNav() {
  const navigate = useNavigate()
  const user = readSession()?.usuario
  const links = [
    { to: '/mapa', label: 'Mapa' },
    { to: '/fornadas', label: 'Fornadas' },
    ...(user?.papel === 'CONSUMER' ? [{ to: '/reservas', label: 'Reservas' }, { to: '/assinaturas', label: 'Assinaturas' }] : []),
    ...(isStaff(user) ? [{ to: '/operacao', label: 'Operação' }] : []),
  ]

  function logout() {
    clearSession()
    navigate('/')
  }

  return (
    <nav aria-label="Navegação principal" className="-mx-1 flex w-full items-center gap-1 overflow-x-auto px-1 sm:w-auto">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
          {link.label}
        </NavLink>
      ))}
      {user ? (
        <button className="nav-link ml-auto shrink-0 sm:ml-2" onClick={logout} type="button" title={`Sair da conta de ${user.nome}`}>
          <LogOut size={15} /> Sair
        </button>
      ) : (
        <Link className="nav-link nav-link-active ml-auto shrink-0 sm:ml-2" to="/login">Entrar</Link>
      )}
    </nav>
  )
}

export function PageShell({ children, backTo = '/', backLabel = 'Inicio', showNav = false }) {
  return (
    <div className="min-h-screen bg-[#fffaf2] text-[#30231d]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-5 sm:px-8">
        <BrandMark />
        {showNav ? <MainNav /> : backTo === null ? (
          <nav aria-label="Navegação principal">
            <Link className="button-secondary !rounded-xl !px-4 !py-2 text-sm" to="/sobre">
              Sobre o projeto <ArrowRight size={16} />
            </Link>
          </nav>
        ) : (
          <Link className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#866e60] transition hover:text-[#d45128]" to={backTo}>
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            {backLabel}
          </Link>
        )}
      </header>
      {children}
    </div>
  )
}
