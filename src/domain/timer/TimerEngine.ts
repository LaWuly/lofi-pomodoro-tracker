import type { PomodoroConfig, PomodoroState, Phase } from './types'
import { minutesToSeconds } from './types'

// 1. Stato iniziale
export function initialState(cfg: PomodoroConfig): PomodoroState {
  return {
    phase: 'Session',
    timeLeft: minutesToSeconds(cfg.sessionLength),
    isRunning: false,
    isRinging: false,
    ringLeft: Math.max(1, cfg.ringHoldSec ?? 1),
    completedWork: 0,
  }
}

// 2. Prossima fase + tempo
function nextPhaseAndTime(
  cfg: PomodoroConfig,
  cur: Phase,
  completedWork: number,
) {
  if (cur === 'Session') {
    const nextIsLong =
      cfg.longBreakInterval > 0 && completedWork % cfg.longBreakInterval === 0
    const phase: Phase = nextIsLong ? 'LongBreak' : 'ShortBreak'
    const len = nextIsLong ? cfg.longBreakLength : cfg.shortBreakLength
    return { phase, timeLeft: minutesToSeconds(len) }
  } else {
    return {
      phase: 'Session' as const,
      timeLeft: minutesToSeconds(cfg.sessionLength),
    }
  }
}

// 3. Tick
export function tick(state: PomodoroState, cfg: PomodoroConfig): PomodoroState {
  if (!state.isRunning) {
    return state
  }

  // Ring
  if (state.isRinging) {
    const nextRing = Math.max(0, state.ringLeft - 1)
    if (nextRing > 0) {
      return { ...state, timeLeft: 0, ringLeft: nextRing }
    } else {
      // Switch fase
      const inc = state.phase === 'Session' ? 1 : 0
      const nextCW = state.completedWork + inc
      const { phase, timeLeft } = nextPhaseAndTime(cfg, state.phase, nextCW)
      return {
        ...state,
        phase,
        timeLeft,
        isRinging: false,
        ringLeft: Math.max(1, cfg.ringHoldSec ?? 1),
        completedWork: nextCW,
      }
    }
  }

  // Countdown normale
  if (state.timeLeft > 0) {
    return { ...state, timeLeft: state.timeLeft - 1 }
  }

  // Ring
  return {
    ...state,
    isRinging: true,
    ringLeft: Math.max(1, cfg.ringHoldSec ?? 1),
    timeLeft: 0,
  }
}

// 4. Reset
export function reset(
  _state: PomodoroState,
  cfg: PomodoroConfig,
): PomodoroState {
  return initialState(cfg)
}
