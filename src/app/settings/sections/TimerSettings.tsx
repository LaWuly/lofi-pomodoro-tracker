import s from './TimerSettings.module.css'
import type { AppSettings } from '../../clock/types'
import { defaultSettings } from '../../clock/types'

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
    <div className={s.wrap}>
      <h3 className={s.title}>⚙️ Impostazioni Timer</h3>

      {/* === Durate ======================================================= */}
      <section className={s.section} aria-labelledby="durate">
        <h4 id="durate" className={s.h4}>
          Durate
        </h4>
        <div className={s.row}>
          <label className={s.inline} htmlFor="focusMin">
            <span>Focus (min)</span>
            <input
              className={s.input}
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

          <label className={s.inline} htmlFor="shortBreakMin">
            <span>Pausa breve</span>
            <input
              className={s.input}
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

          <label className={s.inline} htmlFor="longBreakMin">
            <span>Pausa lunga</span>
            <input
              className={s.input}
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

          <label className={s.inline} htmlFor="longBreakInterval">
            <span>Intervallo pausa lunga</span>
            <input
              className={s.input}
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
      </section>

      {/* === Automazioni ================================================== */}
      <section className={s.section} aria-labelledby="auto">
        <h4 id="auto" className={s.h4}>
          Automazioni
        </h4>
        <div className={s.row}>
          <label className={s.inline} htmlFor="autoBreaks">
            <input
              id="autoBreaks"
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(e) => upd('autoStartBreaks', e.target.checked)}
            />
            <span>Avvia pause automaticamente</span>
          </label>

          <label className={s.inline} htmlFor="autoPomos">
            <input
              id="autoPomos"
              type="checkbox"
              checked={settings.autoStartPomodoros}
              onChange={(e) => upd('autoStartPomodoros', e.target.checked)}
            />
            <span>Avvia pomodori automaticamente</span>
          </label>
        </div>
      </section>

      {/* === Notifiche & Audio =========================================== */}
      <section className={s.section} aria-labelledby="notify-audio">
        <h4 id="notify-audio" className={s.h4}>
          Notifiche &amp; Audio
        </h4>
        <div className={s.row}>
          <label className={s.inline} htmlFor="deskNotif">
            <input
              id="deskNotif"
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => upd('notificationsEnabled', e.target.checked)}
            />
            <span>Notifiche desktop</span>
          </label>

          <label className={s.inline} htmlFor="tickSound">
            <input
              id="tickSound"
              type="checkbox"
              checked={settings.tickingSoundEnabled}
              onChange={(e) => upd('tickingSoundEnabled', e.target.checked)}
            />
            <span>Suono ticchettio (placeholder)</span>
          </label>

          <label className={s.inline} htmlFor="volume">
            <span>Volume</span>
            <input
              className={s.range}
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

        <div className={s.row} style={{ justifyContent: 'flex-end' }}>
          <button type="button" className={s.btn} onClick={reset}>
            Ripristina
          </button>
        </div>
      </section>

      {/* === Spotify ====================================================== */}
      <section className={s.section} aria-labelledby="spotify">
        <h4 id="spotify" className={s.h4}>
          🎵 Spotify
        </h4>

        <div className={s.row}>
          <label className={s.inline} htmlFor="spotifyUrl" style={{ flex: 1 }}>
            <span>URL playlist / album / brano</span>
            <input
              className={s.input}
              id="spotifyUrl"
              type="text"
              placeholder="https://open.spotify.com/..."
              value={settings.spotifyUrl ?? ''}
              onChange={(e) => upd('spotifyUrl', e.target.value)}
              aria-label="URL embed Spotify"
            />
          </label>

          <label className={s.inline} htmlFor="spotifyEnabled">
            <input
              id="spotifyEnabled"
              type="checkbox"
              checked={settings.spotifyEnabled ?? false}
              onChange={(e) => upd('spotifyEnabled', e.target.checked)}
            />
            <span>Mostra player</span>
          </label>
        </div>
      </section>

      {/* === Formato timer =============================================== */}
      <section className={s.section} aria-labelledby="format">
        <h4 id="format" className={s.h4}>
          ⏱ Formato timer
        </h4>
        <div className={s.row}>
          <label className={s.inline} htmlFor="showHours">
            <input
              id="showHours"
              type="checkbox"
              checked={settings.showHours ?? false}
              onChange={(e) => upd('showHours', e.target.checked)}
            />
            <span>Mostra ore (hh:mm:ss)</span>
          </label>
        </div>
      </section>
    </div>
  )
}
