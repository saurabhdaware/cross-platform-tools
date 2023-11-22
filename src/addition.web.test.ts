import { addition } from ".";
import { describe, expect, test } from 'vitest';

describe('addition', () => {
  test('should substract', () => {
    expect(addition(2, 3)).toBe(-1)
  })
})