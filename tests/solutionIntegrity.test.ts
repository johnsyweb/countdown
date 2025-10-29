import { describe, it, expect } from 'vitest';
import {
  hasUnusedIntermediateSubtotal,
  allIntermediateSubtotalsUsed,
} from '../src/solutionIntegrity';
import type { Step } from '../src/solve';

describe('solutionIntegrity', () => {
  it('detects unused intermediate subtotal in a single solution', () => {
    // Unused subtotal: 3+5=8 is never used later
    const badSolution: Step[] = [
      { left: 3, operator: '+', right: 5, result: 8 },
      { left: 7, operator: '+', right: 10, result: 17 },
      { left: 17, operator: '-', right: 5, result: 12 },
    ];

    expect(hasUnusedIntermediateSubtotal(badSolution)).toBe(true);
    expect(allIntermediateSubtotalsUsed(badSolution)).toBe(false);
  });

  it('approves solutions where every subtotal is used later', () => {
    const goodSolution: Step[] = [
      { left: 1, operator: '+', right: 2, result: 3 },
      { left: 3, operator: '*', right: 4, result: 12 },
    ];

    expect(hasUnusedIntermediateSubtotal(goodSolution)).toBe(false);
    expect(allIntermediateSubtotalsUsed(goodSolution)).toBe(true);
  });

  it('treats a single-step solution as having no unused subtotal', () => {
    const single: Step[] = [{ left: 2, operator: '+', right: 3, result: 5 }];
    expect(hasUnusedIntermediateSubtotal(single)).toBe(false);
    expect(allIntermediateSubtotalsUsed(single)).toBe(true);
  });

  it('counts usage when subtotal appears on the right of subtraction', () => {
    // 3+5=8 is later used as the right operand in 10-8
    const solution: Step[] = [
      { left: 3, operator: '+', right: 5, result: 8 },
      { left: 10, operator: '-', right: 8, result: 2 },
    ];
    expect(hasUnusedIntermediateSubtotal(solution)).toBe(false);
    expect(allIntermediateSubtotalsUsed(solution)).toBe(true);
  });

  it('counts usage when subtotal appears on the right of division', () => {
    // 2*3=6 is later used as the right operand in 12/6
    const solution: Step[] = [
      { left: 2, operator: '*', right: 3, result: 6 },
      { left: 12, operator: '/', right: 6, result: 2 },
    ];
    expect(hasUnusedIntermediateSubtotal(solution)).toBe(false);
    expect(allIntermediateSubtotalsUsed(solution)).toBe(true);
  });

  it('flags unused when an intermediate subtotal never reappears', () => {
    const solution: Step[] = [
      { left: 4, operator: '+', right: 4, result: 8 },
      { left: 9, operator: '+', right: 1, result: 10 },
    ];
    expect(hasUnusedIntermediateSubtotal(solution)).toBe(true);
    expect(allIntermediateSubtotalsUsed(solution)).toBe(false);
  });
});
