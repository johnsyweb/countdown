import type { Operator } from './solve';

const operatorToSymbol: Record<Operator, string> = {
  '+': '+',
  '-': '−', // Unicode minus
  '*': '×', // Multiplication sign
  '/': '÷', // Division sign
};

export function formatOperator(operator: Operator): string {
  return operatorToSymbol[operator] ?? operator;
}


