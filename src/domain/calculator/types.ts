// Tipi e util generici per la calcolatrice

export type Mode = 'idle' | 'typing' | 'result'
export interface CalcState {
  opLine: string
  display: string
}

export type Op = '+' | '-' | 'x' | '/'
export const isOp = (c: string): c is Op => ['+', '-', 'x', '/'].includes(c)

export const formatOut = (n: number): string => {
  // Casi speciali
  if (Number.isNaN(n)) return 'Error'
  if (!Number.isFinite(n)) return '∞'

  // Arrotondamento e normalizzazione -0 → 0
  const x = Math.round(n * 1e12) / 1e12
  const safe = Object.is(x, -0) ? 0 : x
  const s = safe.toString()

  // Rimozione zeri inutili dopo il punto decimale
  return s.includes('.') ? s.replace(/\.0+$/, '') : s
}
