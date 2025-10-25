// src/app/clock/state.ts
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignora
  }
}

export function appendJSON<T>(key: string, value: T) {
  const arr = loadJSON<T[]>(key, [])
  arr.push(value)
  saveJSON(key, arr)
}

/** Tipo coerente con il Journal v1 */
export interface JournalEntry {
  id: string
  date: string
  text: string
  format: 'plain' | 'md'
  mood: number
  source: string
  durataMin: number
  tag: string[]
}

/* Aggiunge log al Journal (retrocompatibile con v1). */
export function safeAppendJournal(entry: {
  date: string
  text: string
  format?: 'plain' | 'md'
  source?: string
  durataMin?: number
  tag?: string[]
  mood?: number
}) {
  try {
    const KEY = 'journal_v1'
    const list = loadJSON<JournalEntry[]>(KEY, [])
    const toPush: JournalEntry = {
      id: crypto.randomUUID(),
      date: entry.date,
      text: entry.text,
      format: entry.format ?? 'plain',
      mood: entry.mood ?? 3,
      source: entry.source ?? 'pomodoro',
      durataMin: entry.durataMin ?? 0,
      tag: entry.tag ?? ['focus'],
    }
    list.push(toPush)
    saveJSON(KEY, list)
  } catch {
    // non bloccare l'app se localStorage non è disponibile
  }
}

/** Tipo per log unificato cross-app */
export interface UnifiedLogEntry {
  id: string
  [key: string]: unknown
}

/* Utility per log unificato cross-app (Pomodoro, Workout, Journal, ecc.) */
export function safeAppendUnifiedLog(entry: Record<string, unknown>) {
  try {
    const KEY = 'life_log'
    const list = loadJSON<UnifiedLogEntry[]>(KEY, [])
    const toPush: UnifiedLogEntry = { id: crypto.randomUUID(), ...entry }
    list.push(toPush)
    saveJSON(KEY, list)
  } catch {
    //
  }
}
