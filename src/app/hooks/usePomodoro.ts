import { useState } from 'react'
import type { PomodoroConfig, PomodoroState } from '../../domain/timer/types'
import { initialState } from '../../domain/timer/TimerEngine'

export function usePomodoro(initial: PomodoroConfig) {
  const [config, setConfig] = useState<PomodoroConfig>(initial)
  const [state, setState] = useState<PomodoroState>(() => initialState(initial))
  return { state, config, setState, setConfig }
}
