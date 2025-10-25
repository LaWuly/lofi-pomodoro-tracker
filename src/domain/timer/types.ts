// Phase
export type Phase = 'Session' | 'ShortBreak' | 'LongBreak'

// PomodoroConfig
export interface PomodoroConfig {
  sessionLength: number
  shortBreakLength: number
  longBreakLength: number
  longBreakInterval: number
  ringHoldSec?: number
}

// PomodoroState
export interface PomodoroState {
  phase: Phase
  timeLeft: number
  isRunning: boolean
  isRinging: boolean
  ringLeft: number
  completedWork: number
}

// Utility
export const minutesToSeconds = (m: number) => Math.max(0, Math.floor(m)) * 60

export function formatTime(sec: number, showHours = false): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60

  if (showHours || h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(
      s,
    ).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
