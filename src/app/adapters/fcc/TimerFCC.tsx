import { useState } from 'react'
import { usePomodoro } from '@app/hooks/usePomodoro'

const clamp = (v: number) => Math.min(60, Math.max(1, v))
const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export function TimerFCC() {
  const [cfg, setCfg] = useState({
    sessionLength: 25,
    breakLength: 5,
    ringHoldSec: 1,
  })

  const { state, toggleRun, reset, audioRef } = usePomodoro(cfg)

  // Azioni FCC ± (disabilitate durante il run)
  const incBreak = () =>
    setCfg((c) => ({ ...c, breakLength: clamp(c.breakLength + 1) }))
  const decBreak = () =>
    setCfg((c) => ({ ...c, breakLength: clamp(c.breakLength - 1) }))
  const incSession = () =>
    setCfg((c) => ({ ...c, sessionLength: clamp(c.sessionLength + 1) }))
  const decSession = () =>
    setCfg((c) => ({ ...c, sessionLength: clamp(c.sessionLength - 1) }))
  const onReset = () => {
    setCfg({ sessionLength: 25, breakLength: 5, ringHoldSec: 1 })
    reset()
  }

  return (
    <div>
      {/* Break controls */}
      <section>
        <h3 id="break-label">Break Length</h3>
        <button
          id="break-decrement"
          onClick={decBreak}
          disabled={state.isRunning}
        >
          −
        </button>
        <span id="break-length">{cfg.breakLength}</span>
        <button
          id="break-increment"
          onClick={incBreak}
          disabled={state.isRunning}
        >
          +
        </button>
      </section>

      {/* Session controls */}
      <section>
        <h3 id="session-label">Session Length</h3>
        <button
          id="session-decrement"
          onClick={decSession}
          disabled={state.isRunning}
        >
          −
        </button>
        <span id="session-length">{cfg.sessionLength}</span>
        <button
          id="session-increment"
          onClick={incSession}
          disabled={state.isRunning}
        >
          +
        </button>
      </section>

      {/* Timer display & transport */}
      <section>
        <h2 id="timer-label">{state.phase}</h2>
        <div id="time-left">{fmt(state.timeLeft)}</div>

        <button id="start_stop" onClick={toggleRun}>
          {state.isRunning ? 'Pause' : 'Start'}
        </button>
        <button id="reset" onClick={onReset}>
          Reset
        </button>

        {/* Audio FCC */}
        <audio id="beep" ref={audioRef} src="/sounds/beep.mp3" preload="auto" />
      </section>
    </div>
  )
}
