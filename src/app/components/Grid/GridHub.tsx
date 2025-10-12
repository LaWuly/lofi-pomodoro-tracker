import { Link } from 'react-router-dom'
import './grid.css'
import { prefetchChunk } from '@routes/prefetch'
import type { Slug } from '@routes/prefetch'

type Card = {
  slug: Slug
  to: string
  label: string
  emoji: string
  title: string
}

const cards: Card[] = [
  {
    slug: 'clock',
    to: '/apps/clock',
    label: 'Apri 25+5 Clock',
    emoji: '⏱',
    title: 'Timer',
  },
  {
    slug: 'calculator',
    to: '/apps/calculator',
    label: 'Apri Calculator (FCC)',
    emoji: '🧮',
    title: 'Calculator',
  },
  {
    slug: 'markdown',
    to: '/apps/markdown',
    label: 'Apri Markdown Previewer',
    emoji: '📓',
    title: 'Markdown',
  },
  {
    slug: 'journal',
    to: '/apps/journal',
    label: 'Apri Journal',
    emoji: '📔',
    title: 'Journal',
  },
  {
    slug: 'drum',
    to: '/apps/drum',
    label: 'Apri Drum Machine',
    emoji: '🥁',
    title: 'Drum',
  },
]

export function GridHub() {
  return (
    <main className="hub" aria-label="Hub applicazioni">
      <h1 className="hub__title">Life Tracker — Hub</h1>
      <nav className="grid" aria-label="App disponibili">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="card"
            aria-label={c.label}
            onMouseEnter={() => prefetchChunk(c.slug)}
            onFocus={() => prefetchChunk(c.slug)}
          >
            <span className="card__emoji" aria-hidden="true">
              {c.emoji}
            </span>
            <span className="card__title">{c.title}</span>
          </Link>
        ))}
      </nav>
    </main>
  )
}
