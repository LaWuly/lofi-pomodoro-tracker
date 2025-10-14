export type Mode = 'idle' | 'typing' | 'result'
export interface CalcState {
  opLine: string
  display: string
}
export const formatOut = (n: number): string => {
  // Gestione casi speciali
  if (Number.isNaN(n)) return 'Error'
  if (!Number.isFinite(n)) return '∞'

  // Arrotondamento a 12 decimali
  const x = Math.round(n * 1e12) / 1e12

  // Correzione per -0 → 0
  const safe = Object.is(x, -0) ? 0 : x

  // Conversione a stringa
  const s = safe.toString()

  // Rimozione zeri inutili dopo il punto decimale
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s
}
