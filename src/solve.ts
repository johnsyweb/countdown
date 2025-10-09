type Operator = '+' | '-' | '*' | '/';
type Step = [number, Operator, number, number];

export function solve(numbers: number[], target: number): Step[] | null {
  const [smaller, larger] = numbers.sort((a, b) => a - b);
  if (smaller + larger === target) {
    return [[smaller, '+', larger, target]];
  } else if (smaller * larger === target) {
    return [[smaller, '*', larger, target]];
  } else if (larger - smaller === target) {
    return [[larger, '-', smaller, target]];
  } else if (larger / smaller === target) {
    return [[larger, '/', smaller, target]];
  }
  return null;
}
