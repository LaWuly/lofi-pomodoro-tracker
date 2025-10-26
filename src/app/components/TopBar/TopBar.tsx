import styles from './TopBar.module.css'
import { ThemeToggle } from '@app/components/ThemeToggle/ThemeToggle'
import { useAppSettings } from '@app/settings/AppSettingsContext'
import { SpotifyPlayer } from '@app/components/Audio/SpotifyPlayer'
import { AmbiencePlayer } from '@app/components/Audio/AmbiencePlayer'
import { useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import MusicQuickMenu from './MusicQuickMenu'

function useAppTitle(): string {
  const { pathname } = useLocation()
  if (pathname.startsWith('/apps/clock')) return '25+5 Clock (Pro)'
  if (pathname.startsWith('/apps/journal')) return 'Journal'
  if (pathname.startsWith('/apps/workout')) return 'Workout'
  if (pathname.startsWith('/apps/cycle')) return 'Cycle'
  if (pathname.startsWith('/apps/recipes')) return 'Recipes'
  if (pathname.startsWith('/apps/meditation')) return 'Meditation'
  if (pathname.startsWith('/apps/archive')) return 'Archive'
  return ''
}

type ClockTab = 'timer' | 'tasks' | 'stats'
const K_ACTIVE_TAB = 'pomodoro-active-tab'

function ClockTopNav() {
  const [active, setActive] = useState<ClockTab>(() => {
    try {
      const raw = localStorage.getItem(K_ACTIVE_TAB)
      const val = raw ? (JSON.parse(raw) as ClockTab | 'settings') : 'timer'
      return (val === 'settings' ? 'timer' : val) as ClockTab
    } catch {
      return 'timer'
    }
  })

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent
      const val = ce.detail as ClockTab
      if (val === active) return
      setActive(val)
    }
    window.addEventListener('clock:tabChanged', handler as EventListener)
    return () =>
      window.removeEventListener('clock:tabChanged', handler as EventListener)
  }, [active])

  const clickTab = (tab: ClockTab) => {
    setActive(tab)
    try {
      localStorage.setItem(K_ACTIVE_TAB, JSON.stringify(tab))
    } catch {
      //
    }
    window.dispatchEvent(new CustomEvent('clock:setTab', { detail: tab }))
  }

  return (
    <nav
      className={styles.segmentedWrap}
      role="tablist"
      aria-label="Sezioni Pomodoro"
    >
      <div className={styles.segmented}>
        {(['timer', 'tasks', 'stats'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            className={`${styles.segItem} ${active === tab ? styles.segActive : ''}`}
            onClick={() => clickTab(tab)}
            type="button"
          >
            {tab === 'timer' && '⏱  Timer'}
            {tab === 'tasks' && '📝  Task & Progetti'}
            {tab === 'stats' && '📊  Statistiche'}
          </button>
        ))}
      </div>
    </nav>
  )
}

export function TopBar() {
  const { pathname } = useLocation()
  const {
    state: { music },
    openSettings,
  } = useAppSettings()
  const [musicMenuOpen, setMusicMenuOpen] = useState(false)

  const isSpotify = music.player === 'spotify'
  const activePl =
    music.playlists.find((p) => p.id === music.activeSpotifyId) ?? null
  const activeAmb =
    music.ambiencePresets.find((a) => a.id === music.activeAmbienceId) ?? null
  const appTitle = useAppTitle()
  const showClockNav = useMemo(
    () => pathname.startsWith('/apps/clock'),
    [pathname],
  )

  return (
    <header className={styles.topbar}>
      {/* Sinistra: [Impostazioni] + Titolo app */}
      <div className={styles.left}>
        <button
          className={styles.btn}
          onClick={() => openSettings()}
          aria-label="Impostazioni generali"
          title="Impostazioni"
          type="button"
        >
          ⚙️
        </button>
        {appTitle && <div className={styles.appTitle}>{appTitle}</div>}
      </div>

      {/* Centro: nav specifica */}
      <div className={styles.center}>{showClockNav && <ClockTopNav />}</div>

      {/* Destra: Player + Musica + Tema */}
      <div className={styles.right} style={{ position: 'relative' }}>
        {music.showMiniPlayer && (
          <div className={styles.inlinePlayer}>
            {isSpotify ? (
              <SpotifyPlayer url={activePl?.url ?? null} size="compact" />
            ) : (
              <AmbiencePlayer src={activeAmb?.src ?? ''} compact />
            )}
          </div>
        )}

        <button
          className={styles.btn}
          onClick={() => setMusicMenuOpen((v) => !v)}
          aria-label="Menù rapido Musica"
          title="Musica"
          type="button"
        >
          🎵
        </button>
        {musicMenuOpen && (
          <MusicQuickMenu
            onClose={() => {
              setMusicMenuOpen(false)
              const t = document.activeElement as HTMLElement | null
              if (t?.dataset?.openSettings === 'music') openSettings('music')
            }}
          />
        )}

        <ThemeToggle className={styles.btn} />
      </div>
    </header>
  )
}
