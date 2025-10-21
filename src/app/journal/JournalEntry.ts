export type JournalFormat = 'plain' | 'md'

export type JournalEntry = {
  id: string
  date: string // ISO
  mood: number // 1..5
  text: string
  format: JournalFormat
}
