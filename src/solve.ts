export type Operator = '+' | '-' | '*' | '/';
export type Step = {
  left: number;
  operator: Operator;
  right: number;
  result: number;
};

function combine(smaller: number, larger: number): Step[] {
  return [
    {
      left: smaller,
      operator: '+' as const,
      right: larger,
      result: smaller + larger,
    },
    {
      left: smaller,
      operator: '*' as const,
      right: larger,
      result: smaller * larger,
    },
    {
      left: larger,
      operator: '-' as const,
      right: smaller,
      result: larger === smaller ? NaN : larger - smaller,
    },
    {
      left: larger,
      operator: '/' as const,
      right: smaller,
      result: larger % smaller === 0 ? larger / smaller : NaN,
    },
  ].filter((step) => !isNaN(step.result));
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

  return steps.flatMap((step) =>
    findSolutionsForStep(step, target, numbers, i, j)
  );
}

function getAllPairs(length: number): Array<[number, number]> {
  return Array.from({ length }, (_, i) => i).flatMap((i) =>
    Array.from(
      { length: length - i - 1 },
      (_, k) => [i, i + k + 1] as [number, number]
    )
  );
}

function deduplicateSolutions(solutions: Step[][]): Step[][] {
  const seen = new Set<string>();
  return solutions.filter((solution) => {
    const key = JSON.stringify(solution);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function solve(numbers: number[], target: number): Step[][] | null {
  if (numbers.length < 2) {
    return null;
  }

  const allSolutions = getAllPairs(numbers.length).flatMap(([i, j]) =>
    findSolutionsForPair(numbers, target, i, j)
  );

  const solutions = deduplicateSolutions(allSolutions);

  return solutions.length > 0 ? solutions : null;
}
