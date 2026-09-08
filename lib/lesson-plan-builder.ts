// LessonPlan Builder - generates structured teaching sequences
// MVP: Template-based for 1/2+1/3 vertical slice

import { 
  LessonPlan, 
  MathProblem, 
  VerifiedSolution, 
  LessonScene,
  Checkpoint,
  VisualObject,
  AnimationAction,
  NarrationSegment,
  MisconceptionHypothesis 
} from '@/types';
import { Rational } from './rational';
import { MathVerifier } from './math-verifier';
import { ProblemParser } from './problem-parser';

export class LessonPlanBuilder {
  /**
   * Build a complete lesson plan for addition: 1/2 + 1/3
   */
  static buildAdditionPlan(
    problem: MathProblem,
    verified: VerifiedSolution,
    hypotheses: MisconceptionHypothesis[]
  ): LessonPlan {
    const { operands } = problem.parsed!;
    const r1 = Rational.fromJSON(operands[0]);
    const r2 = Rational.fromJSON(operands[1]);
    const lcd = Rational.lcm(r1.denominator, r2.denominator);
    const converted = r1.toCommonDenominator(r2);
    const sum = r1.add(r2);

    // Scene 1: Introduction (0-3000ms)
    const scene1: LessonScene = {
      id: 'intro',
      order: 1,
      durationMs: 3000,
      purposeTc: '展示兩個分數',
      objects: [
        {
          id: 'barA',
          type: 'fractionBar',
          model: 'fraction_bar',
          math: { numerator: r1.numerator, denominator: r1.denominator },
          layout: { x: 24, y: 80, w: 312, h: 48 },
          style: { fillRole: 'A', pattern: 'solid' },
          zIndex: 1,
        },
        {
          id: 'barB',
          type: 'fractionBar',
          model: 'fraction_bar',
          math: { numerator: r2.numerator, denominator: r2.denominator },
          layout: { x: 24, y: 160, w: 312, h: 48 },
          style: { fillRole: 'B', pattern: 'solid' },
          zIndex: 1,
        },
        {
          id: 'labelA',
          type: 'label',
          model: 'label',
          math: { numerator: r1.numerator, denominator: r1.denominator },
          layout: { x: 24, y: 50, w: 100, h: 24 },
          zIndex: 2,
        },
        {
          id: 'labelB',
          type: 'label',
          model: 'label',
          math: { numerator: r2.numerator, denominator: r2.denominator },
          layout: { x: 24, y: 130, w: 100, h: 24 },
          zIndex: 2,
        },
      ],
      actions: [
        {
          id: 'shade-a',
          type: 'Shade',
          targetObjectIds: ['barA'],
          tStartMs: 500,
          tEndMs: 1200,
          params: { parts: r1.numerator },
        },
        {
          id: 'shade-b',
          type: 'Shade',
          targetObjectIds: ['barB'],
          tStartMs: 1500,
          tEndMs: 2200,
          params: { parts: r2.numerator },
        },
      ],
      narration: [
        {
          id: 'intro-narration',
          tStartMs: 0,
          tEndMs: 3000,
          cantoneseScript: '睇下：一半加三分之一',
          subtitleTc: '先睇兩個分數',
        },
      ],
    };

    // Scene 2: Show wrong approach (3000-8000ms)
    const scene2: LessonScene = {
      id: 'wrong-demo',
      order: 2,
      durationMs: 5000,
      purposeTc: '示範點解唔可以加分母',
      objects: [
        {
          id: 'wrong-result',
          type: 'label',
          model: 'label',
          math: { numerator: r1.numerator + r2.numerator, denominator: r1.denominator + r2.denominator },
          layout: { x: 24, y: 240, w: 150, h: 40 },
          style: { fillRole: 'neutral', pattern: 'solid' },
          zIndex: 2,
        },
        {
          id: 'wrong-marker',
          type: 'label',
          model: 'label',
          math: { numerator: 0, denominator: 1 },
          layout: { x: 180, y: 245, w: 60, h: 30 },
          zIndex: 3,
        },
      ],
      actions: [
        {
          id: 'show-wrong',
          type: 'Label',
          targetObjectIds: ['wrong-result'],
          tStartMs: 500,
          tEndMs: 1000,
          params: { text: `${r1.numerator + r2.numerator}/${r1.denominator + r2.denominator}` },
        },
        {
          id: 'highlight-wrong',
          type: 'Highlight',
          targetObjectIds: ['wrong-result', 'wrong-marker'],
          tStartMs: 2000,
          tEndMs: 4500,
          params: { color: 'red', flash: true },
        },
      ],
      narration: [
        {
          id: 'wrong-narration',
          tStartMs: 0,
          tEndMs: 5000,
          cantoneseScript: '有人會將分母加埋變 2/5，咁樣唔啱',
          subtitleTc: '唔可以分子分母分別相加',
        },
      ],
    };

    // Scene 3: Regroup to LCD (8000-16000ms)
    const scene3: LessonScene = {
      id: 'regroup',
      order: 3,
      durationMs: 8000,
      purposeTc: '化成公分母',
      objects: [
        {
          id: 'barA-lcd',
          type: 'fractionBar',
          model: 'fraction_bar',
          math: { numerator: converted.first.numerator, denominator: lcd },
          layout: { x: 24, y: 80, w: 312, h: 48 },
          style: { fillRole: 'A', pattern: 'solid' },
          zIndex: 1,
        },
        {
          id: 'barB-lcd',
          type: 'fractionBar',
          model: 'fraction_bar',
          math: { numerator: converted.second.numerator, denominator: lcd },
          layout: { x: 24, y: 160, w: 312, h: 48 },
          style: { fillRole: 'B', pattern: 'solid' },
          zIndex: 1,
        },
      ],
      actions: [
        {
          id: 'regroup-a',
          type: 'Regroup',
          targetObjectIds: ['barA'],
          tStartMs: 1000,
          tEndMs: 3000,
          params: { newDenominator: lcd },
        },
        {
          id: 'regroup-b',
          type: 'Regroup',
          targetObjectIds: ['barB'],
          tStartMs: 4000,
          tEndMs: 6000,
          params: { newDenominator: lcd },
        },
      ],
      narration: [
        {
          id: 'regroup-narration',
          tStartMs: 0,
          tEndMs: 8000,
          cantoneseScript: '要切成一樣大嘅一份，公分母係 6',
          subtitleTc: '化成六等份',
        },
      ],
    };

    // Scene 4: Combine (16000-24000ms)
    const scene4: LessonScene = {
      id: 'combine',
      order: 4,
      durationMs: 8000,
      purposeTc: '合併成總和',
      objects: [
        {
          id: 'sum-bar',
          type: 'fractionBar',
          model: 'fraction_bar',
          math: { numerator: sum.numerator, denominator: sum.denominator },
          layout: { x: 24, y: 240, w: 312, h: 48 },
          style: { fillRole: 'sum', pattern: 'solid' },
          zIndex: 1,
        },
      ],
      actions: [
        {
          id: 'align-bars',
          type: 'Align',
          targetObjectIds: ['barA-lcd', 'barB-lcd'],
          tStartMs: 0,
          tEndMs: 2000,
          params: {},
        },
        {
          id: 'combine-action',
          type: 'Combine',
          targetObjectIds: ['barA-lcd', 'barB-lcd'],
          tStartMs: 2000,
          tEndMs: 5000,
          params: { result: 'sum-bar' },
        },
      ],
      narration: [
        {
          id: 'combine-narration',
          tStartMs: 0,
          tEndMs: 8000,
          cantoneseScript: '三份加兩份等於五份',
          subtitleTc: `${converted.first.numerator}/${lcd} + ${converted.second.numerator}/${lcd} = ${sum.numerator}/${lcd}`,
        },
      ],
    };

    // Scene 5: Final result (24000-30000ms)
    const scene5: LessonScene = {
      id: 'result',
      order: 5,
      durationMs: 6000,
      purposeTc: '總結答案',
      objects: [
        {
          id: 'final-label',
          type: 'label',
          model: 'label',
          math: { numerator: sum.numerator, denominator: sum.denominator },
          layout: { x: 120, y: 320, w: 120, h: 40 },
          zIndex: 2,
        },
      ],
      actions: [
        {
          id: 'show-result',
          type: 'Label',
          targetObjectIds: ['final-label'],
          tStartMs: 1000,
          tEndMs: 2000,
          params: { text: sum.toString(), emphasize: true },
        },
      ],
      narration: [
        {
          id: 'result-narration',
          tStartMs: 0,
          tEndMs: 6000,
          cantoneseScript: `所以 ${r1.toString()} 加 ${r2.toString()} 等於 ${sum.toString()}`,
          subtitleTc: `${r1.toString()} + ${r2.toString()} = ${sum.toString()}`,
        },
      ],
    };

    // Checkpoint: test ADD-M1 misconception
    const checkpoint: Checkpoint = {
      id: 'checkpoint-add-m1',
      afterSceneId: 'result',
      targetMisconceptionIds: ['ADD-M1'],
      promptTc: `計算 ${r1.toString()}+${r2.toString()} 時，可唔可以將分母加埋變成 ${r1.denominator + r2.denominator}？`,
      format: 'tf',
      correct: { tf: false },
      successCriteria: 'single_correct',
      onFailLessonPlanId: 'fallback-number-line',
    };

    // Transfer question: 1/4 + 1/6
    const transferProblem = ProblemParser.parse('1/4+1/6', 'manual');
    transferProblem.confirmedByUser = true;
    const transferVerified = MathVerifier.verify(transferProblem);

    return {
      id: `plan-${problem.id}`,
      problemId: problem.id,
      concept: 'add_unlike_denominators',
      primaryModel: 'fraction_bar',
      fallbackModel: 'number_line',
      hypothesisIds: hypotheses.map(h => h.id),
      scenes: [scene1, scene2, scene3, scene4, scene5],
      checkpoint,
      transfer: {
        promptTc: '試下：1/4 + 1/6 = ?',
        problem: transferProblem,
        verified: transferVerified,
      },
      totalTargetDurationMs: { min: 30000, max: 60000 },
      version: 'phase0-draft',
    };
  }

  /**
   * Build fallback lesson plan using NumberLine
   */
  static buildFallbackNumberLine(
    problem: MathProblem,
    verified: VerifiedSolution
  ): LessonPlan {
    // Simplified fallback using number line visualization
    // This would show the same addition but with jumps on a number line
    // For MVP, we'll create a minimal version
    
    const { operands } = problem.parsed!;
    const r1 = Rational.fromJSON(operands[0]);
    const r2 = Rational.fromJSON(operands[1]);
    const sum = r1.add(r2);
    const lcd = Rational.lcm(r1.denominator, r2.denominator);

    const scene: LessonScene = {
      id: 'numberline-explanation',
      order: 1,
      durationMs: 30000,
      purposeTc: '用數線解釋',
      objects: [
        {
          id: 'numberline',
          type: 'numberLine',
          model: 'number_line',
          math: { numerator: 0, denominator: 1 },
          layout: { x: 24, y: 200, w: 312, h: 80 },
          zIndex: 1,
        },
      ],
      actions: [
        {
          id: 'show-line',
          type: 'Label',
          targetObjectIds: ['numberline'],
          tStartMs: 0,
          tEndMs: 1000,
          params: { marks: lcd },
        },
      ],
      narration: [
        {
          id: 'fallback-narration',
          tStartMs: 0,
          tEndMs: 30000,
          cantoneseScript: '我哋用數線再解釋一次',
          subtitleTc: '用數線表示分數加法',
        },
      ],
    };

    return {
      id: 'fallback-number-line',
      problemId: problem.id,
      concept: 'add_unlike_denominators',
      primaryModel: 'number_line',
      fallbackModel: 'paper_fold',
      hypothesisIds: ['ADD-M1'],
      scenes: [scene],
      checkpoint: {
        id: 'checkpoint-fallback',
        afterSceneId: 'numberline-explanation',
        targetMisconceptionIds: ['ADD-M1'],
        promptTc: '而家明唔明點解要用公分母？',
        format: 'tf',
        correct: { tf: true },
        successCriteria: 'single_correct',
      },
      transfer: {
        promptTc: '試下：1/4 + 1/6 = ?',
        problem: ProblemParser.parse('1/4+1/6', 'manual'),
        verified: MathVerifier.verify(ProblemParser.parse('1/4+1/6', 'manual')),
      },
      totalTargetDurationMs: { min: 30000, max: 60000 },
      version: 'phase0-draft',
    };
  }

  /**
   * Main entry point to build a lesson plan
   */
  static build(
    problem: MathProblem,
    verified: VerifiedSolution,
    hypotheses: MisconceptionHypothesis[]
  ): LessonPlan {
    const concept = problem.parsed?.concept;

    switch (concept) {
      case 'add_unlike_denominators':
        return this.buildAdditionPlan(problem, verified, hypotheses);
      default:
        throw new Error(`Lesson plan builder not implemented for concept: ${concept}`);
    }
  }
}
