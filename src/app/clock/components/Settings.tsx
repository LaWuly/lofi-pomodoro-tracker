// src/app/clock/components/Settings.tsx
import styles from '../Clock.module.css'
import type { AppSettings } from '../types'
import { defaultSettings } from '../types'

// helper: parse + clamp numeri da input
function num(v: string, fallback: number, min: number, max: number) {
  const n = Number.isFinite(Number(v)) ? Math.floor(Number(v)) : fallback
  return Math.max(min, Math.min(max, n))
}

export function Settings({
  settings,
  onUpdateSettings,
}: {
  settings: AppSettings
  onUpdateSettings: (s: AppSettings) => void
}) {
  const upd = <K extends keyof AppSettings>(k: K, v: AppSettings[K]) =>
    onUpdateSettings({ ...settings, [k]: v })

  const reset = () =>
    onUpdateSettings({
      ...defaultSettings,
      spotifyUrl: '',
      spotifyEnabled: false,
    })

  return (
    <div className={styles.panel}>
      {/* Durate */}
      <div className={styles.card}>
        <b>Durate</b>
        <div className={styles.row} style={{ marginTop: 8 }}>
          <label htmlFor="focusMin">
            Focus (min)
            <input
              id="focusMin"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={180}
              value={settings.workDuration}
              onChange={(e) =>
                upd(
                  'workDuration',
                  num(e.target.value, settings.workDuration, 1, 180),
                )
              }
            />
          </label>

          <label htmlFor="shortBreakMin">
            Pausa breve
            <input
              id="shortBreakMin"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={60}
              value={settings.shortBreakDuration}
              onChange={(e) =>
                upd(
                  'shortBreakDuration',
                  num(e.target.value, settings.shortBreakDuration, 1, 60),
                )
              }
            />
          </label>

          <label htmlFor="longBreakMin">
            Pausa lunga
            <input
              id="longBreakMin"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={90}
              value={settings.longBreakDuration}
              onChange={(e) =>
                upd(
                  'longBreakDuration',
                  num(e.target.value, settings.longBreakDuration, 1, 90),
                )
              }
            />
          </label>

          <label htmlFor="longBreakInterval">
            Intervallo pausa lunga
            <input
              id="longBreakInterval"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={1}
              max={10}
              value={settings.longBreakInterval}
              onChange={(e) =>
                upd(
                  'longBreakInterval',
                  num(e.target.value, settings.longBreakInterval, 1, 10),
                )
              }
            />
          </label>
        </div>
      </div>

      {/* Automazioni */}
      <div className={styles.card}>
        <b>Automazioni</b>
        <div className={styles.row} style={{ marginTop: 8 }}>
          <label htmlFor="autoBreaks">
            <input
              id="autoBreaks"
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(e) => upd('autoStartBreaks', e.target.checked)}
            />{' '}
            Avvia pause automaticamente
          </label>

          <label htmlFor="autoPomos">
            <input
              id="autoPomos"
              type="checkbox"
              checked={settings.autoStartPomodoros}
              onChange={(e) => upd('autoStartPomodoros', e.target.checked)}
            />{' '}
            Avvia pomodori automaticamente
          </label>
        </div>
      </div>

      {/* Notifiche & Audio */}
      <div className={styles.card}>
        <b>Notifiche &amp; Audio</b>
        <div className={styles.row} style={{ marginTop: 8 }}>
          <label htmlFor="deskNotif">
            <input
              id="deskNotif"
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => upd('notificationsEnabled', e.target.checked)}
            />{' '}
            Notifiche desktop
          </label>

          <label htmlFor="tickSound">
            <input
              id="tickSound"
              type="checkbox"
              checked={settings.tickingSoundEnabled}
              onChange={(e) => upd('tickingSoundEnabled', e.target.checked)}
            />{' '}
            Suono ticchettio (placeholder)
          </label>

          <label htmlFor="volume">
            Volume
            <input
              id="volume"
              type="range"
              min={0}
              max={100}
              value={settings.soundVolume}
              onChange={(e) =>
                upd(
                  'soundVolume',
                  num(e.target.value, settings.soundVolume, 0, 100),
                )
              }
              aria-label="Volume suoni timer"
            />
          </label>
        </div>

        <div
          className={styles.row}
          style={{ justifyContent: 'flex-end', marginTop: 8 }}
        >
          <button type="button" className={styles.btn} onClick={reset}>
            Ripristina
          </button>
        </div>
      </div>

      {/* Spotify */}
      <div className={styles.card}>
        <b>🎵 Spotify</b>
        <div className={styles.row} style={{ marginTop: 8 }}>
          <label htmlFor="spotifyUrl" style={{ flex: 1 }}>
            URL playlist / album / brano
            <input
              id="spotifyUrl"
              type="text"
              placeholder="https://open.spotify.com/..."
              value={settings.spotifyUrl ?? ''}
              onChange={(e) => upd('spotifyUrl', e.target.value)}
              aria-label="URL embed Spotify"
            />
          </label>

          <label
            htmlFor="spotifyEnabled"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <input
              id="spotifyEnabled"
              type="checkbox"
              checked={settings.spotifyEnabled ?? false}
              onChange={(e) => upd('spotifyEnabled', e.target.checked)}
            />
            Mostra player
          </label>
        </div>
      </div>

      {/* Formato timer */}
      <div className={styles.card}>
        <b>⏱ Formato timer</b>
        <div className={styles.row} style={{ marginTop: 8 }}>
          <label htmlFor="showHours">
            <input
              id="showHours"
              type="checkbox"
              checked={settings.showHours ?? false}
              onChange={(e) => upd('showHours', e.target.checked)}
            />{' '}
            Mostra ore (hh:mm:ss)
          </label>
        </div>
      </div>
    </div>
  )
}
