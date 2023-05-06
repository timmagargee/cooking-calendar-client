export function RoundNumber(num: number, decimals: number = 3): number {
  const n = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * n) / n;
}
