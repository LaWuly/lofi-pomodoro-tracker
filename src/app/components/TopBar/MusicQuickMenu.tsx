import { useEffect, useRef } from 'react'
import { useAppSettings } from '@app/settings/AppSettingsContext'
import s from './MusicQuickMenu.module.css'

interface Props {
  onClose: () => void
}

export default function MusicQuickMenu({ onClose }: Props) {
  const {
    state: { music },
    setPlayer,
    toggleMiniPlayer,
    setActiveSpotify,
    setActiveAmbience,
  } = useAppSettings()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const isSpotify = music.player === 'spotify'

  return (
    <div className={s.menu} ref={ref} role="menu" aria-label="Musica rapida">
      <div className={s.row}>
        <button
          className={`${s.btn} ${isSpotify ? s.active : ''}`}
          onClick={() => setPlayer('spotify')}
          type="button"
        >
          Spotify
        </button>
        <button
          className={`${s.btn} ${!isSpotify ? s.active : ''}`}
          onClick={() => setPlayer('ambience')}
          type="button"
        >
          Ambience
        </button>
        <label className={s.inline}>
          <input
            type="checkbox"
            checked={music.showMiniPlayer}
            onChange={() => toggleMiniPlayer()}
          />
          Mini player
        </label>
      </div>

      {isSpotify ? (
        <div className={s.group}>
          <div className={s.label}>Playlist</div>
          <div className={s.pills}>
            {music.playlists.map((pl) => (
              <button
                key={pl.id}
                className={`${s.pill} ${music.activeSpotifyId === pl.id ? s.pillActive : ''}`}
                onClick={() => setActiveSpotify(pl.id)}
                type="button"
                title={pl.name}
              >
                {pl.name}
              </button>
            ))}
          </div>
          <small className={s.hint}>
            Aggiungi/modifica da Impostazioni → Musica
          </small>
        </div>
      ) : (
        <div className={s.group}>
          <div className={s.label}>Suoni ambiente</div>
          <div className={s.pills}>
            {music.ambiencePresets.map((a) => (
              <button
                key={a.id}
                className={`${s.pill} ${music.activeAmbienceId === a.id ? s.pillActive : ''}`}
                onClick={() => setActiveAmbience(a.id)}
                type="button"
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        className={s.link}
        onClick={onClose}
        data-open-settings="music"
        type="button"
        title="Apri impostazioni Musica"
      >
        Apri impostazioni complete…
      </button>
    </div>
  )
}
