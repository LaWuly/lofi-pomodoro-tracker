import { usePomodoro } from './app/hooks/usePomodoro'

export default function App() {
  const { state, config, setState, setConfig } = usePomodoro({
    sessionLength: 25,
    breakLength: 5,
  })

  return (
    <main>
      <h1>Test</h1>

      <p>Phase: {state.phase}</p>
      <p>Time: {state.timeLeft}</p>
      <p>Running: {String(state.isRunning)}</p>

      <div>
        <button onClick={() => setState((s) => ({ ...s, isRunning: true }))}>
          Start
        </button>
        <button onClick={() => setState((s) => ({ ...s, isRunning: false }))}>
          Pausa
        </button>
        <button
          onClick={() =>
            setState((s) => ({
              ...s,
              isRunning: false,
              timeLeft: 25 * 60,
              phase: 'Session',
            }))
          }
        >
          Reset
        </button>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button
          onClick={() =>
            setConfig((c) => ({
              ...c,
              sessionLength: Math.min(60, c.sessionLength + 1),
            }))
          }
        >
          + Session
        </button>
        <button
          onClick={() =>
            setConfig((c) => ({
              ...c,
              sessionLength: Math.max(1, c.sessionLength - 1),
            }))
          }
        >
          - Session
        </button>
        <button
          onClick={() =>
            setConfig((c) => ({
              ...c,
              breakLength: Math.min(60, c.breakLength + 1),
            }))
          }
        >
          + Break
        </button>
        <button
          onClick={() =>
            setConfig((c) => ({
              ...c,
              breakLength: Math.max(1, c.breakLength - 1),
            }))
          }
        >
          - Break
        </button>
      </div>
    </main>
  )
}
