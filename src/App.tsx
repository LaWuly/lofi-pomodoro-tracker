// src/App.tsx
import { TimerFCC } from '@app/adapters/fcc/TimerFCC'

export default function App() {
  return (
    <main
      style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '1rem' }}
    >
      <h1>25 + 5 Pomodoro Timer</h1>
      <TimerFCC />
    </main>
  )
}
