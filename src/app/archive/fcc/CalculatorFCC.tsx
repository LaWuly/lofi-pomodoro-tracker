import { useCalculator } from '@app/hooks/useCalculator'
import styles from './CalculatorFCC.module.css'

export default function CalculatorFCC() {
  const { state, onDigit, onDecimal, onClear, onOp, onEquals, onKeyDown } =
    useCalculator()

  return (
    <section
      aria-label="Calcolatrice FCC"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={styles.wrapper}
    >
      <div className={styles.card}>
        <div className={styles.formula}>{state.opLine}</div>

        <div id="display" aria-live="polite" className={styles.display}>
          {state.display}
        </div>

        <div className={styles.keys}>
          <button
            id="clear"
            className={`${styles.btn} ${styles.clr}`}
            onClick={onClear}
            aria-label="Clear"
          >
            AC
          </button>
          <button
            id="divide"
            className={`${styles.btn} ${styles.op}`}
            onClick={() => onOp('/')}
            aria-label="Divide"
          >
            /
          </button>
          <button
            id="multiply"
            className={`${styles.btn} ${styles.op}`}
            onClick={() => onOp('x')}
            aria-label="Multiply"
          >
            x
          </button>
          <button
            id="subtract"
            className={`${styles.btn} ${styles.op}`}
            onClick={() => onOp('-')}
            aria-label="Subtract"
          >
            -
          </button>

          <button
            id="seven"
            className={styles.btn}
            onClick={() => onDigit('7')}
          >
            7
          </button>
          <button
            id="eight"
            className={styles.btn}
            onClick={() => onDigit('8')}
          >
            8
          </button>
          <button id="nine" className={styles.btn} onClick={() => onDigit('9')}>
            9
          </button>
          <button
            id="add"
            className={`${styles.btn} ${styles.op}`}
            onClick={() => onOp('+')}
            aria-label="Add"
          >
            +
          </button>

          <button id="four" className={styles.btn} onClick={() => onDigit('4')}>
            4
          </button>
          <button id="five" className={styles.btn} onClick={() => onDigit('5')}>
            5
          </button>
          <button id="six" className={styles.btn} onClick={() => onDigit('6')}>
            6
          </button>
          <button
            id="equals"
            className={`${styles.btn} ${styles.eq}`}
            onClick={onEquals}
            aria-label="Equals"
          >
            =
          </button>

          <button id="one" className={styles.btn} onClick={() => onDigit('1')}>
            1
          </button>
          <button id="two" className={styles.btn} onClick={() => onDigit('2')}>
            2
          </button>
          <button
            id="three"
            className={styles.btn}
            onClick={() => onDigit('3')}
          >
            3
          </button>
          <button
            id="decimal"
            className={styles.btn}
            onClick={onDecimal}
            aria-label="Decimal"
          >
            .
          </button>

          <button
            id="zero"
            className={`${styles.btn} ${styles.zero}`}
            onClick={() => onDigit('0')}
          >
            0
          </button>
          <div className={styles.filler} />
          <div className={styles.filler} />
        </div>
      </div>
    </section>
  )
}
