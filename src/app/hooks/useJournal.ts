import { useEffect, useMemo, useState } from 'react'

export type JournalFormat = 'plain' | 'md'
export type JournalEntry = {
  id: string
  date: string // ISO string (yyyy-mm-dd)
  mood: number // 1..5
  text: string
  format: JournalFormat
}

const STORAGE_KEY = 'journal_v1'

function safeLoad(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function safeSave(entries: JournalEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // ignora
  }
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => safeLoad())

  useEffect(() => {
    safeSave(entries)
  }, [entries])

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [currentId, setCurrentId] = useState<string | null>(null)

  const current = useMemo(() => {
    if (!currentId) return null
    return entries.find((e) => e.id === currentId) ?? null
  }, [entries, currentId])

  function createEmpty(date = todayISO): JournalEntry {
    return {
      id: crypto.randomUUID(),
      date,
      mood: 3,
      text: '',
      format: 'plain',
    }
  }

  function addEntry(partial?: Partial<JournalEntry>) {
    const entry = { ...createEmpty(), ...partial }
    setEntries((prev) => [entry, ...prev])
    setCurrentId(entry.id)
    return entry.id
  }

  function updateEntry(id: string, patch: Partial<JournalEntry>) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    )
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    if (currentId === id) setCurrentId(null)
  }

  return {
    entries,
    current,
    currentId,
    setCurrentId,
    addEntry,
    updateEntry,
    removeEntry,
    todayISO,
  }
}
