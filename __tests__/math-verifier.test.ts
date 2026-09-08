// Unit tests for MathVerifier
import { MathVerifier } from '../lib/math-verifier';
import { ProblemParser } from '../lib/problem-parser';

describe('MathVerifier', () => {
  describe('verifyAddition', () => {
    it('should verify 1/2+1/3 with exact steps', () => {
      const problem = ProblemParser.parse('1/2+1/3', 'manual');
      problem.confirmedByUser = true;
      
      const verified = MathVerifier.verifyAddition(problem);
      
      expect(verified.exact).toBe(true);
      expect(verified.verifier).toBe('local_rational_v1');
      expect(verified.result).toBeDefined();
      expect(verified.result?.numerator).toBe(5);
      expect(verified.result?.denominator).toBe(6);
      
      // Check steps include LCD
      const lcdStep = verified.steps.find(s => s.kind === 'find_lcd');
      expect(lcdStep).toBeDefined();
      expect(lcdStep?.lcd).toBe(6);
      
      // Check conversion steps
      const conversionSteps = verified.steps.filter(s => s.kind === 'convert_to_lcd');
      expect(conversionSteps.length).toBe(2);
      
      // Check addition step
      const addStep = verified.steps.find(s => s.kind === 'add_numerators');
      expect(addStep).toBeDefined();
    });

    it('should verify 1/4+1/6 correctly', () => {
      const problem = ProblemParser.parse('1/4+1/6', 'manual');
      problem.confirmedByUser = true;
      
      const verified = MathVerifier.verifyAddition(problem);
      
      expect(verified.result?.numerator).toBe(5);
      expect(verified.result?.denominator).toBe(12);
      
      const lcdStep = verified.steps.find(s => s.kind === 'find_lcd');
      expect(lcdStep?.lcd).toBe(12);
    });
  });

  describe('validateAnswer', () => {
    it('should validate correct answer for 1/2+1/3', () => {
      const problem = ProblemParser.parse('1/2+1/3', 'manual');
      problem.confirmedByUser = true;
      const verified = MathVerifier.verify(problem);
      
      const correctAnswer = { numerator: 5, denominator: 6 };
      expect(MathVerifier.validateAnswer(verified, correctAnswer)).toBe(true);
      
      // Should accept equivalent fractions
      const equivalentAnswer = { numerator: 10, denominator: 12 };
      expect(MathVerifier.validateAnswer(verified, equivalentAnswer)).toBe(true);
    });

    it('should reject incorrect answer 2/5 for 1/2+1/3', () => {
      const problem = ProblemParser.parse('1/2+1/3', 'manual');
      problem.confirmedByUser = true;
      const verified = MathVerifier.verify(problem);
      
      const wrongAnswer = { numerator: 2, denominator: 5 };
      expect(MathVerifier.validateAnswer(verified, wrongAnswer)).toBe(false);
    });
  });

  describe('checkDenominatorScope', () => {
    it('should accept denominators ≤ 12', () => {
      const operands = [
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 12 },
      ];
      expect(MathVerifier.checkDenominatorScope(operands)).toBe(true);
    });

    it('should reject denominators > 12', () => {
      const operands = [
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 13 },
      ];
      expect(MathVerifier.checkDenominatorScope(operands)).toBe(false);
    });
  });

  describe('Critical: never trust LLM for math answers', () => {
    it('should always use exact rational arithmetic', () => {
      const problem = ProblemParser.parse('1/2+1/3', 'manual');
      problem.confirmedByUser = true;
      const verified = MathVerifier.verify(problem);
      
      // Verifier must be local
      expect(verified.verifier).toBe('local_rational_v1');
      
      // Must be marked as exact
      expect(verified.exact).toBe(true);
      
      // Result must be exact rational, never float approximation
      expect(verified.result?.numerator).toBe(5);
      expect(verified.result?.denominator).toBe(6);
      expect(verified.result?.numerator / verified.result?.denominator).toBeCloseTo(0.8333, 4);
    });
  });
});
