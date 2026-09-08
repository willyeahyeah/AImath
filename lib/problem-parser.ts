// Problem Parser - converts text input to MathProblem
// Supports simple fraction expressions for MVP

import { MathProblem, RationalJSON, ConceptId } from '@/types';
import { Rational } from './rational';

export class ProblemParser {
  /**
   * Parse a text input into a MathProblem
   * MVP: supports simple patterns like "1/2+1/3", "1/2 比 1/3", "2/4 = ?/8"
   */
  static parse(rawInput: string, source: "ocr" | "manual" = "manual"): MathProblem {
    const id = `prob-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const normalized = rawInput.trim().replace(/\s+/g, '');

    // Try to parse addition
    const addMatch = normalized.match(/^(\d+)\/(\d+)\+(\d+)\/(\d+)$/);
    if (addMatch) {
      const r1: RationalJSON = {
        numerator: parseInt(addMatch[1], 10),
        denominator: parseInt(addMatch[2], 10),
      };
      const r2: RationalJSON = {
        numerator: parseInt(addMatch[3], 10),
        denominator: parseInt(addMatch[4], 10),
      };

      return {
        id,
        source,
        rawInput,
        languageUI: "zh-Hant",
        confirmedByUser: false,
        parsed: {
          concept: "add_unlike_denominators",
          operands: [r1, r2],
          operator: "add",
          displayPromptTc: `計算 ${r1.numerator}/${r1.denominator} + ${r2.numerator}/${r2.denominator}`,
        },
      };
    }

    // Try to parse comparison (支持 "比較" or comparison symbols)
    const compareMatch = normalized.match(/^(\d+)\/(\d+)(比較|比|vs|○)(\d+)\/(\d+)$/);
    if (compareMatch) {
      const r1: RationalJSON = {
        numerator: parseInt(compareMatch[1], 10),
        denominator: parseInt(compareMatch[2], 10),
      };
      const r2: RationalJSON = {
        numerator: parseInt(compareMatch[4], 10),
        denominator: parseInt(compareMatch[5], 10),
      };

      return {
        id,
        source,
        rawInput,
        languageUI: "zh-Hant",
        confirmedByUser: false,
        parsed: {
          concept: "compare_fractions",
          operands: [r1, r2],
          operator: "compare",
          displayPromptTc: `比較 ${r1.numerator}/${r1.denominator} 同 ${r2.numerator}/${r2.denominator}`,
        },
      };
    }

    // Try to parse equivalence (a/b = c/d or a/b = ?/d)
    const eqMatch = normalized.match(/^(\d+)\/(\d+)=(\d+|\?)\/(\d+)$/);
    if (eqMatch) {
      const r1: RationalJSON = {
        numerator: parseInt(eqMatch[1], 10),
        denominator: parseInt(eqMatch[2], 10),
      };
      
      // If it's a fill-in-the-blank, we still parse it as equivalence check
      const targetNumerator = eqMatch[3] === '?' ? 0 : parseInt(eqMatch[3], 10);
      const r2: RationalJSON = {
        numerator: targetNumerator,
        denominator: parseInt(eqMatch[4], 10),
      };

      return {
        id,
        source,
        rawInput,
        languageUI: "zh-Hant",
        confirmedByUser: false,
        parsed: {
          concept: "equivalent_fractions",
          operands: [r1, r2],
          operator: "equivalent",
          displayPromptTc: eqMatch[3] === '?' 
            ? `${r1.numerator}/${r1.denominator} = ?/${r2.denominator}` 
            : `${r1.numerator}/${r1.denominator} 同 ${r2.numerator}/${r2.denominator} 係唔係等值？`,
        },
      };
    }

    // If no pattern matches, return unparsed problem
    return {
      id,
      source,
      rawInput,
      languageUI: "zh-Hant",
      confirmedByUser: false,
    };
  }

  /**
   * Validate that a problem is within MVP scope
   */
  static validateScope(problem: MathProblem): { 
    valid: boolean; 
    reason?: string;
    reasonTc?: string;
  } {
    if (!problem.parsed) {
      return { 
        valid: false, 
        reason: 'unparseable',
        reasonTc: '未能辨識呢條題目。請試下手動輸入。'
      };
    }

    const { concept, operands } = problem.parsed;

    // Check MVP concepts
    const validConcepts: ConceptId[] = [
      'equivalent_fractions',
      'compare_fractions',
      'add_unlike_denominators',
    ];

    if (!validConcepts.includes(concept)) {
      return {
        valid: false,
        reason: 'concept_out_of_mvp',
        reasonTc: '呢個課題暫時未包括喺練習範圍。'
      };
    }

    // Check denominator scope (≤ 12 for MVP)
    for (const op of operands) {
      if (op.denominator > 12) {
        return {
          valid: false,
          reason: 'denominator_gt_12',
          reasonTc: '呢題嘅分母太大（大過 12），暫時超出練習範圍。'
        };
      }
      if (op.denominator < 1) {
        return {
          valid: false,
          reason: 'verifier_failed',
          reasonTc: '分母必須係正整數。'
        };
      }
    }

    return { valid: true };
  }
}
