import { getData } from "./getData";
import { describe, test, expect } from 'vitest';

describe('getData', () => {
  test('should return the node value', () => {
    expect(getData()).toBe(1234);
  })
})