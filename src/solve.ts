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

  // Only keep sub-solutions that actually use the produced subtotal somewhere later
  const usesProduced = (solution: Step[]): boolean =>
    solution.some((s) => s.left === step.result || s.right === step.result);

  const filtered = subSolutions.filter(usesProduced);

  return filtered.map((subSolution) => [step, ...subSolution]);
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

function normalizeSolution(solution: Step[]): Step[] {
  return [...solution].sort((a, b) => {
    // Sort by left, then operator, then right
    if (a.left !== b.left) return a.left - b.left;
    if (a.operator !== b.operator) return a.operator.localeCompare(b.operator);
    if (a.right !== b.right) return a.right - b.right;
    return a.result - b.result;
  });
}

function deduplicateSolutions(solutions: Step[][]): Step[][] {
  const seen = new Set<string>();
  return solutions.filter((solution) => {
    const normalizedSolution = normalizeSolution(solution);
    const key = JSON.stringify(normalizedSolution);
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
