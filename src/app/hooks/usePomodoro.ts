import { useEffect, useRef, useState } from 'react'
import {
  initialState,
  tick,
  reset as resetEngine,
} from '@domain/timer/TimerEngine'
import type { PomodoroConfig, PomodoroState, Phase } from '@domain/timer/types'
import { formatTime } from '@domain/timer/types'

type Options = {
  autoStartBreaks?: boolean
  autoStartPomodoros?: boolean
  showHours?: boolean
}

export function usePomodoro(cfg: PomodoroConfig, opt: Options = {}) {
  const [state, setState] = useState<PomodoroState>(() => initialState(cfg))
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 1. Clock
  const {
    sessionLength,
    shortBreakLength,
    longBreakLength,
    longBreakInterval,
    ringHoldSec,
  } = cfg

  useEffect(() => {
    if (!state.isRunning) return

    const configSnap: PomodoroConfig = {
      sessionLength,
      shortBreakLength,
      longBreakLength,
      longBreakInterval,
      ringHoldSec,
    }

    const id = window.setInterval(() => {
      setState((prev) => tick(prev, configSnap))
    }, 1000)

    return () => window.clearInterval(id)
  }, [
    state.isRunning,
    sessionLength,
    shortBreakLength,
    longBreakLength,
    longBreakInterval,
    ringHoldSec,
  ])

  // 2. Beep quando entri in ring
  const prevRingingRef = useRef(state.isRinging)
  useEffect(() => {
    const justEntered = state.isRinging && !prevRingingRef.current
    if (justEntered) {
      const a = audioRef.current
      if (a) {
        try {
          a.currentTime = 0
          void a.play()
        } catch {
          /* alcuni browser richiedono interazione utente */
        }
      }
    }
    prevRingingRef.current = state.isRinging
  }, [state.isRinging])

  // 3. Sync timeLeft
  const isRunningRef = useRef(state.isRunning)

  useEffect(() => {
    isRunningRef.current = state.isRunning
  }, [state.isRunning])

  useEffect(() => {
    if (isRunningRef.current || state.isRinging) return

    const target =
      state.phase === 'Session'
        ? sessionLength * 60
        : state.phase === 'ShortBreak'
          ? shortBreakLength * 60
          : longBreakLength * 60

    setState((s) => (s.timeLeft === target ? s : { ...s, timeLeft: target }))
  }, [
    sessionLength,
    shortBreakLength,
    longBreakLength,
    state.phase,
    state.isRinging,
  ])

  // 4. Auto-start dopo il ring (opzionale)
  const prevPhaseRef = useRef<Phase>(state.phase)
  useEffect(() => {
    const phaseChanged = state.phase !== prevPhaseRef.current
    const exitedRing = !state.isRinging
    if (phaseChanged && exitedRing) {
      const shouldRun =
        (state.phase === 'Session' && opt.autoStartPomodoros) ||
        ((state.phase === 'ShortBreak' || state.phase === 'LongBreak') &&
          opt.autoStartBreaks)
      if (shouldRun) {
        // prossimo tick, evita race con il cambio fase
        setTimeout(() => setState((s) => ({ ...s, isRunning: true })), 0)
      }
    }
    prevPhaseRef.current = state.phase
  }, [
    state.phase,
    state.isRinging,
    opt.autoStartBreaks,
    opt.autoStartPomodoros,
  ])

  // 5. API controllo
  const toggleRun = () => setState((s) => ({ ...s, isRunning: !s.isRunning }))
  const reset = () => {
    setState((prev) => resetEngine(prev, cfg))
    const a = audioRef.current
    if (a) {
      a.pause()
      a.currentTime = 0
    }
  }

  // 6. Cambio fase manuale (ferma il run/ring)
  const setPhase = (phase: Phase) => {
    const nextTime =
      phase === 'Session'
        ? sessionLength * 60
        : phase === 'ShortBreak'
          ? shortBreakLength * 60
          : longBreakLength * 60

    setState((s) => ({
      ...s,
      phase,
      timeLeft: nextTime,
      isRunning: false,
      isRinging: false,
    }))
  }

  // 7. Formatting
  const formattedTime = formatTime(state.timeLeft, opt.showHours ?? false)

  return {
    state,
    toggleRun,
    reset,
    setPhase,
    formattedTime,
    audioRef,
  }
}
