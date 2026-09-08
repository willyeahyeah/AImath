// Unit tests for Problem Parser
import { ProblemParser } from '../lib/problem-parser';

describe('ProblemParser', () => {
  describe('parse', () => {
    it('should parse addition expression 1/2+1/3', () => {
      const problem = ProblemParser.parse('1/2+1/3', 'manual');
      
      expect(problem.source).toBe('manual');
      expect(problem.rawInput).toBe('1/2+1/3');
      expect(problem.parsed).toBeDefined();
      expect(problem.parsed?.concept).toBe('add_unlike_denominators');
      expect(problem.parsed?.operator).toBe('add');
      expect(problem.parsed?.operands.length).toBe(2);
      expect(problem.parsed?.operands[0].numerator).toBe(1);
      expect(problem.parsed?.operands[0].denominator).toBe(2);
      expect(problem.parsed?.operands[1].numerator).toBe(1);
      expect(problem.parsed?.operands[1].denominator).toBe(3);
    });

    it('should parse without spaces', () => {
      const problem = ProblemParser.parse('1/4+1/6', 'manual');
      expect(problem.parsed?.operands[0].numerator).toBe(1);
      expect(problem.parsed?.operands[0].denominator).toBe(4);
    });

    it('should return unparsed for invalid input', () => {
      const problem = ProblemParser.parse('invalid', 'manual');
      expect(problem.parsed).toBeUndefined();
    });
  });

  describe('validateScope', () => {
    it('should accept valid MVP problems', () => {
      const problem = ProblemParser.parse('1/2+1/3', 'manual');
      const validation = ProblemParser.validateScope(problem);
      expect(validation.valid).toBe(true);
    });

    it('should reject unparsed problems', () => {
      const problem = ProblemParser.parse('invalid', 'manual');
      const validation = ProblemParser.validateScope(problem);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toBe('unparseable');
    });

    it('should reject denominators > 12', () => {
      const problem = ProblemParser.parse('1/13+1/2', 'manual');
      const validation = ProblemParser.validateScope(problem);
      expect(validation.valid).toBe(false);
      expect(validation.reason).toBe('denominator_gt_12');
    });
  });
});
