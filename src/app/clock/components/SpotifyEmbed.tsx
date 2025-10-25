import styles from '../Clock.module.css'
import type { AppSettings } from '../types'
import { useState } from 'react'

interface Props {
  settings: AppSettings
}

export function SpotifyEmbed({ settings }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  if (!settings.spotifyEnabled || !settings.spotifyUrl) return null

  return (
    <div
      className={`${styles.card} ${styles.spotifyCard}`}
      style={{ marginBottom: 16 }}
    >
      <div
        className={styles.row}
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <b>🎵 Focus Player</b>
        <button className={styles.btn} onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? 'Mostra' : 'Nascondi'}
        </button>
      </div>

      {!collapsed && (
        <iframe
          src={settings.spotifyUrl}
          width="100%"
          height="152"
          style={{
            border: 'none',
            borderRadius: '12px',
          }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      )}
    </div>
  )
}
