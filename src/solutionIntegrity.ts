import type { Step } from './solve';

export function hasUnusedIntermediateSubtotal(solution: Step[]): boolean {
  if (solution.length <= 1) return false;

  for (let i = 0; i < solution.length - 1; i++) {
    const produced = solution[i].result;
    const consumedLater = solution.slice(i + 1).some((later) => {
      return later.left === produced || later.right === produced;
    });
    if (!consumedLater) return true;
  }

  return false;
}

export function allIntermediateSubtotalsUsed(solution: Step[]): boolean {
  return !hasUnusedIntermediateSubtotal(solution);
}
