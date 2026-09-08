// Exact Rational arithmetic using integers
// Never use floating point for mathematical truth

import { RationalJSON } from '@/types';

/**
 * Rational number class with exact integer arithmetic
 * Used for all fraction calculations to ensure mathematical correctness
 */
export class Rational {
  public readonly numerator: number;
  public readonly denominator: number;

  constructor(numerator: number, denominator: number) {
    if (!Number.isInteger(numerator)) {
      throw new Error(`Numerator must be integer, got ${numerator}`);
    }
    if (!Number.isInteger(denominator) || denominator === 0) {
      throw new Error(`Denominator must be non-zero integer, got ${denominator}`);
    }

    // Store as-is, can reduce later if needed
    this.numerator = numerator;
    this.denominator = denominator;
  }

  /**
   * Greatest Common Divisor using Euclidean algorithm
   */
  static gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  /**
   * Least Common Multiple
   */
  static lcm(a: number, b: number): number {
    return Math.abs(a * b) / Rational.gcd(a, b);
  }

  /**
   * Reduce to lowest terms
   */
  reduce(): Rational {
    const g = Rational.gcd(this.numerator, this.denominator);
    return new Rational(this.numerator / g, this.denominator / g);
  }

  /**
   * Add two rationals
   */
  add(other: Rational): Rational {
    const lcd = Rational.lcm(this.denominator, other.denominator);
    const num1 = this.numerator * (lcd / this.denominator);
    const num2 = other.numerator * (lcd / other.denominator);
    return new Rational(num1 + num2, lcd);
  }

  /**
   * Compare two rationals
   * Returns: -1 if this < other, 0 if equal, 1 if this > other
   */
  compare(other: Rational): -1 | 0 | 1 {
    const lcd = Rational.lcm(this.denominator, other.denominator);
    const num1 = this.numerator * (lcd / this.denominator);
    const num2 = other.numerator * (lcd / other.denominator);
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
    return 0;
  }

  /**
   * Check equality
   */
  equals(other: Rational): boolean {
    return this.compare(other) === 0;
  }

  /**
   * Convert to common denominator with another rational
   */
  toCommonDenominator(other: Rational): { 
    lcd: number; 
    first: Rational; 
    second: Rational 
  } {
    const lcd = Rational.lcm(this.denominator, other.denominator);
    return {
      lcd,
      first: new Rational(
        this.numerator * (lcd / this.denominator),
        lcd
      ),
      second: new Rational(
        other.numerator * (lcd / other.denominator),
        lcd
      ),
    };
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return `${this.numerator}/${this.denominator}`;
  }

  /**
   * Convert to JSON format
   */
  toJSON(): RationalJSON {
    const reduced = this.reduce();
    return {
      numerator: this.numerator,
      denominator: this.denominator,
      reduced: {
        numerator: reduced.numerator,
        denominator: reduced.denominator,
      },
    };
  }

  /**
   * Create from JSON
   */
  static fromJSON(json: RationalJSON): Rational {
    return new Rational(json.numerator, json.denominator);
  }

  /**
   * Create from fraction string like "1/2"
   */
  static fromString(str: string): Rational {
    const parts = str.trim().split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid fraction string: ${str}`);
    }
    const num = parseInt(parts[0], 10);
    const den = parseInt(parts[1], 10);
    if (isNaN(num) || isNaN(den)) {
      throw new Error(`Invalid fraction string: ${str}`);
    }
    return new Rational(num, den);
  }

  /**
   * Convert to decimal (for display only, never for calculation)
   */
  toDecimal(): number {
    return this.numerator / this.denominator;
  }
}
