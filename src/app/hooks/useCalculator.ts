// Hook UI: buffer, linea formula, calcolo L2R, input tastiera

import { useCallback, useState } from 'react'
import type { KeyboardEventHandler } from 'react'
import type { CalcState, Mode, Op } from '@domain/calculator/types'
import { formatOut } from '@domain/calculator/types'
import { evalL2R } from '@domain/calculator/CalculatorEngine'

export function useCalculator() {
  const [cur, setCur] = useState('0')
  const [opLine, setOpLine] = useState('')
  const [mode, setMode] = useState<Mode>('idle')
  const [pendingOp, setPendingOp] = useState<Op | null>(null)

  // --- Input numerico -------------------------------------------------
  const resetFromError = (next: string, nextMode: Mode = 'typing') => {
    setOpLine('')
    setCur(next)
    setMode(nextMode)
  }

  const onDigit = useCallback(
    (d: string) => {
      setCur((prev) => {
        if (prev === 'Error') {
          resetFromError(d)
          return d
        }
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
      if (prev === 'Error') {
        resetFromError('0.')
        return '0.'
      }
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

  // --- '-' come segno -------------------------------------------------
  const applyMinusAsSign = useCallback(() => {
    if (cur === 'Error') {
      resetFromError('-')
      return true
    }
    if (mode === 'idle') {
      setCur((prev) => (prev === '0' ? '-0' : prev === '' ? '-' : prev))
      setMode('typing')
      return true
    }
    return false
  }, [mode, cur])

  // --- Operatori ------------------------------------------------------
  const onOp = useCallback(
    (op: Op) => {
      if (cur === 'Error') {
        resetFromError('0', 'idle') /* continua */
      }

      // dopo "=", inizia nuovo calcolo dal risultato e azzera buffer
      if (mode === 'result') {
        setOpLine(`${cur} ${op}`)
        setPendingOp(op)
        setCur('0')
        setMode('idle')
        return
      }

      // prova a usare '-' come segno
      if (op === '-' && applyMinusAsSign()) return

      if (mode === 'typing') {
        // se stavo digitando solo il segno ('-0') e premo un altro operatore:
        // ignoro il segno e SOSTITUISCO l'operatore precedente
        if (cur === '-0') {
          setOpLine((prev) =>
            prev
              ? prev.replace(/([+\-x/])\s*$/, ` ${op}`)
              : `${formatOut(0)} ${op}`,
          )
          setCur('0')
          setMode('idle')
          return
        }

        setOpLine((prev) => `${prev}${prev ? ' ' : ''}${cur} ${op}`)
        setPendingOp(op)
        setMode('idle')
        setCur('0')
        return
      }

      // sostituisci l'ultimo operatore con l'ultimo premuto
      setOpLine((prev) => prev.replace(/([+\-x/])\s*$/, ` ${op}`))
      setPendingOp(op)
    },
    [mode, cur, applyMinusAsSign],
  )

  // --- equals ---------------------------------------------------------
  const onEquals = useCallback(() => {
    if (cur === 'Error') {
      resetFromError('0', 'result')
      return
    }
    const base = opLine.trim()
    const parts = base ? base.split(/\s+/) : []
    if (mode === 'typing') parts.push(cur)
    if (!parts.length) parts.push(cur)

    const val = evalL2R(parts as (string | Op)[])
    const out = formatOut(val)

    const lineBeforeEq = base
      ? mode === 'typing'
        ? `${base} ${cur}`
        : base
      : cur
    setOpLine(`${lineBeforeEq} =`)

    setCur(out)
    setPendingOp(null)
    setMode('result')
  }, [opLine, cur, mode])

  // --- tastiera -------------------------------------------------------
  const onKeyDown: KeyboardEventHandler<HTMLElement> = (e) => {
    const k = e.key
    if (/\d/.test(k)) {
      onDigit(k)
      return
    }
    if (k === '.') {
      onDecimal()
      return
    }
    if (k === 'Enter' || k === '=') {
      e.preventDefault()
      onEquals()
      return
    }
    if (k === 'Escape') {
      onClear()
      return
    }
    if (k === '+' || k === '-' || k === '*' || k === '/' || k === 'x') {
      const map: Record<string, Op> = {
        '+': '+',
        '-': '-',
        '*': 'x',
        '/': '/',
        x: 'x',
      }
      onOp(map[k])
      return
    }
  }

  const state: CalcState = { opLine, display: cur }
  return { state, onDigit, onDecimal, onClear, onOp, onEquals, onKeyDown }
}
