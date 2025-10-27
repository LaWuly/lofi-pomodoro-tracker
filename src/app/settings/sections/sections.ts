export type SectionKey = 'general' | 'timer' | 'music'

export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'general', label: 'Generali' },
  { key: 'timer', label: 'Timer' },
  { key: 'music', label: 'Musica' },
]
