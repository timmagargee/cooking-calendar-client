export function reduceFraction(numerator: number, denominator: number) {
  var gc = gcd(numerator, denominator);
  return [numerator / gc, denominator / gc];
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

export class Fraction {
  whole?: number;
  numerator: number;
  denominator: number;

  constructor(num: number, den: number, whole?: number) {
    this.numerator = num;
    this.denominator = den;
    this.whole = whole;
  }
}

export interface fraction {
  numerator: number;
  denominator: number;
}

export interface mixedFraction {
  numerator: number;
  denominator: number;
}
