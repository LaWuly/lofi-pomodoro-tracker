import { useEffect, useRef, useState } from 'react'
import {
  initialState,
  tick,
  reset as resetEngine,
} from '@domain/timer/TimerEngine'
import type { PomodoroConfig, PomodoroState } from '@domain/timer/types'

export function usePomodoro(cfg: PomodoroConfig) {
  const [state, setState] = useState<PomodoroState>(() => initialState(cfg))
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevRingingRef = useRef(false)

  // 1. Clock
  const { sessionLength, breakLength, ringHoldSec } = cfg

  useEffect(() => {
    if (!state.isRunning) return

    const configSnap: PomodoroConfig = {
      sessionLength,
      breakLength,
      ringHoldSec,
    }

    const id = window.setInterval(() => {
      setState((prev) => tick(prev, configSnap))
    }, 1000)

    return () => window.clearInterval(id)
  }, [state.isRunning, sessionLength, breakLength, ringHoldSec])

  // 2. Beep quando entri in ring
  useEffect(() => {
    const justEntered = state.isRinging && !prevRingingRef.current
    if (justEntered) {
      const a = audioRef.current
      if (a) {
        try {
          a.currentTime = 0
          void a.play()
        } catch {
          // alcuni browser richiedono interazione utente: ok per FCC
        }
      }
    }
    prevRingingRef.current = state.isRinging
  }, [state.isRinging])

  // 3. Sync timeLeft quando cambi le durate, solo in pausa
  const isRunningRef = useRef(state.isRunning)

  useEffect(() => {
    isRunningRef.current = state.isRunning
  }, [state.isRunning])

  useEffect(() => {
    if (isRunningRef.current) return

    const target =
      state.phase === 'Session' ? cfg.sessionLength * 60 : cfg.breakLength * 60

    setState((s) => (s.timeLeft === target ? s : { ...s, timeLeft: target }))
  }, [cfg.sessionLength, cfg.breakLength, state.phase])

  // 4. API minime per la UI
  const toggleRun = () => setState((s) => ({ ...s, isRunning: !s.isRunning }))
  const reset = () => {
    setState((prev) => resetEngine(prev, cfg))
    prevRingingRef.current = false
    const a = audioRef.current
    if (a) {
      a.pause()
      a.currentTime = 0
    }
  }

  return { state, toggleRun, reset, audioRef }
}
