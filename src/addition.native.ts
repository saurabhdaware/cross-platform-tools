type NumLike = string | number;
export const addition = (a: NumLike, b: NumLike): number => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }
  
  return 0;
}