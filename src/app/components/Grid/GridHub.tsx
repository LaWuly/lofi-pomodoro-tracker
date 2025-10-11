import { Link } from 'react-router-dom'
import './grid.css'

const cards = [
  { to: '/apps/clock', label: 'Apri 25+5 Clock', emoji: '⏱', title: 'Timer' },
  {
    to: '/apps/calculator',
    label: 'Apri Calculator (FCC)',
    emoji: '🧮',
    title: 'Calculator',
  },
  {
    to: '/apps/markdown',
    label: 'Apri Markdown Previewer',
    emoji: '📓',
    title: 'Markdown',
  },
  { to: '/apps/journal', label: 'Apri Journal', emoji: '📔', title: 'Journal' },
  { to: '/apps/drum', label: 'Apri Drum Machine', emoji: '🥁', title: 'Drum' },
]

export function GridHub() {
  return (
    <main className="hub" aria-label="Hub applicazioni">
      <h1 className="hub__title">Life Tracker — Hub</h1>
      <nav className="grid" aria-label="App disponibili">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card" aria-label={c.label}>
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
