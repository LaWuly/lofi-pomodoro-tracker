type Props = {
  value: number // 1..5
  onChange: (mood: number) => void
  id?: string
}

const faces = ['😞', '🙁', '😐', '🙂', '😄'] // 1..5

export default function MoodSelector({ value, onChange, id }: Props) {
  return (
    <div role="group" aria-labelledby={id}>
      <div id={id} className="sr-only">
        Selettore umore (1 scarso → 5 ottimo)
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {faces.map((emoji, i) => {
          const mood = i + 1
          const selected = mood === value
          return (
            <button
              key={mood}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(mood)}
              style={{
                padding: '8px 10px',
                borderRadius: 10,
                border: selected
                  ? '2px solid var(--accent, #646cff)'
                  : '1px solid #ccc',
                background: selected ? 'rgba(100,108,255,.08)' : 'transparent',
                fontSize: 18,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              <span aria-label={`Umore ${mood}`}>{emoji}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
