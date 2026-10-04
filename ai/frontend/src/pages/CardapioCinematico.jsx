import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Flame, Pause, Play, Sparkles, Utensils, Wheat } from 'lucide-react'
import { Link } from 'react-router-dom'

const BREADS = [
  {
    id: 'sourdough',
    tag: 'Fermentação Natural',
    title: 'Sourdough Rústico',
    subtitle: 'A paciência do tempo transformada em aroma inconfundível.',
    description:
      'Criado com nosso levain vivo de fermentação lenta por 48 horas. Apresenta uma crosta rústica profundamente caramelizada, alvéolos abertos e uma acidez delicada que harmoniza perfeitamente com manteiga artesanal.',
    specs: {
      fermentacao: '48 horas a frio',
      fornada: '06h00 e 16h30',
      farinha: 'Trigo integral e pura de moinho de pedra',
      harmonizacao: 'Café coado especial e queijos curados',
    },
    metrics: {
      crocancia: 95,
      maciez: 80,
      aroma: 98,
    },
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1600&auto=format&fit=crop',
    accentColor: '#e07a3c',
  },
  {
    id: 'frances',
    tag: 'O Queridinho do Bairro',
    title: 'Pão Francês Crocante',
    subtitle: 'A sinfonia da casca estalando ao sair do forno a lenha.',
    description:
      'Nosso ícone diário. Casca fina, hiper-crocante e dourada no ponto exato, com miolo leve, aerado e macio. É assado em fornalhas a vapor para entregar a experiência definitiva do café da manhã brasileiro.',
    specs: {
      fermentacao: '12 horas controlada',
      fornada: 'De hora em hora (05h30 às 09h00)',
      farinha: 'Farinha tipo 1 enriquecida especial',
      harmonizacao: 'Manteiga derretendo e pingado clássico',
    },
    metrics: {
      crocancia: 98,
      maciez: 88,
      aroma: 92,
    },
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1600&auto=format&fit=crop',
    accentColor: '#f59e0b',
  },
  {
    id: 'brioche',
    tag: 'Receita Francesa Imperial',
    title: 'Brioche Amanteigado',
    subtitle: 'Uma textura que derrete na boca feito nuvem dourada.',
    description:
      'Rico em manteiga de primeira qualidade e ovos frescos da serra. Apresenta uma coloração dourada brilhante, aroma doce e envolvente, e um interior aveludado perfeito para manhãs preguiçosas e ocasiões especiais.',
    specs: {
      fermentacao: '24 horas com descanso refrigerado',
      fornada: '06h30 e 15h00',
      farinha: 'Trigo puro de alta absorção',
      harmonizacao: 'Geleia de frutas vermelhas ou tostado na chapa',
    },
    metrics: {
      crocancia: 45,
      maciez: 100,
      aroma: 95,
    },
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=1600&auto=format&fit=crop',
    accentColor: '#fbbf24',
  },
  {
    id: 'australiano',
    tag: 'Intensidade & Alma',
    title: 'Australiano com Mel e Cacau',
    subtitle: 'Contraste único de notas doces, malte tostado e centeio.',
    description:
      'Um pão escuro de presença marcante, aromatizado com mel silvestre, cacau em pó puro e farinha de centeio integral. Polvilhado delicadamente com fubá mimoso, oferece equilíbrio sem igual entre o doce e o rústico.',
    specs: {
      fermentacao: '18 horas lenta',
      fornada: '07h00 e 17h00',
      farinha: 'Centeio escuro, trigo e cacau puro',
      harmonizacao: 'Manteiga aerada ligeiramente salgada',
    },
    metrics: {
      crocancia: 70,
      maciez: 90,
      aroma: 96,
    },
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1600&auto=format&fit=crop',
    accentColor: '#d97706',
  },
  {
    id: 'focaccia',
    tag: 'Herança Mediterrânea',
    title: 'Focaccia ao Alecrim & Azeite',
    subtitle: 'Gotas de azeite extravirgem, sal marinho e perfume de ervas.',
    description:
      'Massa de altíssima hidratação esticada manualmente com as pontas dos dedos. Banhada generosamente com azeite de oliva extravirgem, ramos de alecrim colhidos na hora e flocos crocantes de flor de sal.',
    specs: {
      fermentacao: '36 horas de hidratação alta',
      fornada: '11h00 e 17h30',
      farinha: 'Blend italiano para foccacia',
      harmonizacao: 'Vinho tinto leve, antepastos e frios',
    },
    metrics: {
      crocancia: 85,
      maciez: 94,
      aroma: 99,
    },
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1600&auto=format&fit=crop',
    accentColor: '#10b981',
  },
]

const SCENE_DURATION_MS = 6000

export default function CardapioCinematico() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  const activeBread = BREADS[currentIndex]

  function nextSlide() {
    setCurrentIndex((prev) => (prev + 1) % BREADS.length)
    setProgress(0)
  }

  function prevSlide() {
    setCurrentIndex((prev) => (prev - 1 + BREADS.length) % BREADS.length)
    setProgress(0)
  }

  function selectSlide(index) {
    setCurrentIndex(index)
    setProgress(0)
  }

  // Timer para o modo trailer cinemático contínuo
  useEffect(() => {
    if (!isPlaying) return

    const interval = 50 // Atualiza a barra de progresso a cada 50ms
    const step = (interval / SCENE_DURATION_MS) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + step
      })
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, currentIndex])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0d0907] font-sans text-[#fdf8f5] select-none">
      {/* Background Cinematográfico com Imagens e Transição */}
      <div className="absolute inset-0 z-0">
        {BREADS.map((bread, index) => {
          const isActive = index === currentIndex
          return (
            <div
              key={bread.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Imagem com Efeito Ken Burns (Zoom e Pan contínuos de câmera de cinema) */}
              <img
                src={bread.image}
                alt={bread.title}
                className={`h-full w-full object-cover object-center filter brightness-[0.45] contrast-[1.12] transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-110 translate-x-2 -translate-y-1' : 'scale-100 translate-x-0 translate-y-0'
                }`}
              />
              {/* Gradients de Iluminação e Atmosfera Quente de Forno */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0907] via-[#0d0907]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0907] via-[#0d0907]/80 to-transparent" />
              <div
                className="absolute inset-0 opacity-25 mix-blend-screen transition-opacity duration-1000"
                style={{
                  background: `radial-gradient(circle at 65% 45%, ${bread.accentColor} 0%, transparent 65%)`,
                }}
              />
            </div>
          )
        })}

        {/* Efeito de Vinheta Cinematográfica (bordas escuras) */}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />

        {/* Partículas de Farinha / Poeira de Ouro flutuando no ar */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-[20%] left-[30%] size-1.5 rounded-full bg-[#fde68a] animate-pulse blur-[0.5px]" />
          <div className="absolute top-[40%] left-[70%] size-2 rounded-full bg-[#fcd34d] animate-ping blur-[1px] duration-[3000ms]" />
          <div className="absolute top-[65%] left-[25%] size-1 rounded-full bg-[#fde68a] animate-bounce duration-[6000ms]" />
          <div className="absolute top-[15%] left-[80%] size-1.5 rounded-full bg-[#f59e0b] animate-pulse duration-[4000ms]" />
          <div className="absolute top-[80%] left-[60%] size-2 rounded-full bg-[#fbbf24] animate-pulse blur-[0.8px]" />
        </div>
      </div>

      {/* Conteúdo Principal (Interface Cinematográfica) */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Cabeçalho Superior */}
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-semibold text-[#f1dec9] backdrop-blur-md transition hover:border-[#f26a3d]/60 hover:bg-black/60"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-[#f26a3d]" />
            <span>Voltar ao Início</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3.5 py-1.5 text-xs font-bold tracking-widest uppercase text-[#f59e0b] sm:inline-flex">
              <Flame size={14} className="animate-pulse" />
              Sessão de Pães Artesanais
            </span>

            {/* Controle Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/10"
              title={isPlaying ? 'Pausar apresentação automática' : 'Continuar apresentação automática'}
            >
              {isPlaying ? <Pause size={14} className="text-[#f59e0b]" /> : <Play size={14} className="text-[#10b981]" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pausar' : 'Play'}</span>
            </button>
          </div>
        </header>

        {/* Barras de Progresso no estilo Stories / Trailer */}
        <div className="my-6 grid grid-cols-5 gap-2 max-w-xl mx-auto w-full">
          {BREADS.map((bread, index) => {
            const isPast = index < currentIndex
            const isCurrent = index === currentIndex
            return (
              <button
                key={bread.id}
                onClick={() => selectSlide(index)}
                className="group relative h-1.5 rounded-full overflow-hidden bg-white/20 transition hover:h-2"
                title={`Ir para ${bread.title}`}
              >
                <div
                  className="h-full rounded-full transition-all duration-75"
                  style={{
                    backgroundColor: bread.accentColor,
                    width: isPast ? '100%' : isCurrent ? `${progress}%` : '0%',
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* Corpo da Cena: Informações do Pão em Exibição */}
        <main className="my-auto mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          {/* Coluna da Esquerda: Storytelling & Ficha */}
          <div className="animate-fadeIn">
            {/* Tag e Número da Cena */}
            <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em]">
              <span
                className="rounded-md px-2.5 py-1 text-black font-black"
                style={{ backgroundColor: activeBread.accentColor }}
              >
                Cena 0{currentIndex + 1}
              </span>
              <span className="text-[#f3c6a5]">{activeBread.tag}</span>
            </div>

            {/* Título Monumental */}
            <h1 className="mt-4 font-serif text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-[#fffaf5] drop-shadow-lg">
              {activeBread.title}
            </h1>

            {/* Subtítulo Poético */}
            <p className="mt-3 text-lg sm:text-xl font-medium italic text-[#f6d2b5]/90 drop-shadow">
              "{activeBread.subtitle}"
            </p>

            {/* Descrição Sensorial */}
            <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-[#d7c4b7]">
              {activeBread.description}
            </p>

            {/* Ficha Técnica Rápida */}
            <div className="mt-7 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 backdrop-blur-md">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#a89080]">
                  <Wheat size={14} className="text-[#f59e0b]" /> Fermentação
                </p>
                <p className="mt-1 text-sm font-semibold text-[#fdeddd]">{activeBread.specs.fermentacao}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#a89080]">
                  <Flame size={14} className="text-[#ea580c]" /> Horário da Fornada
                </p>
                <p className="mt-1 text-sm font-semibold text-[#fdeddd]">{activeBread.specs.fornada}</p>
              </div>
              <div className="col-span-2 border-t border-white/10 pt-3">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#a89080]">
                  <Utensils size={14} className="text-[#10b981]" /> Harmonização Ideal
                </p>
                <p className="mt-1 text-sm font-semibold text-[#fdeddd]">{activeBread.specs.harmonizacao}</p>
              </div>
            </div>

            {/* Botão de Ação / Conversão para o MVP */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/cliente"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-extrabold text-white shadow-xl transition hover:scale-[1.02]"
                style={{
                  backgroundColor: activeBread.accentColor,
                  boxShadow: `0 12px 30px -10px ${activeBread.accentColor}`,
                }}
              >
                <span>Quero no Meu Kit Diário</span>
                <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm font-bold text-[#f7e6d7] backdrop-blur-md transition hover:bg-white/10"
              >
                <Sparkles size={16} className="text-[#f59e0b]" /> Conhecer a Padaria
              </Link>
            </div>
          </div>

          {/* Coluna da Direita: Radar Sensorial & Enquadramento */}
          <div className="hidden lg:flex flex-col justify-center rounded-3xl border border-white/10 bg-black/50 p-8 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#f59e0b]">
              Assinatura Sensorial
            </h3>
            <p className="mt-1 text-xl font-bold text-white">Equilíbrio da Massa</p>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between text-sm font-semibold text-[#ebd5c5]">
                  <span>Crocância da Casca</span>
                  <span>{activeBread.metrics.crocancia}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${activeBread.metrics.crocancia}%`,
                      backgroundColor: activeBread.accentColor,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-[#ebd5c5]">
                  <span>Maciez do Miolo</span>
                  <span>{activeBread.metrics.maciez}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${activeBread.metrics.maciez}%`,
                      backgroundColor: activeBread.accentColor,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-[#ebd5c5]">
                  <span>Intensidade de Aroma</span>
                  <span>{activeBread.metrics.aroma}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${activeBread.metrics.aroma}%`,
                      backgroundColor: activeBread.accentColor,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-[#cbb6a7]">
              🍞 <strong>Nota do Padeiro:</strong> Assado diariamente em fornalha a lenha especial com injeção de vapor d'água mineral para retenção máxima de crosta e umidade interna.
            </div>
          </div>
        </main>

        {/* Rodapé Cinemático: Miniaturas & Controles de Direção */}
        <footer className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-5">
          {/* Navegação de Miniaturas na Base */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {BREADS.map((bread, index) => {
              const isSelected = index === currentIndex
              return (
                <button
                  key={bread.id}
                  onClick={() => selectSlide(index)}
                  className={`group relative flex items-center gap-3 shrink-0 rounded-2xl border p-2 transition-all ${
                    isSelected
                      ? 'border-[#f59e0b] bg-white/15 scale-105 shadow-lg'
                      : 'border-white/10 bg-black/30 hover:border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={bread.image}
                    alt={bread.title}
                    className="size-11 rounded-xl object-cover"
                  />
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold text-white group-hover:text-[#fcd34d] transition-colors">
                      {bread.title}
                    </p>
                    <p className="text-[10px] text-[#bda797]">{bread.specs.fornada.split(' ')[0]}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Botões de Avançar / Voltar Manual */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={prevSlide}
              aria-label="Pão anterior"
              className="grid size-11 place-items-center rounded-2xl border border-white/15 bg-black/40 text-white backdrop-blur-md transition hover:bg-white/15 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Próximo pão"
              className="grid size-11 place-items-center rounded-2xl border border-white/15 bg-black/40 text-white backdrop-blur-md transition hover:bg-white/15 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
