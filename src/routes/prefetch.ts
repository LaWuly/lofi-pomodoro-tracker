type Prefetcher = () => Promise<unknown>

// Map
export const prefetchers: Record<string, Prefetcher> = {
  clock: () => import('../app/clock'),
  calculator: () => import('../app/calculator'),
  markdown: () => import('../app/markdown'),
  journal: () => import('../app/journal'),
  drum: () => import('../app/drum'),
}

// Utility
export type Slug = keyof typeof prefetchers

export function prefetchChunk(key: Slug) {
  const run = () => prefetchers[key]?.().catch(() => void 0)
  if ('requestIdleCallback' in window) {
    const ric = window.requestIdleCallback as (
      cb: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number
    ric(run, { timeout: 1500 })
  } else {
    // fallback
    setTimeout(run, 0)
  }
}
