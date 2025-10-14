// Motore di calcolo L2R (left-to-right)

import type { Op } from './types'

export function applyOp(acc: number, op: Op, rhs: number): number {
  switch (op) {
    case '+':
      return acc + rhs
    case '-':
      return acc - rhs
    case 'x':
      return acc * rhs
    case '/':
      return rhs === 0 ? NaN : acc / rhs
  }
}

export function evalL2R(tokens: (string | Op)[]): number {
  let acc = Number(tokens[0] ?? '0')
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i] as Op
    const rhs = Number(tokens[i + 1] ?? '0')
    acc = applyOp(acc, op, rhs)
  }
  return acc
}
