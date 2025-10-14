import { useCalculator } from '@app/hooks/useCalculator'

export default function CalculatorFCC() {
  const { state, onDigit, onDecimal, onClear } = useCalculator()

  return (
    <section aria-label="Calcolatrice FCC">
      <div>{state.opLine}</div>
      <div id="display">{state.display}</div>

      <div className="grid">
        <button id="clear" onClick={onClear}>
          AC
        </button>
        <button id="divide">/</button>
        <button id="multiply">x</button>
        <button id="subtract">-</button>

        <button id="seven" onClick={() => onDigit('7')}>
          7
        </button>
        <button id="eight" onClick={() => onDigit('8')}>
          8
        </button>
        <button id="nine" onClick={() => onDigit('9')}>
          9
        </button>
        <button id="add">+</button>

        <button id="four" onClick={() => onDigit('4')}>
          4
        </button>
        <button id="five" onClick={() => onDigit('5')}>
          5
        </button>
        <button id="six" onClick={() => onDigit('6')}>
          6
        </button>
        <button id="equals">=</button>

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

        <button id="zero" onClick={() => onDigit('0')}>
          0
        </button>
      </div>
    </section>
  )
}
