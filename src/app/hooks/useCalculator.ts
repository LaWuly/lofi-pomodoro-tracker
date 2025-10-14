// Hook UI: gestisce buffer, modalità e costruzione opLine (senza calcolo)

import { useCallback, useState } from 'react'
import type { CalcState, Mode, Op } from '@domain/calculator/types'

export function useCalculator() {
  // Buffer numero corrente (display) + linea formula
  const [cur, setCur] = useState('0')
  const [opLine, setOpLine] = useState('')
  const [mode, setMode] = useState<Mode>('idle')

  // Operatore in attesa (usato poi in E6 per il calcolo)
  const [pendingOp, setPendingOp] = useState<Op | null>(null)

  // --- Input numerico -------------------------------------------------
  const onDigit = useCallback(
    (d: string) => {
      setCur((prev) => {
        if (mode === 'result') {
          setOpLine('')
          setMode('typing')
          return d
        }
        if (prev === '0') return d
        if (prev === '-0') return '-' + d
        return prev + d
      })
      if (mode !== 'typing') setMode('typing')
    },
    [mode],
  )

  const onDecimal = useCallback(() => {
    setCur((prev) => {
      if (mode === 'result') {
        setOpLine('')
        setMode('typing')
        return '0.'
      }
      return prev.includes('.') ? prev : prev + '.'
    })
  }, [mode])

  // --- Reset ----------------------------------------------------------
  const onClear = useCallback(() => {
    setCur('0')
    setOpLine('')
    setMode('idle')
    setPendingOp(null)
  }, [])

  // --- '-' come segno dopo operatore/all'inizio -----------------------
  const applyMinusAsSign = useCallback(() => {
    if (mode === 'idle') {
      setCur((prev) => (prev === '0' ? '-0' : prev === '' ? '-' : prev))
      setMode('typing')
      return true
    }
    return false
  }, [mode])

  // --- Operatori (+ - x /) --------------------------------------------
  const onOp = useCallback(
    (op: Op) => {
      // Dopo '=', inizia una nuova espressione partendo dalla result **visibile**
      if (mode === 'result') {
        setOpLine(`${cur} ${op}`)
        setPendingOp(op)
        setMode('idle')
        // mantengo il display sulla result; si azzererà quando inizi a digitare
        return
      }

      // '-' come segno del numero che sta per arrivare
      if (op === '-' && applyMinusAsSign()) return

      if (mode === 'typing') {
        // Chiudo il numero corrente in opLine e passo in idle per il prossimo input
        setOpLine((prev) => `${prev}${prev ? ' ' : ''}${cur} ${op}`)
        setPendingOp(op)
        setMode('idle')
        setCur('0')
        return
      }

      // mode === 'idle' → sostituzione dell'ultimo operatore
      setOpLine((prev) => prev.replace(/([+\-x/])\s*$/, '') + op)
      setPendingOp(op)
    },
    [mode, cur, applyMinusAsSign],
  )

  const state: CalcState = { opLine, display: cur }
  return { state, onDigit, onDecimal, onClear, onOp }
}
