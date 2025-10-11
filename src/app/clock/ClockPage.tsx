import { TimerFCC } from '@app/adapters/fcc/TimerFCC'

export function ClockPage() {
  return (
    <section
      aria-labelledby="clock-title"
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2 id="clock-title" style={{ margin: '0 0 16px' }}>
          25+5 Clock
        </h2>
        <TimerFCC />
      </div>
    </section>
  )
}
