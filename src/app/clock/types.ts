// src/app/clock/types.ts
import type { PomodoroConfig, Phase } from '@domain/timer/types'

// UI Models area Clock

export interface Task {
  id: string
  title: string
  completed: boolean
  pomodorosCompleted: number
  pomodorosEstimated: number
  projectId: string | null
  createdAt: number
}

export interface Project {
  id: string
  name: string
  color: string
  createdAt: number
}

// Per il LOG delle sessioni (UI/journal)
export type SessionType = 'work' | 'shortBreak' | 'longBreak'

export interface PomodoroSession {
  id: string
  type: SessionType // 'work'|'shortBreak'|'longBreak'
  duration: number // minuti
  completedAt: number // epoch ms
  taskId: string | null
  projectId: string | null
}

export interface AppSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundVolume: number
  tickingSoundEnabled: boolean
  notificationsEnabled: boolean
  spotifyUrl?: string
  spotifyEnabled?: boolean
  showHours?: boolean
  ringHoldSec?: number
}

export const defaultSettings: AppSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundVolume: 50,
  tickingSoundEnabled: false,
  notificationsEnabled: true,
  spotifyEnabled: false,
  showHours: false,
}

// ======== Adapter tra UI <-> Dominio ======================================

// Converte le AppSettings (minuti) nella PomodoroConfig del dominio
export function toPomodoroConfig(s: AppSettings): PomodoroConfig {
  return {
    sessionLength: s.workDuration,
    shortBreakLength: s.shortBreakDuration,
    longBreakLength: s.longBreakDuration,
    longBreakInterval: s.longBreakInterval,
    ringHoldSec: s.ringHoldSec,
  }
}

// Mappa Phase (dominio) -> SessionType (log UI)
export function phaseToSessionType(phase: Phase): SessionType {
  switch (phase) {
    case 'Session':
      return 'work'
    case 'ShortBreak':
      return 'shortBreak'
    case 'LongBreak':
      return 'longBreak'
  }
}

// Utility: minuti stimati/consumati da sec
export const secondsToMinutes = (sec: number) =>
  Math.max(0, Math.floor(sec / 60))
