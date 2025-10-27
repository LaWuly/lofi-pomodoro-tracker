import { useEffect, useRef, useState } from 'react'
import styles from './AudioPlayer.module.css'

interface Props {
  src: string
  compact?: boolean
}

/* Player locale */
export function AmbiencePlayer({ src, compact }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!src && isPlaying) setIsPlaying(false)
  }, [src, isPlaying])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (isPlaying) {
      el.pause()
      setIsPlaying(false)
    } else {
      el.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const title = src
    ? src
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '') || 'Ambience'
    : 'Nessun suono selezionato'

  return (
    <div className={`${styles.player} ${compact ? styles.compact : ''}`}>
      <div className={styles.thumb}>🌿</div>

      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.sub}>Ambience Player</div>
      </div>

      <button
        className={styles.playBtn}
        onClick={togglePlay}
        disabled={!src}
        title={isPlaying ? 'Pausa' : 'Riproduci'}
      >
        {isPlaying ? '⏸' : '▶️'}
      </button>

      <audio ref={audioRef} src={src || undefined} loop />
    </div>
  )
}
