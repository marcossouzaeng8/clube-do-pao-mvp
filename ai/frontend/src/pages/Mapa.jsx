import { LoaderCircle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback'
import MapView from '../components/MapView'
import { PageShell } from '../components/PageShell'
import StatusBadge from '../components/StatusBadge'
import { formatTime, scheduleStatusLabels } from '../lib/format'
import { useNearbyBakeries } from '../hooks/useNearbyBakeries'

export default function Mapa() {
  const { origin, establishments, isLoading, isMatching, match, feedback, isLoggedIn, isDemoRegion, radiusKm, findHotBread } = useNearbyBakeries()

  return (
    <PageShell showNav>
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-4 sm:px-8 sm:pt-8">
        <div className="animate-rise flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Pão quente perto de você</p>
            <h1 className="page-title">Mapa de padarias</h1>
            <p className="page-lead">{isDemoRegion ? 'Mostrando a região de demonstração, em São Paulo.' : `Padarias em até ${radiusKm} km de você.`}</p>
          </div>
          {isLoggedIn ? (
            <button className="button-primary self-start sm:self-auto" type="button" onClick={findHotBread} disabled={isMatching || isLoading}>
              {isMatching ? <LoaderCircle className="animate-spin" size={18} /> : <Sparkles size={18} />} Encontrar pão quente (IA)
            </button>
          ) : (
            <Link className="button-secondary self-start sm:self-auto" to="/login"><Sparkles size={18} /> Entre para usar o matchmaking</Link>
          )}
        </div>

        <Feedback className="mt-6" feedback={feedback} />
        {match && (
          <section className="success-panel animate-rise mt-6 !min-h-0 !items-start !p-5 !text-left" role="status">
            <p className="eyebrow text-[#317c42]">Melhor match · score {match.score}</p>
            <h2 className="font-display mt-1 text-2xl font-bold text-[#285e35]">{match.produto_nome} na {match.estabelecimento_nome}</h2>
            <p className="mt-1 text-sm text-[#4d7656]">
              A {match.distancia_km} km · {match.espera_minutos > 0 ? `pronto em ~${match.espera_minutos} min` : 'saindo do forno agora'}
            </p>
            <Link className="button-primary mt-4 !py-2.5" to="/fornadas">Reservar na fornada</Link>
          </section>
        )}
        {match === null && <Feedback className="mt-6" feedback={{ type: 'error', text: `Nenhuma fornada disponível em ${radiusKm} km agora. Tente de novo em instantes.` }} />}

        <div className="mt-8">
          {isLoading
            ? <div className="map-frame animate-pulse bg-[#f6e6d8]" />
            : <MapView establishments={establishments} center={[origin.lat, origin.lng]} />}
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {establishments.map((establishment) => (
            <article className="card" key={establishment.id}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-bold">{establishment.nome}</h2>
                {establishment.distancia_km !== null && <span className="shrink-0 text-sm font-extrabold text-[#d25730]">{establishment.distancia_km} km</span>}
              </div>
              <p className="mt-1 text-sm text-[#866e60]">{establishment.endereco}</p>
              <ul className="mt-4 space-y-2">
                {establishment.fornadas.length === 0 && <li className="text-sm text-[#91796a]">Sem fornadas previstas.</li>}
                {establishment.fornadas.slice(0, 3).map((schedule) => (
                  <li className="flex items-center justify-between gap-3 text-sm" key={schedule.id}>
                    <span className="font-bold text-[#574238]">{schedule.produto.nome} <span className="font-normal text-[#91796a]">· {formatTime(schedule.horario_previsto)}</span></span>
                    <StatusBadge status={schedule.status} labels={scheduleStatusLabels} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
    </PageShell>
  )
}
