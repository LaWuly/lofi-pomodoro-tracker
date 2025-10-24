import { useMemo, useState } from 'react'
import MoodSelector from './MoodSelector'
import { useJournal } from '@app/hooks/useJournal'
import { sanitize } from '@domain/markdown/sanitizeHtml'
import { markdownToHtml } from '@domain/markdown/parser'
import styles from './Journal.module.css'

// --- STUB COMPONENTS ---
function PomodoroLogStub() {
  return (
    <section aria-labelledby="pomodoro-log-title" data-section="pomodoro-log">
      <h3 id="pomodoro-log-title">
        📋 Log attività Pomodoro <small>(coming soon)</small>
      </h3>
      <p>
        Qui vedrai un riepilogo delle attività concluse con il 25+5 (es. “3
        sessioni focus su Journal UI”). Si popolerà quando il Pomodoro sarà
        definitivo.
      </p>
    </section>
  )
}

function WorkoutTrackerStub() {
  return (
    <section aria-labelledby="workout-title" data-section="workout">
      <h3 id="workout-title">
        🏋️ Workout <small>(coming soon)</small>
      </h3>
      <p>
        Registrerai tipo di allenamento, durata e intensità percepita. Questa
        sezione sarà collegata al tuo modulo workout.
      </p>
    </section>
  )
}

function CycleTrackerStub() {
  return (
    <section aria-labelledby="cycle-title" data-section="cycle">
      <h3 id="cycle-title">
        🌙 Ciclo <small>(coming soon)</small>
      </h3>
      <p>
        Traccia il ciclo mestruale e l’umore associato ai giorni del periodo. Lo
        collegheremo al tracker dedicato non appena pronto.
      </p>
    </section>
  )
}
// -------------------------------------------------------------------------------

export default function Journal() {
  const {
    entries,
    current,
    currentId,
    setCurrentId,
    addEntry,
    updateEntry,
    removeEntry,
    todayISO,
  } = useJournal()

  const todayEntryId = useMemo(() => {
    const already = entries.find((e) => e.date === todayISO)
    return already?.id ?? addEntry({ date: todayISO })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayISO])

  const activeId = currentId ?? todayEntryId
  const active = current ?? entries.find((e) => e.id === activeId) ?? null
  const [showPreview, setShowPreview] = useState<boolean>(
    active?.format === 'md',
  )

  if (!active) return null

  const mdHtml =
    active.format === 'md' ? sanitize(markdownToHtml(active.text)) : ''

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* Header */}
        <header className={styles.header}>
          <h1>Journal</h1>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setCurrentId(todayEntryId)}>
              Vai a oggi ({todayISO})
            </button>
            <button onClick={() => setCurrentId(addEntry())}>Nuova nota</button>
            <button
              onClick={() => removeEntry(active.id)}
              style={{ color: '#c33', borderColor: '#c33' }}
            >
              Elimina
            </button>
          </div>
        </header>

        {/* Nav note recenti */}
        <nav className={styles.nav} aria-label="Note recenti">
          {entries.slice(0, 10).map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setCurrentId(e.id)}
              aria-current={e.id === activeId ? 'page' : undefined}
              title={`Umore ${e.mood}/5`}
            >
              {e.date}
            </button>
          ))}
        </nav>

        {/* Editor */}
        <section className={styles.editor} aria-labelledby="entry-title">
          <div className={styles.controls}>
            <h2 id="entry-title">
              Nota di <strong>{active.date}</strong>
            </h2>

            <label>
              Formato:
              <select
                value={active.format}
                onChange={(e) => {
                  const format = e.target.value === 'md' ? 'md' : 'plain'
                  updateEntry(active.id, { format })
                  setShowPreview(format === 'md')
                }}
              >
                <option value="plain">Plain</option>
                <option value="md">Markdown</option>
              </select>
            </label>

            <label>
              Preview MD
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                disabled={active.format !== 'md'}
              />
            </label>
          </div>

          {/* --- STUBS BLOCCO VISUALE --- */}
          <div
            style={{
              display: 'grid',
              gap: '0.75rem',
              background: 'rgba(0,0,0,0.03)',
              padding: '1rem',
              borderRadius: 12,
              fontSize: '0.9rem',
            }}
          >
            <PomodoroLogStub />
            <WorkoutTrackerStub />
            <CycleTrackerStub />
          </div>
          {/* --- FINE STUBS --- */}

          <div className={showPreview ? styles.split : undefined}>
            <div>
              <label htmlFor="mood">Umore</label>
              <MoodSelector
                id="mood"
                value={active.mood}
                onChange={(m) => updateEntry(active.id, { mood: m })}
              />

              <label htmlFor="text">Testo</label>
              <textarea
                id="text"
                className={styles.textarea}
                value={active.text}
                onChange={(e) =>
                  updateEntry(active.id, { text: e.target.value })
                }
                rows={showPreview ? 14 : 18}
                placeholder={
                  active.format === 'md' ? 'Scrivi in Markdown...' : 'Scrivi...'
                }
              />
            </div>

            {showPreview && active.format === 'md' && (
              <div
                className={styles.preview}
                aria-label="Anteprima Markdown"
                dangerouslySetInnerHTML={{ __html: mdHtml }}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
