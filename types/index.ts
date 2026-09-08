// Core types for Visual Math Learning App
// Based on PROJECT_BLUEPRINT.md Phase 0 schema

/** Exact rational — never float for truth */
export interface RationalJSON {
  numerator: number;      // integer
  denominator: number;    // integer > 0
  /** canonical reduced form optional cache */
  reduced?: { numerator: number; denominator: number };
}

export type ConceptId =
  | "equivalent_fractions"
  | "compare_fractions"
  | "add_unlike_denominators";

export type VisualModelId =
  | "fraction_bar"
  | "fraction_circle"
  | "number_line"
  | "paper_fold";

export type OosReason =
  | "unparseable"
  | "handwriting_not_supported"
  | "word_problem_too_complex"
  | "concept_out_of_mvp"
  | "denominator_gt_12"
  | "verifier_failed";

export interface MathProblem {
  id: string;
  source: "ocr" | "manual";
  rawInput: string;                 // e.g. "1/2+1/3"
  languageUI: "zh-Hant";
  confirmedByUser: boolean;         // must be true before teach
  imageAssetId?: string;            // no face storage; ephemeral ok
  parsed?: {
    concept: ConceptId;
    operands: RationalJSON[];
    operator?: "add" | "compare" | "equivalent";
    displayPromptTc: string;
  };
}

export interface VerifiedSolution {
  problemId: string;
  exact: true;                      // literal marker: must be engine-verified
  result?: RationalJSON;            // for add / equivalent target
  comparison?: "lt" | "eq" | "gt";
  steps: Array<{
    id: string;
    kind:
      | "rewrite_equivalent"
      | "find_lcd"
      | "convert_to_lcd"
      | "add_numerators"
      | "compare_values"
      | "simplify";
    input: RationalJSON[];
    output: RationalJSON | { comparison: "lt" | "eq" | "gt" };
    lcd?: number;
    noteTc?: string;
  }>;
  verifier: "local_rational_v1";
}

export interface MisconceptionHypothesis {
  id: string;                       // e.g. "ADD-M1"
  concept: ConceptId;
  descriptionTc: string;
  descriptionEn: string;
  evidenceRules: string[];          // declarative predicates
  severity: "high" | "medium" | "low";
  preferredFallbackModel: VisualModelId;
}

export interface NarrationSegment {
  id: string;
  tStartMs: number;
  tEndMs: number;
  cantoneseScript: string;          // spoken
  subtitleTc: string;               // on-screen written TC
  audioAssetId?: string;            // from TtsProvider; optional mock
}

export interface AnimationAction {
  id: string;
  type:
    | "Divide" | "Shade" | "Highlight" | "Move" | "Combine" | "Separate"
    | "Align" | "Compare" | "Regroup" | "Zoom" | "Label" | "Transform";
  targetObjectIds: string[];
  tStartMs: number;
  tEndMs: number;
  params: Record<string, unknown>;  // e.g. { parts: 6, shade: 3 }
}

export interface VisualObject {
  id: string;
  type:
    | "fractionBar" | "fractionCircle" | "numberLine"
    | "paperFold" | "label" | "counterGroup";
  model: VisualModelId | "label" | "counter";
  /** Authoritative math payload — validated before render */
  math: {
    numerator: number;
    denominator: number;
    displayUnsimplified?: boolean;
  };
  layout: {
    x: number; y: number; w: number; h: number; rotation?: number;
  };
  style?: { fillRole?: "A" | "B" | "sum" | "neutral"; pattern?: "solid" | "hatch" | "dots" };
  zIndex?: number;
}

export interface LessonScene {
  id: string;
  order: number;
  durationMs: number;
  objects: VisualObject[];
  actions: AnimationAction[];
  narration: NarrationSegment[];
  purposeTc: string;                // e.g. "示範點解唔可以加分母"
}

export interface Checkpoint {
  id: string;
  afterSceneId: string;
  targetMisconceptionIds: string[];
  promptTc: string;
  promptYue?: string;               // optional oral prompt
  format: "mcq" | "tf" | "fill_rational" | "compare_symbol";
  choices?: Array<{ id: string; labelTc: string; rational?: RationalJSON }>;
  correct: { choiceId?: string; rational?: RationalJSON; comparison?: "lt"|"eq"|"gt"; tf?: boolean };
  successCriteria: "single_correct";
  onFailLessonPlanId?: string;      // alt visual plan
}

export interface LessonPlan {
  id: string;
  problemId: string;
  concept: ConceptId;
  primaryModel: VisualModelId;
  fallbackModel: VisualModelId;
  hypothesisIds: string[];
  scenes: LessonScene[];
  checkpoint: Checkpoint;
  transfer: {
    promptTc: string;
    problem: MathProblem;           // new numbers / representation
    verified: VerifiedSolution;
  };
  totalTargetDurationMs: { min: 30000; max: 60000 };
  version: "phase0-draft";
}

export interface ChildResponse {
  checkpointId: string;
  selectedChoiceId?: string;
  filledRational?: RationalJSON;
  comparison?: "lt" | "eq" | "gt";
  tf?: boolean;
  isCorrect: boolean;               // set by verifier, not LLM opinion
  respondedAtIso: string;
}

export interface LearningSession {
  id: string;
  startedAtIso: string;
  locale: "zh-Hant-HK";
  narrationLocale: "yue-HK";
  problem: MathProblem;
  verified?: VerifiedSolution;
  oos?: { reason: OosReason; messageTc: string };
  primaryPlanId?: string;
  fallbackPlanId?: string;
  responses: ChildResponse[];
  transferCompleted?: boolean;
  /** MVP demo: no account */
  anonymous: true;
  notesParentalTc?: string;
}

// Provider interfaces
export interface OcrProvider {
  recognize(image: Blob): Promise<{ 
    text: string; 
    confidence: number; 
    engine: "mock" | "tesseract" | "cloud" 
  }>;
}

export interface TtsProvider {
  synthesize(opts: { 
    textYue: string; 
    voice?: string 
  }): Promise<{ 
    audioUrl: string; 
    engine: string 
  }>;
}
