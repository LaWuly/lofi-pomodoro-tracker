const EMBED_BASE = 'https://open.spotify.com/embed'
const TYPES = new Set([
  'track',
  'album',
  'playlist',
  'artist',
  'show',
  'episode',
])

/** Converte URL/URI Spotify (intl-xx, embed già pronto, ?si=...) in URL /embed/{type}/{id} */
export function toEmbedUrl(raw: string): string | null {
  if (!raw) return null
  const input = raw.trim()

  if (input.startsWith('spotify:')) {
    const [, type, id] = input.split(':')
    return type && id && TYPES.has(type) ? `${EMBED_BASE}/${type}/${id}` : null
  }

  // URL
  let u: URL
  try {
    u = new URL(input)
  } catch {
    return null
  }
  if (!u.hostname.endsWith('spotify.com')) return null

  const segs = u.pathname.split('/').filter(Boolean)
  if (segs[0]?.startsWith('intl-')) segs.shift()

  if (segs[0] === 'embed') {
    const rest = segs.slice(1).join('/')
    return rest ? `${EMBED_BASE}/${rest.split('?')[0]}` : null
  }

  // {type}/{id}
  const type = segs[0]
  const id = segs[1]
  if (!type || !id || !TYPES.has(type)) return null

  return `${EMBED_BASE}/${type}/${id}`
}

export function isValidSpotify(raw: string): boolean {
  return !!toEmbedUrl(raw)
}
