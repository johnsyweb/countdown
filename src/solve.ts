export function solve(numbers: number[], target: number): unknown {
  const [smaller, larger] = numbers.sort((a, b) => a - b);
  if (smaller + larger === target) {
    return [[smaller, '+', larger, target]];
  } else if (smaller * larger === target) {
    return [[smaller, '*', larger, target]];
  }
  return null;
}
