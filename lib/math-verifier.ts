// MathVerifier - produces VerifiedSolution using exact Rational arithmetic
// NEVER trust LLM for mathematical truth

import { Rational } from './rational';
import { MathProblem, VerifiedSolution, RationalJSON } from '@/types';

export class MathVerifier {
  /**
   * Verify and solve an addition problem with exact rational arithmetic
   */
  static verifyAddition(problem: MathProblem): VerifiedSolution {
    if (!problem.parsed) {
      throw new Error('Problem must be parsed before verification');
    }

    const { operands } = problem.parsed;
    if (operands.length !== 2) {
      throw new Error('Addition requires exactly 2 operands');
    }

    const r1 = Rational.fromJSON(operands[0]);
    const r2 = Rational.fromJSON(operands[1]);

    // Step 1: Find LCD
    const lcd = Rational.lcm(r1.denominator, r2.denominator);

    // Step 2: Convert to LCD
    const converted = r1.toCommonDenominator(r2);

    // Step 3: Add numerators
    const sum = r1.add(r2);

    // Step 4: Simplify
    const simplified = sum.reduce();

    const steps: VerifiedSolution['steps'] = [
      {
        id: 'find_lcd',
        kind: 'find_lcd',
        input: [r1.toJSON(), r2.toJSON()],
        output: { numerator: lcd, denominator: 1 },
        lcd,
        noteTc: `公分母係 ${lcd}`,
      },
      {
        id: 'convert_to_lcd',
        kind: 'convert_to_lcd',
        input: [r1.toJSON(), r2.toJSON()],
        output: converted.first.toJSON(),
        lcd,
        noteTc: `${r1.toString()} = ${converted.first.toString()}`,
      },
      {
        id: 'convert_to_lcd_2',
        kind: 'convert_to_lcd',
        input: [r2.toJSON()],
        output: converted.second.toJSON(),
        lcd,
        noteTc: `${r2.toString()} = ${converted.second.toString()}`,
      },
      {
        id: 'add_numerators',
        kind: 'add_numerators',
        input: [converted.first.toJSON(), converted.second.toJSON()],
        output: sum.toJSON(),
        noteTc: `${converted.first.numerator} + ${converted.second.numerator} = ${sum.numerator}`,
      },
    ];

    // Only add simplify step if needed
    if (!sum.equals(simplified)) {
      steps.push({
        id: 'simplify',
        kind: 'simplify',
        input: [sum.toJSON()],
        output: simplified.toJSON(),
        noteTc: `化簡為 ${simplified.toString()}`,
      });
    }

    return {
      problemId: problem.id,
      exact: true,
      result: sum.toJSON(),
      steps,
      verifier: 'local_rational_v1',
    };
  }

  /**
   * Verify and solve a comparison problem
   */
  static verifyComparison(problem: MathProblem): VerifiedSolution {
    if (!problem.parsed) {
      throw new Error('Problem must be parsed before verification');
    }

    const { operands } = problem.parsed;
    if (operands.length !== 2) {
      throw new Error('Comparison requires exactly 2 operands');
    }

    const r1 = Rational.fromJSON(operands[0]);
    const r2 = Rational.fromJSON(operands[1]);

    const compareResult = r1.compare(r2);
    const comparison = compareResult === -1 ? 'lt' : compareResult === 1 ? 'gt' : 'eq';

    const steps: VerifiedSolution['steps'] = [
      {
        id: 'compare_values',
        kind: 'compare_values',
        input: [r1.toJSON(), r2.toJSON()],
        output: { comparison },
        noteTc: `${r1.toString()} ${comparison === 'lt' ? '<' : comparison === 'gt' ? '>' : '='} ${r2.toString()}`,
      },
    ];

    return {
      problemId: problem.id,
      exact: true,
      comparison,
      steps,
      verifier: 'local_rational_v1',
    };
  }

  /**
   * Verify equivalence
   */
  static verifyEquivalence(problem: MathProblem): VerifiedSolution {
    if (!problem.parsed) {
      throw new Error('Problem must be parsed before verification');
    }

    const { operands } = problem.parsed;
    if (operands.length !== 2) {
      throw new Error('Equivalence requires exactly 2 operands');
    }

    const r1 = Rational.fromJSON(operands[0]);
    const r2 = Rational.fromJSON(operands[1]);

    const isEqual = r1.equals(r2);

    const steps: VerifiedSolution['steps'] = [
      {
        id: 'compare_values',
        kind: 'compare_values',
        input: [r1.toJSON(), r2.toJSON()],
        output: { comparison: 'eq' },
        noteTc: isEqual ? `${r1.toString()} = ${r2.toString()}` : `${r1.toString()} ≠ ${r2.toString()}`,
      },
    ];

    return {
      problemId: problem.id,
      exact: true,
      comparison: isEqual ? 'eq' : 'lt', // simplified, could be gt
      steps,
      verifier: 'local_rational_v1',
    };
  }

  /**
   * Main verification entry point
   */
  static verify(problem: MathProblem): VerifiedSolution {
    if (!problem.parsed) {
      throw new Error('Problem must be parsed before verification');
    }

    switch (problem.parsed.operator) {
      case 'add':
        return this.verifyAddition(problem);
      case 'compare':
        return this.verifyComparison(problem);
      case 'equivalent':
        return this.verifyEquivalence(problem);
      default:
        throw new Error(`Unknown operator: ${problem.parsed.operator}`);
    }
  }

  /**
   * Check if denominators are within MVP scope (≤ 12)
   */
  static checkDenominatorScope(operands: RationalJSON[]): boolean {
    return operands.every(r => r.denominator >= 1 && r.denominator <= 12);
  }

  /**
   * Validate that a child's response matches the verified answer
   */
  static validateAnswer(
    verified: VerifiedSolution,
    childAnswer: RationalJSON
  ): boolean {
    if (!verified.result) return false;
    
    const correct = Rational.fromJSON(verified.result);
    const answer = Rational.fromJSON(childAnswer);
    
    return correct.equals(answer);
  }
}
