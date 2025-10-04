// Phase: le due fasi del pomodoro.
export type Phase = 'Session' | 'Break'

// PomodoroConfig: configurazione utente (in minuti).
export interface PomodoroConfig {
  sessionLength: number
  breakLength: number
}

// PomodoroState: lo stato vivo del timer.

export interface PomodoroState {
  phase: Phase
  timeLeft: number
  isRunning: boolean
}

export const minutesToSeconds = (m: number) => m * 60
