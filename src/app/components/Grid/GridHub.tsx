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
    emoji: '⏱',
    title: 'Timer',
    label: 'Apri Timer 25+5',
  },
  {
    slug: 'journal',
    to: '/apps/journal',
    emoji: '📔',
    title: 'Journal',
    label: 'Apri Journal',
  },
  {
    slug: 'workout',
    to: '/apps/workout',
    emoji: '🏋️',
    title: 'Workout',
    label: 'Apri Workout',
  },
  {
    slug: 'cycle',
    to: '/apps/cycle',
    emoji: '🌙',
    title: 'Cycle Tracker',
    label: 'Apri Cycle Tracker',
  },
  {
    slug: 'recipes',
    to: '/apps/recipes',
    emoji: '🥗',
    title: 'Ricettario',
    label: 'Apri Ricettario',
  },
  {
    slug: 'meditation',
    to: '/apps/meditation',
    emoji: '🧘',
    title: 'Meditazione',
    label: 'Apri Meditazione',
  },
  {
    slug: 'archive',
    to: '/apps/archive',
    emoji: '🎮',
    title: 'Archivio',
    label: 'Apri Archivio FCC',
  },
]

export function GridHub() {
  return (
    <main className="hub" aria-label="Hub applicazioni">
      <h1 className="hub__title">Life Tracker — Hub</h1>
      <nav className="grid" aria-label="App disponibili">
        {cards.map((c) => (
          <Link
            key={c.slug}
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
