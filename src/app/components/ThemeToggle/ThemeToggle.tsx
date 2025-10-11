import { useEffect, useMemo, useState } from 'react'
type Theme = 'light' | 'dark'

function getSystemPref(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    return saved ?? getSystemPref()
  })

  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') html.setAttribute('data-theme', 'dark')
    else html.removeAttribute('data-theme')
    localStorage.setItem('theme', theme)
  }, [theme])

  const icon = useMemo(() => (theme === 'dark' ? '☀️' : '🌙'), [theme])
  const label =
    theme === 'dark'
      ? 'Passa a tema chiaro (alba/mattino)'
      : 'Passa a tema scuro (crepuscolo/notte)'

  return (
    <div style={{ position: 'fixed', top: 14, right: 14, zIndex: 10 }}>
      <button
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        aria-label={label}
        title={label}
        style={{
          width: 42,
          height: 42,
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,.18)',
          background: 'rgba(255,255,255,.25)',
          backdropFilter: 'blur(6px)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {icon}
      </button>
    </div>
  )
}
