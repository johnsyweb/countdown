import { describe, it, expect } from 'vitest';
import { solve } from '../src/solve';
import { hasUnusedIntermediateSubtotal } from '../src/solutionIntegrity';

describe('solve', () => {
  it('returns null when no solution exists', () => {
    const result = solve([1, 2], 4);
    expect(result).toBeNull();
  });

  it('returns the correct solution when two inputs can be added to make the target', () => {
    const result = solve([1, 2], 3);
    expect(result).toEqual([[{ left: 1, operator: '+', right: 2, result: 3 }]]);
  });

  it('returns the correct solution when two inputs can be multiplied to make the target', () => {
    const result = solve([2, 3], 6);
    expect(result).toEqual([[{ left: 2, operator: '*', right: 3, result: 6 }]]);
  });

  it('returns the correct solution when two inputs can be subtracted to make the target', () => {
    const result = solve([2, 3], 1);
    expect(result).toEqual([[{ left: 3, operator: '-', right: 2, result: 1 }]]);
  });

  it('returns the correct solution when two inputs can be divided to make the target', () => {
    const result = solve([2, 6], 3);
    expect(result).toEqual([[{ left: 6, operator: '/', right: 2, result: 3 }]]);
  });

  it('does not round down when dividing to make the target', () => {
    const result = solve([2, 7], 3);
    expect(result).toBeNull();
  });

  it('does not allow division with non-integer results', () => {
    const result = solve([6, 10], 1);
    expect(result).toBeNull();
  });

  it('does not allow subtraction that results in zero', () => {
    const result = solve([5, 5], 0);
    expect(result).toBeNull();
  });

  it('does not allow subtraction that results in negative numbers', () => {
    const result = solve([2, 5], -3);
    expect(result).toBeNull();
  });

  it('may have multiple solutions', () => {
    const result = solve([2, 2], 4);
    expect(result).toEqual([
      [{ left: 2, operator: '+', right: 2, result: 4 }],
      [{ left: 2, operator: '*', right: 2, result: 4 }],
    ]);
  });

  it('solves problems requiring multiple steps', () => {
    const result = solve([1, 2, 4], 12);
    expect(result).toEqual([
      [
        { left: 1, operator: '+', right: 2, result: 3 },
        { left: 3, operator: '*', right: 4, result: 12 },
      ],
    ]);
  });

  it('solves complex problems with many numbers', () => {
    const result = solve([3, 3, 5, 6, 8, 100], 355);
    expect(result).toContainEqual([
      { left: 6, operator: '*', right: 8, result: 48 },
      { left: 3, operator: '+', right: 48, result: 51 },
      { left: 5, operator: '*', right: 51, result: 255 },
      { left: 100, operator: '+', right: 255, result: 355 },
    ]);
  });

  it('filters out duplicate solutions when input has duplicate numbers', () => {
    const result = solve([2, 2, 3], 5);
    expect(result).toEqual([[{ left: 2, operator: '+', right: 3, result: 5 }]]);
  });

  it('treats solutions as equal if they have the same steps in any order', () => {
    const result = solve([2, 3, 5, 7], 17);
    // The solver explores different orderings of pairs which could lead to
    // the same solution steps in different orders. For example:
    // Path 1: (2+7=9), (3+5=8), (8+9=17)
    // Path 2: (3+5=8), (2+7=9), (8+9=17) - same steps, different order
    // These should be deduplicated to count as one solution
    expect(result).toBeDefined();

    // Find if there's a solution with the independent steps: 2+7=9 and 3+5=8
    const solutionWithIndependentSteps = result?.find(
      (sol) =>
        sol.some(
          (step) =>
            step.left === 2 &&
            step.operator === '+' &&
            step.right === 7 &&
            step.result === 9
        ) &&
        sol.some(
          (step) =>
            step.left === 3 &&
            step.operator === '+' &&
            step.right === 5 &&
            step.result === 8
        ) &&
        sol.some(
          (step) =>
            step.left === 8 &&
            step.operator === '+' &&
            step.right === 9 &&
            step.result === 17
        )
    );
    expect(solutionWithIndependentSteps).toBeDefined();

    // Count how many solutions have these exact same three steps
    const duplicates = result?.filter(
      (sol) =>
        sol.length === 3 &&
        sol.some(
          (step) =>
            step.left === 2 &&
            step.operator === '+' &&
            step.right === 7 &&
            step.result === 9
        ) &&
        sol.some(
          (step) =>
            step.left === 3 &&
            step.operator === '+' &&
            step.right === 5 &&
            step.result === 8
        ) &&
        sol.some(
          (step) =>
            step.left === 8 &&
            step.operator === '+' &&
            step.right === 9 &&
            step.result === 17
        )
    );
    // Should only have one solution with these steps, regardless of order
    expect(duplicates).toHaveLength(1);
  });

  it('does not include unused intermediate subtotals in any solution', () => {
    const result = solve([3, 5, 7, 10], 12);
    expect(result).toBeTruthy();

    // A solution is invalid if any non-final step's result is never used
    // by any later step (either side, any operator).

    const offending = result!.filter(hasUnusedIntermediateSubtotal);
    // Expect no solutions to contain an unused intermediate subtotal
    expect(offending).toHaveLength(0);
  });
});
