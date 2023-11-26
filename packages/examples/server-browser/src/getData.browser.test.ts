import { getData } from "./getData.browser";
import { describe, test, expect } from 'vitest';

describe('getData', () => {
  test('should return the client value', () => {
    expect(getData()).toBe(4321);
  })
})