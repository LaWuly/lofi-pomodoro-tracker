import type { PomodoroConfig, PomodoroState } from './types'
import { minutesToSeconds } from './types'

// 1. Stato iniziale
export function initialState(cfg: PomodoroConfig): PomodoroState {
  return {
    phase: 'Session',
    timeLeft: minutesToSeconds(cfg.sessionLength),
    isRunning: false,
  }
}

//2. Tick
export function tick(state: PomodoroState, cfg: PomodoroConfig): PomodoroState {
  if (!state.isRunning) {
    return state
  }
  if (state.timeLeft > 0) {
    return { ...state, timeLeft: state.timeLeft - 1 }
  } else {
    const nextPhase = state.phase === 'Session' ? 'Break' : 'Session'
    const nextTime =
      nextPhase === 'Session'
        ? minutesToSeconds(cfg.sessionLength)
        : minutesToSeconds(cfg.breakLength)
    return { ...state, phase: nextPhase, timeLeft: nextTime }
  }
}

//3. Reset
export function reset(
  _state: PomodoroState,
  cfg: PomodoroConfig,
): PomodoroState {
  return {
    phase: 'Session',
    timeLeft: minutesToSeconds(cfg.sessionLength),
    isRunning: false,
  }
}
