// Unit tests for Rational class
import { Rational } from '../lib/rational';

describe('Rational', () => {
  describe('constructor', () => {
    it('should create a valid rational', () => {
      const r = new Rational(1, 2);
      expect(r.numerator).toBe(1);
      expect(r.denominator).toBe(2);
    });

    it('should throw on non-integer numerator', () => {
      expect(() => new Rational(1.5, 2)).toThrow();
    });

    it('should throw on zero denominator', () => {
      expect(() => new Rational(1, 0)).toThrow();
    });

    it('should throw on non-integer denominator', () => {
      expect(() => new Rational(1, 2.5)).toThrow();
    });
  });

  describe('gcd', () => {
    it('should calculate gcd correctly', () => {
      expect(Rational.gcd(12, 8)).toBe(4);
      expect(Rational.gcd(15, 25)).toBe(5);
      expect(Rational.gcd(7, 13)).toBe(1);
      expect(Rational.gcd(100, 50)).toBe(50);
    });

    it('should handle negative numbers', () => {
      expect(Rational.gcd(-12, 8)).toBe(4);
      expect(Rational.gcd(12, -8)).toBe(4);
    });
  });

  describe('lcm', () => {
    it('should calculate lcm correctly', () => {
      expect(Rational.lcm(2, 3)).toBe(6);
      expect(Rational.lcm(4, 6)).toBe(12);
      expect(Rational.lcm(5, 7)).toBe(35);
      expect(Rational.lcm(12, 8)).toBe(24);
    });
  });

  describe('reduce', () => {
    it('should reduce fractions to lowest terms', () => {
      const r1 = new Rational(2, 4).reduce();
      expect(r1.numerator).toBe(1);
      expect(r1.denominator).toBe(2);

      const r2 = new Rational(6, 9).reduce();
      expect(r2.numerator).toBe(2);
      expect(r2.denominator).toBe(3);
    });

    it('should not change already reduced fractions', () => {
      const r = new Rational(3, 5).reduce();
      expect(r.numerator).toBe(3);
      expect(r.denominator).toBe(5);
    });
  });

  describe('add', () => {
    it('should add 1/2 + 1/3 = 5/6', () => {
      const r1 = new Rational(1, 2);
      const r2 = new Rational(1, 3);
      const sum = r1.add(r2);
      expect(sum.numerator).toBe(5);
      expect(sum.denominator).toBe(6);
    });

    it('should add 1/4 + 1/6 = 5/12', () => {
      const r1 = new Rational(1, 4);
      const r2 = new Rational(1, 6);
      const sum = r1.add(r2);
      expect(sum.numerator).toBe(5);
      expect(sum.denominator).toBe(12);
    });

    it('should add same denominator fractions', () => {
      const r1 = new Rational(1, 6);
      const r2 = new Rational(2, 6);
      const sum = r1.add(r2);
      expect(sum.numerator).toBe(3);
      expect(sum.denominator).toBe(6);
    });
  });

  describe('compare', () => {
    it('should compare 1/2 < 2/3', () => {
      const r1 = new Rational(1, 2);
      const r2 = new Rational(2, 3);
      expect(r1.compare(r2)).toBe(-1);
    });

    it('should compare 3/4 > 1/2', () => {
      const r1 = new Rational(3, 4);
      const r2 = new Rational(1, 2);
      expect(r1.compare(r2)).toBe(1);
    });

    it('should compare equal fractions', () => {
      const r1 = new Rational(1, 2);
      const r2 = new Rational(2, 4);
      expect(r1.compare(r2)).toBe(0);
    });

    it('should handle same numerator different denominators', () => {
      const r1 = new Rational(1, 5);
      const r2 = new Rational(1, 3);
      expect(r1.compare(r2)).toBe(-1); // 1/5 < 1/3
    });
  });

  describe('equals', () => {
    it('should identify equal fractions', () => {
      const r1 = new Rational(1, 2);
      const r2 = new Rational(2, 4);
      expect(r1.equals(r2)).toBe(true);
    });

    it('should identify unequal fractions', () => {
      const r1 = new Rational(1, 2);
      const r2 = new Rational(1, 3);
      expect(r1.equals(r2)).toBe(false);
    });
  });

  describe('toCommonDenominator', () => {
    it('should convert 1/2 and 1/3 to sixths', () => {
      const r1 = new Rational(1, 2);
      const r2 = new Rational(1, 3);
      const { lcd, first, second } = r1.toCommonDenominator(r2);
      
      expect(lcd).toBe(6);
      expect(first.numerator).toBe(3);
      expect(first.denominator).toBe(6);
      expect(second.numerator).toBe(2);
      expect(second.denominator).toBe(6);
    });
  });

  describe('toString', () => {
    it('should format as fraction string', () => {
      const r = new Rational(3, 4);
      expect(r.toString()).toBe('3/4');
    });
  });

  describe('fromString', () => {
    it('should parse fraction strings', () => {
      const r = Rational.fromString('3/4');
      expect(r.numerator).toBe(3);
      expect(r.denominator).toBe(4);
    });

    it('should throw on invalid strings', () => {
      expect(() => Rational.fromString('invalid')).toThrow();
      expect(() => Rational.fromString('3')).toThrow();
      expect(() => Rational.fromString('3/4/5')).toThrow();
    });
  });

  describe('Critical MVP test: 1/2+1/3=5/6 NOT 2/5', () => {
    it('should correctly calculate 1/2+1/3=5/6', () => {
      const r1 = new Rational(1, 2);
      const r2 = new Rational(1, 3);
      const sum = r1.add(r2);
      
      // Correct answer
      expect(sum.numerator).toBe(5);
      expect(sum.denominator).toBe(6);
      
      // NOT the misconception answer
      expect(sum.numerator).not.toBe(2);
      expect(sum.denominator).not.toBe(5);
    });

    it('should verify LCD is 6 for denominators 2 and 3', () => {
      expect(Rational.lcm(2, 3)).toBe(6);
    });

    it('should reject 2/5 as answer to 1/2+1/3', () => {
      const correct = new Rational(5, 6);
      const wrong = new Rational(2, 5);
      expect(correct.equals(wrong)).toBe(false);
    });
  });
});
