import { useCallback, useState } from 'react'
import type { CalcState, Mode } from '@domain/calculator/types'

export function useCalculator() {
  const [cur, setCur] = useState('0') // buffer / display
  const [opLine, setOpLine] = useState('') // formula (per ora vuota)
  const [mode, setMode] = useState<Mode>('idle')

  const onDigit = useCallback(
    (d: string) => {
      setCur((prev) => {
        if (mode === 'result') {
          setOpLine('')
          setMode('typing')
          return d
        }
        // evita 00... (consenti però -0 → sostituisci la parte numerica)
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

  const onClear = useCallback(() => {
    setCur('0')
    setOpLine('')
    setMode('idle')
  }, [])

  const state: CalcState = { opLine, display: cur }
  return { state, onDigit, onDecimal, onClear }
}
