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

function getRemainingNumbers(
  numbers: number[],
  i: number,
  j: number
): number[] {
  return numbers.filter((_, idx) => idx !== i && idx !== j);
}

function findSolutionsForStep(
  step: Step,
  target: number,
  numbers: number[],
  i: number,
  j: number
): Step[][] {
  if (step.result === target) {
    return [[step]];
  }

  if (numbers.length <= 2) {
    return [];
  }

  const remainingNumbers = getRemainingNumbers(numbers, i, j);
  const newPool = [...remainingNumbers, step.result];
  const subSolutions = solve(newPool, target);

  if (!subSolutions) {
    return [];
  }

  return subSolutions.map((subSolution) => [step, ...subSolution]);
}

function findSolutionsForPair(
  numbers: number[],
  target: number,
  i: number,
  j: number
): Step[][] {
  const [smaller, larger] = [numbers[i], numbers[j]].sort((a, b) => a - b);
  const steps = combine(smaller, larger);
  const solutions: Step[][] = [];

  for (const step of steps) {
    const stepSolutions = findSolutionsForStep(step, target, numbers, i, j);
    solutions.push(...stepSolutions);
  }

  return solutions;
}

export function solve(numbers: number[], target: number): Step[][] | null {
  if (numbers.length < 2) {
    return null;
  }

  const solutions: Step[][] = [];

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const pairSolutions = findSolutionsForPair(numbers, target, i, j);
      solutions.push(...pairSolutions);
    }
  }

  return solutions.length > 0 ? solutions : null;
}
