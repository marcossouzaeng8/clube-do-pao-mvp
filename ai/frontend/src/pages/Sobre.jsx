import { BookOpen, Code2, Database, Network, Server, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import prdMarkdown from '../../../docs/prd.md?raw'

const students = [
  'Danilo Sebastiany França',
  'Marcos Vinicius Souza Lima',
  'Kevin Peterson Coelho',
  'Victor Bastos dos Santos',
]

const technicalSpecs = [
  {
    icon: Network,
    title: 'Arquitetura',
    details: ['Frontend React desacoplado da API Node.js', 'Execução local: Vite 5173 e API 3000', 'Notificações de despacho simuladas'],
  },
  {
    icon: Server,
    title: 'Stack permitida',
    details: ['React 18, Vite, Tailwind CSS e Lucide', 'Node.js 20, Express e API REST', 'SQLite para persistência local'],
  },
  {
    icon: Code2,
    title: 'Convenções',
    details: ['Componentes funcionais e React Hooks', 'async/await no backend', 'camelCase, PascalCase e kebab-case'],
  },
]

function renderInline(text) {
  return text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-[#44332a]">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="rounded bg-[#f7eee5] px-1.5 py-0.5 font-mono text-[0.9em] text-[#a94c28]">{part.slice(1, -1)}</code>
    }
    return part
  })
}

function MarkdownContent({ markdown }) {
  const lines = markdown.trim().split(/\r?\n/)
  const blocks = []
  let lineIndex = 0

  while (lineIndex < lines.length) {
    const line = lines[lineIndex].trim()

    if (!line) {
      lineIndex += 1
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      const Heading = level <= 2 ? 'h2' : 'h3'
      blocks.push(
        <Heading key={`heading-${lineIndex}`} className={`${level <= 2 ? 'font-display mt-10 border-b border-[#ead9ce] pb-3 text-2xl font-bold text-[#30231d] sm:text-3xl' : 'mt-7 font-display text-xl font-bold text-[#574238]'}`}>
          {renderInline(heading[2])}
        </Heading>,
      )
      lineIndex += 1
      continue
    }

    if (line.startsWith('|')) {
      const rows = []
      while (lineIndex < lines.length && lines[lineIndex].trim().startsWith('|')) {
        const cells = lines[lineIndex].trim().slice(1, -1).split('|').map((cell) => cell.trim())
        if (!cells.every((cell) => /^:?-{3,}:?$/.test(cell))) rows.push(cells)
        lineIndex += 1
      }
      const [headers, ...bodyRows] = rows
      blocks.push(
        <div key={`table-${lineIndex}`} className="my-6 overflow-x-auto rounded-xl border border-[#ead9ce]">
          <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
            <thead className="bg-[#fff0e6] text-xs font-extrabold uppercase text-[#9b5739]">
              <tr>{headers?.map((cell, index) => <th className="px-4 py-3" key={index}>{renderInline(cell)}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[#f0e1d5] bg-white/70">
              {bodyRows.map((row, rowIndex) => (
                <tr className="align-top" key={rowIndex}>
                  {row.map((cell, cellIndex) => <td className="px-4 py-3 leading-6 text-[#725d50]" key={cellIndex}>{renderInline(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    const listMatch = line.match(/^([-*])\s+(.+)|^(\d+)\.\s+(.+)$/)
    if (listMatch) {
      const isOrdered = Boolean(listMatch[3])
      const List = isOrdered ? 'ol' : 'ul'
      const items = []
      while (lineIndex < lines.length) {
        const item = lines[lineIndex].trim().match(/^([-*])\s+(.+)|^(\d+)\.\s+(.+)$/)
        if (!item || Boolean(item[3]) !== isOrdered) break
        items.push(item[2] ?? item[4])
        lineIndex += 1
      }
      blocks.push(
        <List key={`list-${lineIndex}`} className={`${isOrdered ? 'list-decimal' : 'list-disc'} my-4 space-y-2 pl-6 text-[0.9375rem] leading-7 text-[#725d50] marker:text-[#d25730]`}>
          {items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
        </List>,
      )
      continue
    }

    const paragraph = [line]
    lineIndex += 1
    while (lineIndex < lines.length && lines[lineIndex].trim() && !/^(#{1,6})\s|^\||^([-*])\s|^(\d+)\.\s/.test(lines[lineIndex].trim())) {
      paragraph.push(lines[lineIndex].trim())
      lineIndex += 1
    }
    blocks.push(<p key={`paragraph-${lineIndex}`} className="my-4 text-[0.9375rem] leading-7 text-[#725d50]">{renderInline(paragraph.join(' '))}</p>)
  }

  return <div>{blocks}</div>
}

export default function Sobre() {
  return (
    <div className="min-h-screen bg-[#fffaf2] text-[#30231d]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link className="inline-flex items-center gap-2 font-bold text-[#745443] transition hover:text-[#d45128]" to="/">
          <BookOpen size={18} />
          Voltar ao início
        </Link>
        <span className="text-sm font-semibold text-[#9a8274]">Clube do Pão</span>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <section className="animate-rise border-b border-[#ead9ce] pb-10 sm:pb-14">
          <p className="eyebrow">Sobre o projeto</p>
          <h1 className="font-display mt-4 max-w-4xl text-3xl font-bold leading-tight text-[#30231d] sm:text-5xl">
            Projeto da Turma 12AOJR do MBA de Engenharia de Software Moderna - Arquitetura, Plataformas &amp; IA
          </h1>
        </section>

        <section className="border-b border-[#ead9ce] py-8 sm:py-10" aria-labelledby="students-title">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#fff0e6] text-[#d25730]"><Users size={20} /></span>
            <h2 id="students-title" className="font-display text-2xl font-bold text-[#30231d]">Alunos</h2>
          </div>
          <ul className="mt-5 grid gap-x-8 gap-y-3 text-[0.9375rem] font-semibold text-[#725d50] sm:grid-cols-2">
            {students.map((student) => <li className="border-l-2 border-[#e8a17e] py-1 pl-3" key={student}>{student}</li>)}
          </ul>
        </section>

        <section className="py-8 sm:py-10" aria-labelledby="prd-title">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#eaf1e5] text-[#58724d]"><BookOpen size={20} /></span>
            <h2 id="prd-title" className="font-display text-2xl font-bold text-[#30231d]">Requisitos do produto</h2>
          </div>
          <MarkdownContent markdown={prdMarkdown} />
        </section>

        <section className="border-t border-[#ead9ce] pt-9 sm:pt-11" aria-labelledby="technical-title">
          <p className="eyebrow">Em poucas linhas</p>
          <h2 id="technical-title" className="font-display mt-2 text-3xl font-bold text-[#30231d]">Especificações Técnicas</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technicalSpecs.map(({ icon: Icon, title, details }) => (
              <article className="rounded-xl border border-[#ead9ce] bg-white/65 p-5" key={title}>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-[#fff0e6] text-[#d25730]"><Icon size={18} /></span>
                  <h3 className="font-bold text-[#44332a]">{title}</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-[#725d50]">
                  {details.map((detail) => <li className="flex gap-2" key={detail}><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#d25730]" />{detail}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#d9e5d2] bg-[#f3f8ef] p-4 text-sm leading-6 text-[#58724d]">
            <Database className="mt-0.5 shrink-0" size={18} />
            <p>Dados locais em SQLite. Código padronizado com ESLint/Prettier e versionamento Conventional Commits.</p>
          </div>
        </section>
      </main>
    </div>
  )
}