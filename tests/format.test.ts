import { describe, it, expect } from 'vitest';
import { formatOperator } from '../src/format';

describe('formatOperator', () => {
  it('formats addition', () => {
    expect(formatOperator('+')).toBe('+');
  });
  it('formats subtraction as unicode minus', () => {
    expect(formatOperator('-')).toBe('−');
  });
  it('formats multiplication as ×', () => {
    expect(formatOperator('*')).toBe('×');
  });
  it('formats division as ÷', () => {
    expect(formatOperator('/')).toBe('÷');
  });
});
