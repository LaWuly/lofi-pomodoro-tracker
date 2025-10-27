import { toEmbedUrl } from '@app/music/spotify'

type Size = 'full' | 'compact'
interface Props {
  url: string | null
  size?: Size
}

export function SpotifyPlayer({ url, size = 'compact' }: Props) {
  if (!url) return null
  const embed = toEmbedUrl(url)
  if (!embed) return null

  const height = size === 'compact' ? 80 : 152

  return (
    <iframe
      src={embed}
      width="100%"
      height={height}
      style={{ border: 'none', borderRadius: 12 }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify Player"
    />
  )
}
