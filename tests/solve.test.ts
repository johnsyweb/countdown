import { describe, it, expect } from 'vitest';
import { solve } from '../src/solve';

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
});
