// Adapter FCC: rende la UI con gli id richiesti dai test

import { useCalculator } from '@app/hooks/useCalculator'

export default function CalculatorFCC() {
  const { state, onDigit, onDecimal, onClear, onOp, onEquals } = useCalculator()

  return (
    <section
      aria-label="Calcolatrice FCC"
      style={{ display: 'grid', gap: 12, maxWidth: 320, margin: '0 auto' }}
    >
      {/* Formula corrente */}
      <div style={{ textAlign: 'right', opacity: 0.7, minHeight: 20 }}>
        {state.opLine}
      </div>

      {/* Display FCC */}
      <div
        id="display"
        aria-live="polite"
        style={{
          border: '1px solid #444',
          borderRadius: 8,
          padding: 12,
          textAlign: 'right',
          fontSize: '1.8rem',
        }}
      >
        {state.display}
      </div>

      {/* griglia pulsanti */}
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}
      >
        <button id="clear" onClick={onClear}>
          AC
        </button>
        <button id="divide" onClick={() => onOp('/')}>
          /
        </button>
        <button id="multiply" onClick={() => onOp('x')}>
          x
        </button>
        <button id="subtract" onClick={() => onOp('-')}>
          -
        </button>

        <button id="seven" onClick={() => onDigit('7')}>
          7
        </button>
        <button id="eight" onClick={() => onDigit('8')}>
          8
        </button>
        <button id="nine" onClick={() => onDigit('9')}>
          9
        </button>
        <button id="add" onClick={() => onOp('+')}>
          +
        </button>

        <button id="four" onClick={() => onDigit('4')}>
          4
        </button>
        <button id="five" onClick={() => onDigit('5')}>
          5
        </button>
        <button id="six" onClick={() => onDigit('6')}>
          6
        </button>
        <button id="equals" onClick={onEquals}>
          =
        </button>

        <button id="one" onClick={() => onDigit('1')}>
          1
        </button>
        <button id="two" onClick={() => onDigit('2')}>
          2
        </button>
        <button id="three" onClick={() => onDigit('3')}>
          3
        </button>
        <button id="decimal" onClick={onDecimal}>
          .
        </button>

        <button
          id="zero"
          onClick={() => onDigit('0')}
          style={{ gridColumn: 'span 2' }}
        >
          0
        </button>
        <div style={{ visibility: 'hidden' }} />
        <div style={{ visibility: 'hidden' }} />
      </div>
    </section>
  )
}
