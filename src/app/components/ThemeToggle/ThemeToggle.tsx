import { useEffect, useMemo, useState } from 'react'
import styles from './ThemeToggle.module.css'

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
    <div className={styles.wrapper}>
      <button
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        aria-label={label}
        title={label}
        className={styles.button}
      >
        {icon}
      </button>
    </div>
  )
}
