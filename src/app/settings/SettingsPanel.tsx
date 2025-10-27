// src/app/settings/SettingsPanel.tsx
import { useMemo } from 'react'
import { useAppSettings, type SettingsSection } from './AppSettingsContext'
import styles from './SettingsPanel.module.css'

import { MusicSettingsPanel } from '@app/settings/sections/MusicSettings'
import { Settings as TimerSettings } from '@app/settings/sections/TimerSettings'

export function SettingsPanel() {
  const { isSettingsOpen, closeSettings, initialSection } = useAppSettings()
  if (!isSettingsOpen) return null

  const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) closeSettings()
  }

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Impostazioni"
      onMouseDown={onBackdropClick}
    >
      <div className={styles.panel}>
        <Sidebar />
        <Content initial={initialSection} />
        <button
          className={styles.close}
          onClick={closeSettings}
          aria-label="Chiudi impostazioni"
          type="button"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

function Sidebar() {
  const { openSettings, initialSection } = useAppSettings()
  const items: { id: SettingsSection; label: string }[] = [
    { id: 'general', label: 'Generali' },
    { id: 'music', label: 'Musica' },
    { id: 'timer', label: 'Timer' },
    { id: 'workout', label: 'Workout' },
  ]

  return (
    <nav className={styles.side} aria-label="Sezioni impostazioni">
      <ul className={styles.list}>
        {items.map((it) => (
          <li key={it.id}>
            <button
              className={`${styles.sideLink} ${initialSection === it.id ? styles.active : ''}`}
              onClick={() => openSettings(it.id)}
              type="button"
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Content({ initial }: { initial: SettingsSection }) {
  const {
    state: { settings },
    setSettings,
  } = useAppSettings()

  const view = useMemo(() => initial, [initial])

  if (view === 'music') {
    return (
      <div className={styles.content}>
        <MusicSettingsPanel />
      </div>
    )
  }

  if (view === 'timer') {
    return (
      <div className={styles.content}>
        <TimerSettings settings={settings} onUpdateSettings={setSettings} />
      </div>
    )
  }

  if (view === 'workout') {
    return (
      <div className={styles.content}>
        <h3>Workout</h3>
        <p>Impostazioni Workout.</p>
      </div>
    )
  }

  return (
    <div className={styles.content}>
      <h3>Impostazioni generali</h3>
      <p>Placeholder. Usa la lista a sinistra per navigare.</p>
    </div>
  )
}
