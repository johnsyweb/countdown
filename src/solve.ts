type Operator = '+' | '-' | '*' | '/';
type Step = { left: number; operator: Operator; right: number; result: number };

function combine(smaller: number, larger: number): Step[] {
  return [
    { left: smaller, operator: '+', right: larger, result: smaller + larger },
    { left: smaller, operator: '*', right: larger, result: smaller * larger },
    { left: larger, operator: '-', right: smaller, result: larger - smaller },
    { left: larger, operator: '/', right: smaller, result: larger / smaller },
  ];
}

export function solve(numbers: number[], target: number): Step[][] | null {
  if (numbers.length < 2) {
    return null;
  }
  const sortedNumbers = numbers.sort((a, b) => a - b);
  const smaller = sortedNumbers.shift();
  const larger = sortedNumbers.shift();
  if (sortedNumbers.length === 0) {
    const steps = combine(smaller!, larger!);
    const found = steps.filter(({ result }) => result === target);
    return found.length > 0 ? found.map((step) => [step]) : null;
  }
  return null;
}
