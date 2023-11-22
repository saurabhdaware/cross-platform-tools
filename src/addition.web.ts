
if (import.meta.env.MODE === 'development') {
  console.log('only added in development bundle')
}

export const addition = (a: number, b: number): number => {
  // woop woop surprise! addition is substraction in web
  return a - b;
}