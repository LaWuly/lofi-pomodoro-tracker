// routes/prefetch.ts
type Prefetcher = () => Promise<unknown>

export const prefetchers: Record<string, Prefetcher> = {
  clock: () => import('../app/clock'),
  journal: () => import('../app/journal'),
  workout: () => import('../app/workout'),
  cycle: () => import('../app/cycle'),
  recipes: () => import('../app/recipes'),
  meditation: () => import('../app/meditation'),
  archive: () => import('../app/archive'),
}

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
    setTimeout(run, 0)
  }
}
