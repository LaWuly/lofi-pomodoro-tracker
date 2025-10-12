import { useState } from 'react'

export default function CalculatorFCC() {
  const [expr, setExpr] = useState('0')

  // 2) Handler per i numeri (0..9)
  const onDigit = (d: string) => {
    setExpr((prev) => {
      if (prev === '0') return d
      return prev + d
    })
  }

  return (
    <section aria-label="Calcolatrice FCC">
      <div id="display">{expr}</div>

      <div className="grid">
        <button id="clear">AC</button>
        <button id="divide">÷</button>
        <button id="multiply">×</button>
        <button id="subtract">−</button>
        <button id="add">+</button>
        <button id="equals">=</button>
        <button id="decimal">.</button>

        <button id="seven" onClick={() => onDigit('7')}>
          7
        </button>
        <button id="eight" onClick={() => onDigit('8')}>
          8
        </button>
        <button id="nine" onClick={() => onDigit('9')}>
          9
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

        <button id="one" onClick={() => onDigit('1')}>
          1
        </button>
        <button id="two" onClick={() => onDigit('2')}>
          2
        </button>
        <button id="three" onClick={() => onDigit('3')}>
          3
        </button>

        <button id="zero" onClick={() => onDigit('0')}>
          0
        </button>
      </div>
    </section>
  )
}
