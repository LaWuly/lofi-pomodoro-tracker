import type { PomodoroConfig, PomodoroState, Phase } from './types'
import { minutesToSeconds } from './types'

// 1. Stato iniziale
export function initialState(cfg: PomodoroConfig): PomodoroState {
  return {
    phase: 'Session',
    timeLeft: minutesToSeconds(cfg.sessionLength),
    isRunning: false,
    isRinging: false,
    ringLeft: 0,
  }
}

// 2. Helper per calcolare prossima fase + tempo
function nextPhaseAndTime(cfg: PomodoroConfig, cur: Phase) {
  const nextPhase: Phase = cur === 'Session' ? 'Break' : 'Session'
  const nextTime =
    nextPhase === 'Session'
      ? minutesToSeconds(cfg.sessionLength)
      : minutesToSeconds(cfg.breakLength)
  return { phase: nextPhase, timeLeft: nextTime }
}

// 3. Tick
export function tick(state: PomodoroState, cfg: PomodoroConfig): PomodoroState {
  if (!state.isRunning) {
    return state
  }

  // Ring, timer 0.00, switch di fase
  if (state.isRinging) {
    const nextRing = Math.max(0, state.ringLeft - 1)
    if (nextRing > 0) {
      return { ...state, timeLeft: 0, ringLeft: nextRing }
    } else {
      const { phase, timeLeft } = nextPhaseAndTime(cfg, state.phase)
      return { ...state, phase, timeLeft, isRinging: false, ringLeft: 0 }
    }
  }

  // Countdown normale
  if (state.timeLeft > 0) {
    return { ...state, timeLeft: state.timeLeft - 1 }
  }

  // arrivo a 0, avvio ring & hold
  const hold = Math.max(1, cfg.ringHoldSec ?? 1)
  return { ...state, isRinging: true, ringLeft: hold, timeLeft: 0 }
}

// 4. Reset
export function reset(
  _state: PomodoroState,
  cfg: PomodoroConfig,
): PomodoroState {
  return initialState(cfg)
}
