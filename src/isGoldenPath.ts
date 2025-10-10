import type { Step } from './solve';

function isCommutative(operator: Step['operator']): boolean {
  return operator === '+' || operator === '*';
}

function usesPreviousResult(
  currentStep: Step,
  previousResult: number
): boolean {
  if (currentStep.left === previousResult) {
    return true;
  }
  return (
    isCommutative(currentStep.operator) && currentStep.right === previousResult
  );
}

export function isGoldenPath(solution: Step[]): boolean {
  if (solution.length <= 1) {
    return solution.length === 1;
  }

  return solution
    .slice(1)
    .every((step, index) => usesPreviousResult(step, solution[index].result));
}
