import { useState, useEffect, useRef } from 'react'
import type { PomodoroConfig, PomodoroState } from '@domain/timer/types'
import { initialState, tick, reset } from '@domain/timer/TimerEngine'

export function usePomodoro(initial: PomodoroConfig) {
  const [config, setConfig] = useState<PomodoroConfig>(initial)
  const [state, setState] = useState<PomodoroState>(() => initialState(initial))

  // Contenitore per l'intervallo
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    // Se sta girando && NON ho ancora un interval, lo creo
    if (state.isRunning && intervalRef.current == null) {
      intervalRef.current = window.setInterval(() => {
        // Ogni secondo applico la funzione pura tick -> nuovo stato
        setState((s) => tick(s, config))
      }, 1000)
    }

    // Se è in pausa && ho un interval attivo, lo spengo
    if (!state.isRunning && intervalRef.current != null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Cleanup quando il componente si smonta o cambiano deps
    return () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isRunning, config])

  // Se il timer è fermo, aggiorna il display in base alla config corrente
  useEffect(() => {
    if (!state.isRunning) {
      setState((s) => ({
        ...s,
        timeLeft:
          s.phase === 'Session'
            ? config.sessionLength * 60
            : config.breakLength * 60,
      }))
    }
  }, [config.sessionLength, config.breakLength, state.isRunning, state.phase])

  const clamp = (v: number) => Math.min(60, Math.max(1, v))
  const actions = {
    //avvio, pausa, reset del timer
    start: () => setState((s) => ({ ...s, isRunning: true })),
    pause: () => setState((s) => ({ ...s, isRunning: false })),
    reset: () => setState((s) => reset(s, config)),

    //Modifiche break/session in minuti
    incBreak: () =>
      setConfig((c) => ({ ...c, breakLength: clamp(c.breakLength + 1) })),
    decBreak: () =>
      setConfig((c) => ({ ...c, breakLength: clamp(c.breakLength - 1) })),

    incSession: () =>
      setConfig((c) => ({ ...c, sessionLength: clamp(c.sessionLength + 1) })),
    decSession: () =>
      setConfig((c) => ({ ...c, sessionLength: clamp(c.sessionLength - 1) })),
  }

  return { state, config, actions }
}
