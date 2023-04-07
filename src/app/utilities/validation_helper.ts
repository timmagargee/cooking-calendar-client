export function stringIsFilled(s: string | undefined): boolean {
  return s !== undefined && s.trim() !== '';
}
