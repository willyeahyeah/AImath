// Misconception Database and Hypothesizer
// Based on FRACTION_CONCEPT_MAP.md

import { MisconceptionHypothesis, ConceptId, VisualModelId } from '@/types';

export const MISCONCEPTIONS: Record<string, MisconceptionHypothesis> = {
  'ADD-M1': {
    id: 'ADD-M1',
    concept: 'add_unlike_denominators',
    descriptionTc: '分子加分子、分母加分母（1/2+1/3=2/5）',
    descriptionEn: 'Adding numerators and denominators separately',
    evidenceRules: [
      'answerEquals("2/5") && promptWas("1/2+1/3")',
      'checkpointChoice("add_denominators")',
    ],
    severity: 'high',
    preferredFallbackModel: 'number_line',
  },
  'ADD-M2': {
    id: 'ADD-M2',
    concept: 'add_unlike_denominators',
    descriptionTc: '只化其中一個分母',
    descriptionEn: 'Converting only one fraction to LCD',
    evidenceRules: [
      'answerHasUnconvertedAddend',
    ],
    severity: 'medium',
    preferredFallbackModel: 'fraction_bar',
  },
  'EQ-M1': {
    id: 'EQ-M1',
    concept: 'equivalent_fractions',
    descriptionTc: '分子分母「上下加同一個數」仍等值（1/2→2/3）',
    descriptionEn: 'Adding same number to numerator and denominator for equivalence',
    evidenceRules: [
      'answerEquals("2/3") && promptWas("equivalentOf","1/2")',
    ],
    severity: 'high',
    preferredFallbackModel: 'paper_fold',
  },
  'EQ-M2': {
    id: 'EQ-M2',
    concept: 'equivalent_fractions',
    descriptionTc: '分母越大分數越大（忽略分子）',
    descriptionEn: 'Larger denominator means larger fraction',
    evidenceRules: [
      'compareChoice("1/4","1/2")=="gt"',
    ],
    severity: 'medium',
    preferredFallbackModel: 'fraction_bar',
  },
  'CMP-M1': {
    id: 'CMP-M1',
    concept: 'compare_fractions',
    descriptionTc: '分母大就大',
    descriptionEn: 'Larger denominator means larger fraction',
    evidenceRules: [
      'compareChoice("1/5","1/3")=="gt"',
    ],
    severity: 'high',
    preferredFallbackModel: 'number_line',
  },
  'CMP-M2': {
    id: 'CMP-M2',
    concept: 'compare_fractions',
    descriptionTc: '分子大就大（忽略分母）',
    descriptionEn: 'Comparing numerators only',
    evidenceRules: [
      'comparesNumeratorsOnly',
    ],
    severity: 'medium',
    preferredFallbackModel: 'fraction_bar',
  },
};

export class MisconceptionHypothesizer {
  /**
   * Generate hypothesis for an addition problem
   * For 1/2+1/3, primary hypothesis is ADD-M1
   */
  static hypothesizeAddition(rawInput: string): MisconceptionHypothesis[] {
    const hypotheses: MisconceptionHypothesis[] = [];
    
    // For any unlike denominator addition, ADD-M1 is the primary risk
    hypotheses.push(MISCONCEPTIONS['ADD-M1']);
    
    return hypotheses;
  }

  /**
   * Generate hypothesis for a comparison problem
   */
  static hypothesizeComparison(rawInput: string): MisconceptionHypothesis[] {
    const hypotheses: MisconceptionHypothesis[] = [];
    
    // Check if same numerator (different denominators)
    const match = rawInput.match(/^(\d+)\/(\d+).*(\d+)\/(\d+)$/);
    if (match) {
      const [_, n1, d1, n2, d2] = match;
      if (n1 === n2 && d1 !== d2) {
        hypotheses.push(MISCONCEPTIONS['CMP-M1']);
      }
    }
    
    // Default to CMP-M1 for any comparison
    if (hypotheses.length === 0) {
      hypotheses.push(MISCONCEPTIONS['CMP-M1']);
    }
    
    return hypotheses;
  }

  /**
   * Generate hypothesis for an equivalence problem
   */
  static hypothesizeEquivalence(rawInput: string): MisconceptionHypothesis[] {
    const hypotheses: MisconceptionHypothesis[] = [];
    
    // Default to EQ-M1 (adding same number to top and bottom)
    hypotheses.push(MISCONCEPTIONS['EQ-M1']);
    
    return hypotheses;
  }

  /**
   * Main entry point for hypothesis generation
   */
  static hypothesize(concept: ConceptId, rawInput: string): MisconceptionHypothesis[] {
    switch (concept) {
      case 'add_unlike_denominators':
        return this.hypothesizeAddition(rawInput);
      case 'compare_fractions':
        return this.hypothesizeComparison(rawInput);
      case 'equivalent_fractions':
        return this.hypothesizeEquivalence(rawInput);
      default:
        return [];
    }
  }
}
