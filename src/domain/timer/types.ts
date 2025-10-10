// Phase: le due fasi del pomodoro.
export type Phase = 'Session' | 'Break'

// PomodoroConfig: configurazione utente (in minuti).
export interface PomodoroConfig {
  sessionLength: number
  breakLength: number
  ringHoldSec?: number
}

// PomodoroState: lo stato vivo del timer.

export interface PomodoroState {
  phase: Phase
  timeLeft: number
  isRunning: boolean
  isRinging: boolean
  ringLeft: number
}

export const minutesToSeconds = (m: number) => Math.max(0, Math.floor(m)) * 60
