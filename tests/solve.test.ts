import { describe, it, expect } from 'vitest';
import { solve } from '../src/solve';

describe('solve', () => {
  it('returns null when no solution exists', () => {
    const result = solve([], [1, 2], 4);
    expect(result).toBeNull();
  });
});
