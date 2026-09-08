# PROJECT_BLUEPRINT.md — Phase 0

**產品暫名**：Visual Math Learning（香港小學視覺分數學習）  
**文件日期**：2026-09-08（HKT）  
**階段**：Phase 0（僅文件；無 production code）  
**原則**：「答案只係結果，理解先係產品。」

---

## 1. One-sentence product definition

A mobile-first Cantonese + Traditional Chinese app that turns a clear printed (or typed) Hong Kong P4–P5 fraction question into a confirmed, verified, 30–60s adaptive visual explanation with narration, checkpoint, alternate visual model on failure, and a transfer question — never an answer-only solver.

一句話：把清晰印刷／手動輸入的小四至小五分數題，變成「確認辨識 → 精確驗算 → 短視覺解釋（粵語旁白+繁中字幕）→ 檢查點 → 錯則換視覺模型 → 遷移題」的理解產品，而唔係只俾答案。

---

## 2. Complete child journey（完整兒童旅程）

```text
[入口] 相機拍清晰印刷題  或  手動輸入文字
    ↓
[確認] 顯示 OCR／解析結果（繁中 UI）→ 兒童／家長確認或改正
    ↓
[範圍] MathVerifier：能否解析？是否 MVP 三主題？分母規則？
    ├─ 否 → 優雅 OOS 說明 + 建議手動改題／換題
    └─ 是 ↓
[驗算] Exact Rational 產出 VerifiedSolution（永不只靠 LLM 報答案）
    ↓
[診斷] Teaching Brain：概念 ID + MisconceptionHypothesis（可先通用再 refinement）
    ↓
[教案] LessonPlan：主視覺模型 + 場景 + 旁白腳本 + 字幕 + checkpoint + fallback plan
    ↓
[播放] Visual Mathematics Engine：決定性 SVG/Canvas LEGO 動畫 30–60s
         + 粵語 TTS（adapter；可 mock）+ TC 字幕同步
    ↓
[檢查點] Checkpoint 題（針對常見迷思）
    ├─ 通過 → Transfer question（換數字／換表徵）
    └─ 未通過 → 以「不同視覺模型」重講（fallback）→ 再檢 → Transfer
    ↓
[結束] 簡短鼓勵理解（唔係只顯示最終數字）；可再拍下一題
```

**不做**：卡通動物老師、說話 avatar、泛用 chatbot 隨便生成動畫、無限制 gen-video 數學物件、3Blue1Brown 複製品、純作業代答。

---

## 3. Competitor / comparable review（2026-09-08 研究脈絡）

| 產品 | 連結 | 形態 | 與本產品差異 |
|------|------|------|--------------|
| Photomath | https://photomath.com/ | 相機掃描 + 步驟解答；Plus 有動畫教學 | 偏 **solver／功課助手**；非「一題卡住 → 迷思導向換視覺模型」的課堂導演 |
| Mathway / Symbolab | （品牌站內搜尋可知） | 答案／步驟求解；步驟常付費牆 | **Answer solvers**；理解與粵語小學課程適配非核心 |
| Khan Academy / Khanmigo | khanacademy.org | 課程影片 + Socratic 導師 | 強課程／對話；**不是** photo→單一卡住題的自適應短視覺課 |
| Brilliant | brilliant.org | 互動謎題／直覺 | 偏年長／英語；非 HK 分數 MVP 相機流 |
| Math Learning Center Fractions | https://www.mathlearningcenter.org/apps/fractions | 免費開放式 bars/circles 操作 | 教師驅動操作器；**無**自適應教案引擎 |
| Synthesis Tutor / SplashLearn / Zearn | 各產品站 | 練習／遊戲平台 | 產品形狀不同：路徑練習 ≠ 單題視覺解釋引擎 |

來源取用日期：**2026-09-08**。不捏造市佔或下載量。

### 3.1 三类差異（務必分清）

1. **Answer solvers**（Photomath／Mathway／Symbolab）：核心交付「步驟+答案」。本產品核心交付「可驗證的理解經歷」。
2. **AI chat tutors**（Khanmigo 等）：對話式引導；未必有決定性數學視覺引擎與 photo→短課結構。
3. **Adaptive visual explanation systems（本產品）**：Teaching Brain 導演 + Visual Math Engine 決定性元件；exact math；迷思觸發換模型；粵語+繁中；HK P4–P5 分數三主題。

---

## 4. Precise MVP in / out of scope

### In scope
- HK **P4–P5**；**粵語**旁白；**繁體中文** UI；**mobile-first**
- 僅三主題：**等值分數**、**比較分數**、**異分母加法**
- 輸入：清晰**印刷**題照片 + **永遠可手動文字**；確認 OCR
- 輸出：30–60s 視覺、旁白、字幕、checkpoint、alt visual、transfer
- Exact rational arithmetic；OOS 優雅處理
- 垂直切片：`1/2+1/3` 分數條 → LCD 6 → checkpoint「唔好加分母」→ fallback 數線或摺紙

### Out of scope（v1）
- 手寫辨識；複雜應用文字題
- 異分母減、分數乘除、混合運算課
- 卡通老師／avatar／泛用 chatbot
- Unrestricted gen-video；LLM 直接畫數學物件
- 帳號體系、社交、人臉、長期雲端題庫追蹤（demo 免帳號）
- 分母 >12 的異分母加／比（拒題）
- 付費 API 綁定（允許日後 adapter）

---

## 5. Concept map summary

詳見 [FRACTION_CONCEPT_MAP.md](./FRACTION_CONCEPT_MAP.md)。

| 主題 | 課程 | 主視覺 | 關鍵迷思 |
|------|------|--------|----------|
| 等值 | 4N6 | FractionBar Transform | 上下加同數當等值 |
| 比較 | 4N6→5N2 準備 | 雙 Bar Align | 分母大就大 |
| 異分母加 | 5N2 | Bar Regroup→Combine | 分子分母分別相加 |

EDB KS2：  
- https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/EN_KS2_e.pdf  
- https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/EN_KS2_tc.pdf  

---

## 6. Misconception map summary

| ID | 現象 | 檢查點證據例 | Fallback |
|----|------|--------------|----------|
| EQ-M1 | 1/2 → 2/3「等值」 | 選 2/3 | PaperFold／Circle |
| CMP-M1 | 1/5 > 1/3 | 選 gt | NumberLine |
| ADD-M1 | 1/2+1/3=2/5 | 選 2/5 或「加分母」 | NumberLine／PaperFold |

引擎可用錯誤示範（標明唔啱）再對照正確 Regroup；禁止把錯當對渲染。

---

## 7. Visual grammar summary

詳見 [VISUAL_GRAMMAR.md](./VISUAL_GRAMMAR.md)。

- **元件 P0**：FractionBar、Label、NumberLine、PaperFold；（P1 FractionCircle）
- **動作**：Divide, Shade, Highlight, Move, Combine, Separate, Align, Compare, Regroup, Zoom, Label, Transform
- **安全**：渲染前 Rational 驗證；reduced-motion；色盲紋理

---

## 8. Full lesson-plan JSON schema（formal）

以下為 TypeScript-like interface + 等同 JSON Schema 欄位約束。實作時可 codegen；Phase 0 只定合約。

```typescript
/** Exact rational — never float for truth */
interface RationalJSON {
  numerator: number;      // integer
  denominator: number;    // integer > 0
  /** canonical reduced form optional cache */
  reduced?: { numerator: number; denominator: number };
}

type ConceptId =
  | "equivalent_fractions"
  | "compare_fractions"
  | "add_unlike_denominators";

type VisualModelId =
  | "fraction_bar"
  | "fraction_circle"
  | "number_line"
  | "paper_fold";

type OosReason =
  | "unparseable"
  | "handwriting_not_supported"
  | "word_problem_too_complex"
  | "concept_out_of_mvp"
  | "denominator_gt_12"
  | "verifier_failed";

interface MathProblem {
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

interface VerifiedSolution {
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

interface MisconceptionHypothesis {
  id: string;                       // e.g. "ADD-M1"
  concept: ConceptId;
  descriptionTc: string;
  descriptionEn: string;
  evidenceRules: string[];          // declarative predicates
  severity: "high" | "medium" | "low";
  preferredFallbackModel: VisualModelId;
}

interface NarrationSegment {
  id: string;
  tStartMs: number;
  tEndMs: number;
  cantoneseScript: string;          // spoken
  subtitleTc: string;               // on-screen written TC
  audioAssetId?: string;            // from TtsProvider; optional mock
}

interface AnimationAction {
  id: string;
  type:
    | "Divide" | "Shade" | "Highlight" | "Move" | "Combine" | "Separate"
    | "Align" | "Compare" | "Regroup" | "Zoom" | "Label" | "Transform";
  targetObjectIds: string[];
  tStartMs: number;
  tEndMs: number;
  params: Record<string, unknown>;  // e.g. { parts: 6, shade: 3 }
}

interface VisualObject {
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

interface LessonScene {
  id: string;
  order: number;
  durationMs: number;
  objects: VisualObject[];
  actions: AnimationAction[];
  narration: NarrationSegment[];
  purposeTc: string;                // e.g. "示範點解唔可以加分母"
}

interface Checkpoint {
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

interface LessonPlan {
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

interface ChildResponse {
  checkpointId: string;
  selectedChoiceId?: string;
  filledRational?: RationalJSON;
  comparison?: "lt" | "eq" | "gt";
  tf?: boolean;
  isCorrect: boolean;               // set by verifier, not LLM opinion
  respondedAtIso: string;
}

interface LearningSession {
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
```

### JSON Schema notes
- All denominators integers `>= 1`; MVP unlike-add/compare also `<= 12`.
- `confirmedByUser: true` gate before LessonPlan execution.
- `VerifiedSolution.exact` must be produced by local Rational module (`gcd`, LCD via lcm), never sole LLM output.
- Unknown `VisualObject.type` / `AnimationAction.type` → hard fail render.

### Minimal example（垂直切片 1/2+1/3 摘要）

```json
{
  "id": "plan-add-1_2-1_3",
  "concept": "add_unlike_denominators",
  "primaryModel": "fraction_bar",
  "fallbackModel": "number_line",
  "hypothesisIds": ["ADD-M1"],
  "checkpoint": {
    "promptTc": "計算 1/2+1/3 時，可唔可以將分母加埋變成 2/5？",
    "format": "tf",
    "correct": { "tf": false },
    "targetMisconceptionIds": ["ADD-M1"]
  },
  "transfer": {
    "promptTc": "試下：1/4+1/6＝？"
  }
}
```

---

## 9. ★ Minimal complete technical architecture（photo → visual explanation）

> **Priority answer #3** — 最小完整技術架構

### 9.1 Mermaid

```mermaid
flowchart TD
  subgraph Input
    CAM[Camera photo / Manual text]
    OCR[OcrProvider adapter<br/>mock | tesseract | cloud]
    CONF[User confirm / edit parse]
  end

  subgraph Brain["Teaching Brain (lesson director)"]
    PARSE[Problem parser]
    VER[MathVerifier Rational exact]
    DIAG[Misconception hypothesizer<br/>rules-first; LLM optional later]
    PLAN[LessonPlan builder]
  end

  subgraph VME["Visual Mathematics Engine"]
    SAFE[Math-safety gate]
    SVG[SVG/Canvas LEGO renderer]
    ANIM[AnimationAction timeline]
    SUB[Subtitle / WebVTT-like cues]
  end

  subgraph Audio
    TTS[TtsProvider adapter<br/>mock | server TTS]
  end

  subgraph UI
    PLAY[Mobile player + checkpoint]
    FB[Fallback LessonPlan]
    TR[Transfer question]
  end

  CAM --> OCR --> CONF --> PARSE --> VER
  VER -->|OOS| UI
  VER --> DIAG --> PLAN
  PLAN --> SAFE --> SVG --> ANIM --> PLAY
  PLAN --> TTS --> PLAY
  PLAN --> SUB --> PLAY
  PLAY -->|fail checkpoint| FB --> SAFE
  PLAY -->|pass| TR
```

### 9.2 Component list

| Component | Responsibility | Phase 0/1 |
|-----------|----------------|-----------|
| `OcrProvider` | image→text; mock returns fixture | Adapter |
| `ProblemParser` | text→`MathProblem.parsed` | Local rules |
| `MathVerifier` | `Rational`, gcd, lcm/LCD, steps | **Local only** |
| `TeachingBrain` | concept + hypotheses + `LessonPlan` | Rules template first; LLM director optional later |
| `VisualMathEngine` | validate + render SVG + timeline | Local |
| `TtsProvider` | script→audio asset | Mock first |
| `SessionStore` | anonymous `LearningSession` | Memory / localStorage |
| `OosGuard` | denominator/concept gates | Local |

### 9.3 Provider adapters（mock-first）

```typescript
interface OcrProvider {
  recognize(image: Blob): Promise<{ text: string; confidence: number; engine: "mock"|"tesseract"|"cloud" }>;
}
interface TtsProvider {
  synthesize(opts: { textYue: string; voice?: string }): Promise<{ audioUrl: string; engine: string }>;
  // API keys: server-side only — never in browser
}
```

- **OCR path**：mock fixture →（可選）本機 Tesseract →（可選）cloud Vision。現況 box：**未安裝 tesseract**（2026-09-08 檢查 `which tesseract` 無結果）→ 預設 mock；安裝後再接。
- **TTS path**：mock 靜音／預錄 → 伺服器轉 TopMediai／其他；瀏覽器不持金鑰。
- **不假設付費 API** 才能跑通垂直切片。

### 9.4 Exact-math verification strategy
- `class Rational { constructor(n,d); add; compare; eq; reduce; toString }` 用整數與 `gcd`。
- LCD = `lcm(d1,d2) = d1/gcd*d2`。
- 每個 `Label`／Shade 份數／Compare 結果必須對應 `VerifiedSolution` 步驟。
- LLM 若存在：只許填旁白／場景秩序建議；**答案與中間分數以 Verifier 為準**，衝突則拒用 LLM 數值。

### 9.5 Cantonese narration + subtitle strategy
- `NarrationSegment.cantoneseScript` + `subtitleTc` 寫死在 `LessonPlan`（可模板化）。
- Player 依 `tStartMs/tEndMs` 顯示字幕；音檔可缺。
- 格式目標：WebVTT-like（`start --> end\n字幕`）匯出以便除錯。
- 與 `AnimationAction` 時間軸同一時鐘。

### 9.6 Image-recognition options + limitations

| Option | Pros | Cons |
|--------|------|------|
| Mock | 可測旅程 | 非真 OCR |
| Tesseract local | 免費、隱私好 | 需安裝；印刷清晰才穩；數學式佈局弱 |
| Cloud Vision | 較準 | 費用、隱私、金鑰；兒童資料需小心 |

v1：**無手寫**；印刷不清 → 引導手動輸入。

---

## 10. ★ Which visual components + misconception rules the fraction MVP needs（Priority #2）

### 10.1 Visual components (MVP must-have)

| Component | Required | Used for |
|-----------|----------|----------|
| FractionBar | P0 must | Equivalent Transform; compare Align; unlike-add Regroup+Combine |
| Label | P0 must | All fraction / LCD / right-wrong labels |
| NumberLine | P0 must | Compare and add fallback |
| PaperFold | P0 must | Equivalent and 1/2+1/3 fallback narrative |
| FractionCircle | P1 | Optional alternate |
| CounterGroup | P2 | Not in MVP |

Required actions: Divide, Shade, Highlight, Align, Compare, Regroup, Combine, Transform, Label (Move/Separate/Zoom recommended).

### 10.2 Misconception rules (MVP)

1. ADD-M1 (highest): child answer or choice shows (a+c)/(b+d) or agrees add denominators -> primary lesson must include wrong-contrast + LCD Regroup; on checkpoint fail use NumberLine or PaperFold.
2. EQ-M1: equivalent choice (a+k)/(b+k) -> Bar subdivide vs wrong +1; fallback PaperFold.
3. CMP-M1: same numerator, picks larger denominator as larger -> dual Bar + Highlight length; fallback NumberLine.
4. CMP-M2: compares numerators only -> force common denominator or equal wholes.
5. EQ-M3: answers without counting cells -> checkpoint requires counting shaded parts.
6. ADD-M2: converts only one addend -> Highlight misaligned parts.

Each rule emits MisconceptionHypothesis.id + preferredFallbackModel. Checkpoint must target the lesson primary hypothesis. See FRACTION_CONCEPT_MAP and VISUAL_GRAMMAR sections 6-8.

---

## 11. ★ How to run the first Wizard of Oz test（Priority #1）

### 11.1 目標
在**無正式 app**下驗證兒童旅程能否產生「理解」而非只抄答案；收集迷思、旁白速度、視覺清晰度。

### 11.2 Roles
| 角色 | 誰 | 職責 |
|------|----|------|
| Child | P4–P5 兒童 1–3 名 | 作答、講「點解」 |
| Wizard（導演） | 成人操作員 | 依腳本出示視覺卡／播旁白；選 primary／fallback |
| Observer | 另一成人 | 計時、勾迷思、不提示答案 |
| Guardian | 家長 | 知情同意；可幫持機拍照（可選） |

### 11.3 Materials
- 下列 **10 題卡** + 正確 VerifiedSolution 速查
- Primary 視覺紙卡／簡報（FractionBar 步驟；可手繪或預先 SVG 截圖）
- Fallback 卡：NumberLine、PaperFold
- 粵語旁白稿（朗讀或預錄 mock）
- 繁中字幕條（紙或第二螢幕）
- Checkpoint 題板、計分表、碼錶
- 手機「假裝 OCR」：兒童拍照後 Wizard **口頭確認**題目（模擬 confirm）

### 11.4 Step-by-step protocol
1. **知情**：向家長說明免帳號、不存人臉、可隨時停。
2. **熱身**（2 min）：非計分走完「確認題目→看動畫（紙上翻頁）→檢查點」。
3. **對每題**：
   1. 兒童出示印刷題或讀出；Wizard 複述並請兒童確認「係唔係呢題？」。
   2. 出示 **primary** 視覺序列（旁白目標 30–60s）。
   3. **Checkpoint**；Observer 記對／錯與口語迷思。
   4. 若錯：換 **fallback** 模型重講（不可重播同一套圖）。
   5. **Transfer** 題；記對錯與遷移是否成功。
4. **停損**：煩躁／單題逾 8 min → 跳題。
5. **Debrief**：問「邊一步幫到你？」「邊度仲亂？」

### 11.5 Scoring
每題記錄：`confirm_ok`, `primary_watch_sec`, `checkpoint_pass`, `fallback_used` / `fallback_pass`, `transfer_pass`, `misconception_codes[]`, `narration_too_fast`。

**Session 初版成功標**：
- ≥7/10 checkpoint 最終通過（含 fallback 後）
- ≥5/10 transfer 通過
- ADD-M1 相關題（含 1/2+1/3）在 fallback 後通過率 ≥2/3 兒童

### 11.6 TEN real fraction questions

| # | Question | Concept | Primary visual | Fallback | Notes |
|---|----------|---------|----------------|----------|-------|
| 1 | `2/4 = ?/8` | equivalent | FractionBar | PaperFold | 填空 |
| 2 | `1/3` 同邊個等值？`2/6` / `2/3` / `3/3` | equivalent | FractionBar | Circle/PaperFold | EQ-M1 誘答 2/3 |
| 3 | `2/5 = 4/10`？（是非） | equivalent | FractionBar | PaperFold | |
| 4 | 比較 `1/4` ○ `1/3` | compare | 雙 Bar | NumberLine | CMP-M1 |
| 5 | 比較 `3/8` ○ `1/2` | compare | 雙 Bar | NumberLine | |
| 6 | 比較 `2/5` ○ `2/3` | compare | 雙 Bar | NumberLine | 同分子 |
| 7 | **`1/2+1/3=?`** | add unlike | FractionBar→LCD6 | NumberLine 或 PaperFold | **垂直切片**；誘答 2/5 |
| 8 | `1/4+1/6=?` | add unlike | FractionBar→LCD12 | NumberLine | |
| 9 | `2/5+1/10=?` | add unlike | FractionBar | NumberLine | |
| 10 | `1/3+1/6=?` | add unlike | FractionBar | PaperFold | 可化簡 1/2 |

每題 checkpoint 針對表定迷思；transfer 用換數字或改數線問位置。

---

## 12. Child privacy / safety
- MVP demo: no account required; LearningSession.anonymous = true
- Photos ephemeral for recognition only; no facial recognition storage
- Minimal PII; real name/school not hard-gated
- Parental note: purpose, skip camera for manual input, data clearable
- Cloud TTS/OCR if enabled: server-side keys only, minimize transfer, disclose in-product
- No open-ended unrelated chat; graceful OOS refusals

---

## 13. Measurable success criteria
Phase 0 docs: all six files, complete schema, ten WoZ questions, three priority sections.
WoZ / later MVP demo:
- Vertical slice 1/2+1/3 full path (confirm to transfer)
- Checkpoint targets ADD-M1; fail uses different visual model
- Displayed fractions match Verifier (spot-check zero error)
- Visual duration 30-60s (+/-10s OK)
- Child can indicate need for common denominator, not only recite 5/6

---

## 14. Major risks, effort estimate, unresolved decisions

### Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| OCR poor print/lighting | High friction | Force confirm + manual-first |
| Cantonese TTS quality/cost | Medium | Mock/prerecord; adapter |
| Thin misconception rules | Wrong pacing | WoZ enrich rules; LLM later |
| Visual denser than 60s | Attention loss | Scene caps; trim narration |
| Seen as answer-only app | Brand drift | UI stresses understanding |
| Denominator<=12 complaints | Refusals | Explain MVP scope in copy |

### Effort (rough person-weeks)
- Phase 0 docs: this batch; live WoZ scheduling separate
- Phase 1 scaffold + Rational + mock vertical slice: 2-4
- Phase 2 OCR/TTS/three-topic expansion: 4-8

### Unresolved
- Built-in same-denominator add micro-lesson before unlike-add?
- Sum >1 display: improper vs mixed number
- Phase 1 Origin repo name / monorepo (D-007)
- Teaching Brain v1: pure rules vs light LLM (recommend rules first)
- Production Cantonese TTS vendor evaluation

---

## 15. Staged development backlog

### Phase 0 (now)
- [x] Blueprint / concept map / visual grammar / decisions / progress / README
- [ ] Stakeholder APPROVE PHASE 0
- [ ] Run WoZ (protocol ready)

### Phase 1 (after approval)
- TS + Next.js + SVG + Rational module (pending env confirm)
- Mock OCR/TTS adapters
- Vertical slice 1/2+1/3 playable + checkpoint + fallback
- Manual input primary; camera later

### Phase 2
- Equivalent + compare full templates
- Tesseract or cloud OCR; server TTS
- Item bank + hypothesis expansion
- A11y + reduced-motion hardening

---


## 16. Capabilities audit (box as of 2026-09-08 HKT)

| Capability | Now | Notes |
|-|--|--|
| Node | v20.19.2 | OK for Next.js later |
| Python | 3.13.5 | Docs/scripts/Rational prototype |
| npm | available | Phase 1 |
| /workspace scratch | Yes | Project root here |
| Run code / write files | Yes | |
| Read images (PIL) | may be present | Not hard dependency |
| Browser via computerUse | Yes | Asset preview |
| WebSearch / WebFetch | Yes | Curriculum checks |
| Tesseract OCR | Not installed | Adapter; mock first |
| Production app | None | Phase 0 only |
| Paid APIs | Not required | mock-first |
| Cantonese TTS | No browser keys | Adapter + mock |

---

## 17. Cross-links and gate

- FRACTION_CONCEPT_MAP.md
- VISUAL_GRAMMAR.md
- DECISIONS.md
- PROGRESS.md
- ../README.md

GATE: wait for APPROVE PHASE 0 before any production implementation.

Principle: 答案只係結果，理解先係產品。
