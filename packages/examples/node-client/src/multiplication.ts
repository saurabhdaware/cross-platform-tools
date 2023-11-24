export const multiplication = (a: number, b: number, c?: undefined | number): number => {
  return a * b * (c ?? 1);
}