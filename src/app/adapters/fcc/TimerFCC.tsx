import { useState, useEffect, useMemo } from 'react'
import { usePomodoro } from '@app/hooks/usePomodoro'
import styles from './TimerFCC.module.css'

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

  // Hotkeys minime
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        toggleRun()
      }
      if (e.key.toLowerCase() === 'r') onReset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleRun])

  // Classe fase per colorare la card
  const phaseClass = state.phase === 'Session' ? styles.session : styles.break

  // Memo per il tempo formattato
  const timeText = useMemo(() => fmt(state.timeLeft), [state.timeLeft])

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.card} ${phaseClass}`}
        data-phase={state.phase}
        aria-live="polite"
      >
        <div className={styles.header}>
          <div className={styles.title}>Lofi Pomodoro — 25+5</div>
          <div aria-hidden="true" className={styles.kbd}>
            Space = Start/Stop · R = Reset
          </div>
        </div>

        <div className={styles.grid}>
          {/* Break */}
          <section className={styles.panel} aria-labelledby="break-label">
            <h3 id="break-label" className={styles.label}>
              Break Length
            </h3>
            <div className={styles.row}>
              <button
                id="break-decrement"
                className={styles.btn}
                onClick={decBreak}
                disabled={state.isRunning}
                aria-label="Decrease break"
              >
                −
              </button>
              <span
                id="break-length"
                className={styles.value}
                aria-live="polite"
              >
                {cfg.breakLength}
              </span>
              <button
                id="break-increment"
                className={styles.btn}
                onClick={incBreak}
                disabled={state.isRunning}
                aria-label="Increase break"
              >
                +
              </button>
            </div>
          </section>

          {/* Session */}
          <section className={styles.panel} aria-labelledby="session-label">
            <h3 id="session-label" className={styles.label}>
              Session Length
            </h3>
            <div className={styles.row}>
              <button
                id="session-decrement"
                className={styles.btn}
                onClick={decSession}
                disabled={state.isRunning}
                aria-label="Decrease session"
              >
                −
              </button>
              <span
                id="session-length"
                className={styles.value}
                aria-live="polite"
              >
                {cfg.sessionLength}
              </span>
              <button
                id="session-increment"
                className={styles.btn}
                onClick={incSession}
                disabled={state.isRunning}
                aria-label="Increase session"
              >
                +
              </button>
            </div>
          </section>
        </div>

        {/* Timer */}
        <section className={styles.timer}>
          <h2 id="timer-label">{state.phase}</h2>
          <div id="time-left" className={styles.time} aria-live="polite">
            {timeText}
          </div>
          <div className={styles.controls}>
            <button
              id="start_stop"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={toggleRun}
            >
              {state.isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              id="reset"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={onReset}
            >
              Reset
            </button>
          </div>
          <audio
            id="beep"
            ref={audioRef}
            src="/sounds/beep.mp3"
            preload="auto"
          />
        </section>
      </div>
    </div>
  )
}
