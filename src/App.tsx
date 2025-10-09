import { usePomodoro } from './app/hooks/usePomodoro'

export default function App() {
  const { state, config, actions } = usePomodoro({
    sessionLength: 25,
    breakLength: 5,
  })

  return (
    <main>
      <h1>Test</h1>

      <p>Phase: {state.phase}</p>
      <p>Time: {state.timeLeft}</p>
      <p>Running: {String(state.isRunning)}</p>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        {state.isRunning ? (
          <button onClick={actions.pause}>Pausa</button>
        ) : (
          <button onClick={actions.start}>Start</button>
        )}

        <button onClick={actions.reset}>Reset</button>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={actions.incSession} disabled={state.isRunning}>
          + Session
        </button>
        <button onClick={actions.decSession} disabled={state.isRunning}>
          - Session
        </button>
        <button onClick={actions.incBreak} disabled={state.isRunning}>
          + Break
        </button>
        <button onClick={actions.decBreak} disabled={state.isRunning}>
          - Break
        </button>
      </div>
    </main>
  )
}
