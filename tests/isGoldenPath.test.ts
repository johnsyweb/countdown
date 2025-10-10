import { describe, it, expect } from 'vitest';
import { isGoldenPath } from '../src/isGoldenPath';
import type { Step } from '../src/solve';

describe('isGoldenPath', () => {
  it('returns false for empty solution', () => {
    expect(isGoldenPath([])).toBe(false);
  });

  it('returns true for single step solution', () => {
    const solution: Step[] = [{ left: 2, operator: '+', right: 3, result: 5 }];
    expect(isGoldenPath(solution)).toBe(true);
  });

  it('returns true when each result is used on left of next step', () => {
    const solution: Step[] = [
      { left: 1, operator: '+', right: 2, result: 3 },
      { left: 3, operator: '*', right: 4, result: 12 },
    ];
    expect(isGoldenPath(solution)).toBe(true);
  });

  it('returns false when result is not used in next step', () => {
    const solution: Step[] = [
      { left: 1, operator: '+', right: 2, result: 3 },
      { left: 4, operator: '*', right: 5, result: 20 },
    ];
    expect(isGoldenPath(solution)).toBe(false);
  });

  it('returns true for commutative operators when result is on right', () => {
    const solution: Step[] = [
      { left: 1, operator: '+', right: 2, result: 3 },
      { left: 4, operator: '+', right: 3, result: 7 }, // 3 is on right but addition is commutative
    ];
    expect(isGoldenPath(solution)).toBe(true);
  });

  it('returns true for multiplication when result is on right', () => {
    const solution: Step[] = [
      { left: 2, operator: '*', right: 3, result: 6 },
      { left: 4, operator: '*', right: 6, result: 24 }, // 6 is on right but multiplication is commutative
    ];
    expect(isGoldenPath(solution)).toBe(true);
  });

  it('returns false for subtraction when result is on right', () => {
    const solution: Step[] = [
      { left: 5, operator: '-', right: 2, result: 3 },
      { left: 10, operator: '-', right: 3, result: 7 }, // 3 on right but subtraction is not commutative
    ];
    expect(isGoldenPath(solution)).toBe(false);
  });

  it('returns false for division when result is on right', () => {
    const solution: Step[] = [
      { left: 6, operator: '/', right: 2, result: 3 },
      { left: 9, operator: '/', right: 3, result: 3 }, // 3 on right but division is not commutative
    ];
    expect(isGoldenPath(solution)).toBe(false);
  });

  it('handles complex golden path', () => {
    const solution: Step[] = [
      { left: 6, operator: '*', right: 8, result: 48 },
      { left: 3, operator: '+', right: 48, result: 51 }, // 48 on right, addition is commutative
      { left: 5, operator: '*', right: 51, result: 255 }, // 51 on right, multiplication is commutative
      { left: 100, operator: '+', right: 255, result: 355 }, // 255 on right, addition is commutative
    ];
    expect(isGoldenPath(solution)).toBe(true);
  });
});
