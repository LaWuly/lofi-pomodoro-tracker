import { useMemo, useState } from 'react'
import { useAppSettings } from '@app/settings/AppSettingsContext'
import { toEmbedUrl, isValidSpotify } from '@app/music/spotify' // 👈 nuovo
import s from './MusicSettings.module.css'

export function MusicSettingsPanel() {
  const {
    state: { music },
    setPlayer,
    toggleMiniPlayer,
    addSpotifyPlaylist,
    removeSpotifyPlaylist,
    setActiveSpotify,
    setActiveAmbience,
    updatePlaylistName,
  } = useAppSettings()

  const [newName, setNewName] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const embedUrl = useMemo(() => (newUrl ? toEmbedUrl(newUrl) : null), [newUrl])

  const canAdd = !!newName.trim() && !!embedUrl

  const isAmbience = music.player === 'ambience'

  return (
    <div className={s.wrap}>
      <h3 className={s.title}>🎵 Musica</h3>

      {/* Player */}
      <section className={s.section} aria-labelledby="music-player">
        <h4 id="music-player" className={s.h4}>
          Sorgente audio
        </h4>

        <div className={s.row}>
          <div
            className={s.seg}
            role="tablist"
            aria-label="Seleziona sorgente audio"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isAmbience}
              className={`${s.segBtn} ${!isAmbience ? s.segActive : ''}`}
              onClick={() => setPlayer('spotify')}
            >
              🎧 Spotify
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isAmbience}
              className={`${s.segBtn} ${isAmbience ? s.segActive : ''}`}
              onClick={() => setPlayer('ambience')}
            >
              🌿 Ambience
            </button>
          </div>

          <label className={s.inline}>
            <input
              type="checkbox"
              checked={music.showMiniPlayer}
              onChange={() => toggleMiniPlayer()}
            />
            Mini player visibile
          </label>
        </div>
      </section>

      {/* Spotify */}
      {!isAmbience && (
        <section className={s.section} aria-labelledby="spotify-pl">
          <h4 id="spotify-pl" className={s.h4}>
            Playlist Spotify
          </h4>

          <div className={s.row}>
            <input
              className={s.input}
              type="text"
              placeholder="Nome (es. Focus Lofi)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className={s.input}
              type="text"
              placeholder="URL playlist/album/brano (anche intl-xx o URI)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              aria-invalid={!!newUrl && !isValidSpotify(newUrl)}
              title="Incolla un link Spotify valido (URL o URI), verrà convertito in /embed"
            />
            <button
              className={s.btn}
              disabled={!canAdd}
              onClick={() => {
                addSpotifyPlaylist({ name: newName.trim(), url: embedUrl! })
                setNewName('')
                setNewUrl('')
              }}
              type="button"
            >
              Aggiungi
            </button>
          </div>

          {music.playlists.length > 0 ? (
            <ul className={s.list}>
              {music.playlists.map((pl) => (
                <li key={pl.id} className={s.itemRow}>
                  <input
                    className={s.input}
                    type="text"
                    value={pl.name}
                    onChange={(e) => updatePlaylistName(pl.id, e.target.value)}
                    aria-label={`Nome playlist ${pl.name}`}
                  />
                  <div className={s.itemActions}>
                    <button
                      className={`${s.btn} ${music.activeSpotifyId === pl.id ? s.active : ''}`}
                      onClick={() => setActiveSpotify(pl.id)}
                      type="button"
                      aria-pressed={music.activeSpotifyId === pl.id}
                      title="Imposta come attiva"
                    >
                      Attiva
                    </button>
                    <button
                      className={s.btnDanger}
                      onClick={() => removeSpotifyPlaylist(pl.id)}
                      type="button"
                      title="Elimina playlist"
                    >
                      Elimina
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={s.note}>Nessuna playlist salvata.</p>
          )}
        </section>
      )}

      {/* Ambience */}
      {isAmbience && (
        <section className={s.section} aria-labelledby="ambience">
          <h4 id="ambience" className={s.h4}>
            Suoni ambiente
          </h4>
          <div className={s.pills}>
            {music.ambiencePresets.map((a) => (
              <button
                key={a.id}
                className={`${s.pill} ${music.activeAmbienceId === a.id ? s.pillActive : ''}`}
                onClick={() => setActiveAmbience(a.id)}
                type="button"
                aria-pressed={music.activeAmbienceId === a.id}
              >
                {a.name}
              </button>
            ))}
          </div>
          <p className={s.note}>File da aggiungere in /public/audio</p>
        </section>
      )}
    </div>
  )
}
