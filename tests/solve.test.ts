import { describe, it, expect } from 'vitest';
import { solve } from '../src/solve';

describe('solve', () => {
  it('returns null when no solution exists', () => {
    const result = solve([1, 2], 4);
    expect(result).toBeNull();
  });

  it('returns the correct solution when two inputs can be added to make the target', () => {
    const result = solve([1, 2], 3);
    expect(result).toEqual([[1, '+', 2, 3]]);
  });

  it('returns the correct solution when two inputs can be multiplied to make the target', () => {
    const result = solve([2, 3], 6);
    expect(result).toEqual([[2, '*', 3, 6]]);
  });

  it('returns the correct solution when two inputs can be subtracted to make the target', () => {
    const result = solve([2, 3], 1);
    expect(result).toEqual([[3, '-', 2, 1]]);
  });

  it('returns the correct solution when two inputs can be divided to make the target', () => {
    const result = solve([2, 6], 3);
    expect(result).toEqual([[6, '/', 2, 3]]);
  });

  it('does not round down when dividing to make the target', () => {
    const result = solve([2, 7], 3);
    expect(result).toEqual(null);
  });
});
