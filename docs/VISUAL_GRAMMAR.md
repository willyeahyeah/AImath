# VISUAL_GRAMMAR.md — 視覺語法（Visual Mathematics Engine）

本文件定義 **可重用、決定性** 的 SVG/Canvas「LEGO」元件與動作。AI／Teaching Brain 只產出 `LessonPlan`；引擎依 grammar 渲染，禁止 LLM 直接生成任意數學圖形或 unrestricted video。

語言：元件／動作名用英文（對齊 schema）；教學說明用繁體中文。

---

## 1. 設計原則

1. **Deterministic**：同樣 `VisualObject` + `AnimationAction` 序列 → 像素級可重現（允許字型微差）。
2. **Math-safe**：每個分數標籤、陰影份數、刻度必須由 `Rational` 驗證後才 render。
3. **Primary + Fallback**：每課至少一主視覺、一備援模型（見概念圖）。
4. **Mobile-first**：預設畫布約 360×640 邏輯座標；觸控熱區 ≥ 44px。
5. **Reduced motion**：尊重 `prefers-reduced-motion`；動作改為瞬間切換 + 靜態標註。
6. **Not in grammar**：卡通動物、說話頭像、裝飾性無關動畫、3B1B 風格連續相機漫遊（可有限 Zoom）。

---

## 2. 可重用元件（Visual Components）

### 2.1 FractionBar（分數直條／橫條）— **MVP 主模型**
- **結構**：矩形被均分成 `denominator` 等份；`numerator` 份著色（shade）。
- **變體**：horizontal（預設）、vertical。
- **標籤**：上方或右側顯示 `a/b`（TC 亦可旁註「2 份入面嘅 1 份」）。
- **多條**：可並排兩條以比較或等值；等值時用 Align + 虛線對齊。
- **異分母加法**：兩條 → 各自 Regroup 到 LCD 等份 → Combine 成長條或並排放入「和」區。
- **數學約束**：`0 ≤ numerator ≤ denominator`（不當分數 MVP 可允許 > den 但 v1 建議先拒 OOS）；`denominator ∈ 1…12`（MVP）。

### 2.2 FractionCircle（分數圓）
- **結構**：圓盤扇形分割；扇形數 = denominator；著色扇形 = numerator。
- **用途**：等值、比較（同圓大小）；異分母加時次選（扇形切到 6、12 仍可讀）。
- **限制**：分母 > 12 難讀 → MVP 直接 OOS 或改 Bar。

### 2.3 NumberLine（數線）— **常用 fallback**
- **結構**：水平線、起點 0、終點 1（或 0–2 若和可能 >1）；刻度依當前分母／LCD。
- **標記**：實心點或括弧標示分數位置；比較用兩個標記 + Compare。
- **加法**：兩段向量首尾相接（Jump）或兩點標註後標和。
- **約束**：刻度標籤必須是驗證過的 `Rational.toString()`；禁止「目測」位置。

### 2.4 PaperFold（摺紙模型）— **fallback**
- **結構**：矩形紙示意對摺／均分；摺痕 = 等份邊界；著色區域 = 部分。
- **用途**：等值（半張再對摺成四分之一）；直觀「份數變多、每份變小」。
- **限制**：複雜異分母加較難；適合作 1/2+1/3 的「想像再切」敘事輔助，精密計算仍回 Bar + LCD。

### 2.5 CounterGroup（可選，後期）
- **結構**：離散計數物分組（如 6 粒珠分 2 組）。
- **MVP**：不做；列為 Phase 2+。

### 2.6 Label
- **結構**：文字錨點（TC 數字／分數／短句）。
- **規則**：分數寫法一律 `分子/分母` 或上下堆疊；旁白用粵語口語，字幕用書面繁中短句。
- **安全**：任何顯示數值 ∈ VerifiedSolution 或中間驗證步驟。

---

## 3. 動作（AnimationAction types）

| Action | 作用於 | 說明 | 典型時長 |
|--------|--------|------|----------|
| `Divide` | Bar/Circle/Paper | 均分成 n 份（顯示分割線） | 400–800ms |
| `Shade` | 份區塊 | 著色 k 份 | 300–600ms |
| `Highlight` | 任一物件／份 | 描邊或脈衝強調（reduced-motion：靜態粗框） | 200–400ms |
| `Move` | 物件 | 平移到目標區 | 400–700ms |
| `Combine` | 兩著色區 | 合併為和（視覺相接） | 500–900ms |
| `Separate` | 一區 | 拆回部分（糾錯示範） | 500–800ms |
| `Align` | 多 Bar／刻度 | 對齊以便比較或看等值 | 400–600ms |
| `Compare` | 兩標記／兩 Bar | 顯示 >, <, = | 400–700ms |
| `Regroup` | Bar/Circle | 重切到 LCD 等份並保持同一有理值 | 600–1000ms |
| `Zoom` | 畫布／局部 | 有限縮放（≤1.5×）；非漫遊長鏡頭 | 300–500ms |
| `Label` | 錨點 | 淡入文字／分數 | 200–400ms |
| `Transform` | 等值對 | 明確「值不變、表示變」的變形（Bar 細分） | 600–1000ms |

**組合規則**：一場景 ≤ 6 個主要 Action；總視覺 30–60s（含旁白）。Checkpoint 期間暫停動畫。

---

## 4. 時序與旁白對齊

- `LessonScene.durationMs`：場景總長。
- 每個 `AnimationAction` 有 `tStartMs` / `tEndMs`（相對該場景）。
- 每個 `NarrationSegment` 有 `tStartMs` / `tEndMs` + `cantoneseScript` + `subtitleTc`。
- 字幕格式目標：WebVTT-like cues，與 Action 時間戳對齊（允許 ±150ms）。
- **無 TTS 時**：仍顯示字幕；可播靜音 + 進度條。

### Reduced-motion
若開啟：跳過 Move/Combine 插值，改為結束狀態靜幀 + Label；Highlight 不用閃爍。

---

## 5. 色彩與無障礙

- **著色 A（分數 1）**：藍 `#2563EB`；**著色 B**：橙 `#EA580C`；和／結果：紫 `#7C3AED` 或 A+B 紋理。
- **對比**：文字與背景 WCAG AA；色盲安全：不只靠顏色，加斜線／點紋區分 A/B。
- **焦點**：鍵盤／讀屏後期；MVP 至少有可見 focus ring 於 checkpoint 選項。
- **禁止**：紅＝錯／綠＝對作為唯一通道（可搭配圖示 ✓ ✗）。

---

## 6. 渲染前數學安全檢查（Math-safety gate）

引擎在 `render(scene)` 前必須全部通過，否則拒畫並回報 Teaching Brain：

1. 每個 `VisualObject` 的 `numerator`/`denominator` 為整數，`denominator > 0`。
2. `Rational(numerator, denominator)` 化簡後與 `VerifiedSolution` 步驟一致（允許未化簡顯示，若教案標記 `displayUnsimplified: true`）。
3. `Regroup` 目標分母必須是原分母的整數倍（等值）。
4. `Shade` 份數 ≤ 當前分割數。
5. NumberLine 上點的位置 = `value = num/den`，誤差僅浮點繪圖（邏輯用 exact rational）。
6. Compare 結果 ∈ {lt, eq, gt} 必須等於 `Rational.compare`。
7. Combine（加法）結果 = 驗證過的和；**絕不**渲染「分子加分子、分母加分母」為正確結果（可用作迷思示範並標紅「唔啱」）。

---

## 7. MVP 元件優先級

| 優先 | 元件 | 用途 |
|------|------|------|
| P0 | FractionBar, Label | 三主題主視覺 |
| P0 | NumberLine | 比較／加法 fallback |
| P0 | PaperFold | 等值／1/2+1/3 fallback 敘事 |
| P1 | FractionCircle | 等值／比較備選 |
| P2 | CounterGroup | 暫緩 |

## 8. MVP 必備 misconception → 視覺規則（摘要）

詳見 FRACTION_CONCEPT_MAP；grammar 層要支援：

- **加分母**（1/2+1/3→2/5）：示範錯誤 Combine 標「錯」，再 Regroup 到六等份正確加。
- **比分子唔睇分母**：Align 兩 Bar 同高，Highlight 實際長度。
- **等值＝兩邊加同一個數**：Transform 細分 vs 錯誤「+1/+1」對照。
- **越大分母越大**：同分子不同分母 Bar 並排 Compare。

---

## 9. 與 LessonPlan 的對應

`VisualObject.type` ∈ `fractionBar | fractionCircle | numberLine | paperFold | label | counterGroup`  
`AnimationAction.type` ∈ 上表。  
未知 type → 引擎拒絕，不靜默忽略。


---

## 10. Worked example grammar: 1/2 + 1/3 (vertical slice)

Target duration: ~45s primary path.

| t (ms) | Action | Objects | Narration (Yue / TC subtitle) |
|--------|--------|---------|-------------------------------|
| 0-3000 | Label + Shade | barA (1/2), barB (1/3) | 睇下：一半加三分之一 / 先睇兩個分數 |
| 3000-8000 | Highlight | wrong demo 2/5 flash | 有人會將分母加埋變 2/5，咁樣唔啱 / 唔可以分子分母分別相加 |
| 8000-16000 | Regroup | barA→6ths (3/6), barB→6ths (2/6) | 要切成一樣大嘅一份，公分母係 6 / 化成六等份 |
| 16000-24000 | Align + Combine | sum bar 5/6 | 三份加兩份等於五份 / 3/6+2/6=5/6 |
| 24000-30000 | Label result | label 5/6 | 所以 1/2+1/3=5/6 |
| pause | Checkpoint | TF: 可唔可以做 2/5？ | correct=false (ADD-M1) |
| on fail | switch model | NumberLine jumps or PaperFold | different visual, not same bar replay |

Math-safety: every shade count and label must equal VerifiedSolution steps (LCD=6, 3/6, 2/6, 5/6).

---

## 11. Component JSON sketch

```json
{
  "id": "barA",
  "type": "fractionBar",
  "model": "fraction_bar",
  "math": { "numerator": 1, "denominator": 2 },
  "layout": { "x": 24, "y": 80, "w": 312, "h": 48 },
  "style": { "fillRole": "A", "pattern": "solid" }
}
```

Engine rejects render if `math.denominator` is 0, non-integer, or shade params exceed parts after Divide/Regroup.
