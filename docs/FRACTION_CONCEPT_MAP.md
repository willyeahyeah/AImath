# FRACTION_CONCEPT_MAP.md — 分數概念圖（MVP）

範圍：**等值分數**、**比較分數**、**異分母加法**。HK 小學 P4–P5；粵語教學語言；繁中 UI。  
對齊香港教育局小學數學課程（KS2）公開文件（取用日期 2026-09-08）：

- EN: https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/EN_KS2_e.pdf
- TC: https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/ma/curr/EN_KS2_tc.pdf

單元對應（文件內編號）：
- **4N6 Fractions II（小四）**：等值分數；同分母加減等（本 MVP 取等值與比較基礎）。
- **5N2 Fractions III（小五）**：異分母加減；簡單異分母加減之分母不宜超過 12（沿用較舊單元筆記之實務上限，本產品採為 MVP 硬限制）。

原則：答案只係結果，理解先係產品。

---

## 0. 總覽概念依賴

```text
整數均分概念
    ↓
分數意義（a/b = 把整體分 b 份取 a 份）
    ↓
等值分數 (equivalent)  ←——  比較分數 (compare)
    ↓                              ↓
    └──────── 異分母加法 (add unlike) ────────┘
                    ↑
              求 LCD / 公分母
```

**Out of scope**：異分母減法、分數乘除、帶分數運算（可識別後 OOS）、複雜應用題、手寫題、分母 > 12 的異分母加。

---

## 1. 等值分數（Equivalent Fractions）

### 1.1 Learning goals（學習目標）
- 兒童能解釋：同一份量可用不同分數表示（值不變，份數變細／變粗）。
- 能用「上下同乘／同除一非零整數」生成等值分數（MVP 以視覺細分為主，符號規則為旁白強化）。
- 能判斷兩分數是否等值（含簡易化簡）。

### 1.2 Prerequisites
- 認識分數表示 `a/b`（b≠0）；整體 1 的意義。
- 能數均分格；理解「份數越多，每份越小」。

### 1.3 HK curriculum alignment
- **4N6 Fractions II**：equivalent fractions。
- 課堂常用視覺：長條、圓、摺紙。

### 1.4 Common misconceptions + observable evidence rules

| ID | 迷思 | 可觀察證據（規則） | 介入 |
|----|------|-------------------|------|
| EQ-M1 | 分子分母「上下加同一個數」仍等值（1/2→2/3） | 兒童選擇／輸入等值時對 `a/b` 做 `a+k)/(b+k)`；或 checkpoint 選 2/3 為 1/2 等值 | 對照 Bar：細分 Transform vs 錯誤加一；標「值變咗」 |
| EQ-M2 | 分母越大分數越大（忽略分子） | 比較 1/4 與 1/2 時選 1/4 較大 | 見比較主題；等值課用同分子序列演示 |
| EQ-M3 | 只睇圖形「樣近」就當等值 | 未數格就答相等 | 強制 Label 份數 + 數格 Highlight |
| EQ-M4 | 化簡＝隨便刪數字 | 4/6 → 2/3 以外錯誤；或 16/64→1/4 用刪 6 | MVP 限小分母；強調同除公因數（gcd）視覺合併格 |

**Evidence DSL（教案用）**：`hypothesis.evidenceRules[]` 例：
- `answerEquals("2/3") && promptWas("equivalentOf","1/2")` → EQ-M1
- `compareChoice("1/4","1/2")=="gt"` → EQ-M2

### 1.5 Preferred visual models
- **Primary**：FractionBar — 一條 1/2 著色 → Divide 變 2/4、3/6…（Transform + Label）
- **Fallback**：PaperFold（對摺）或 FractionCircle
- **Avoid as primary**：未標刻度的裝飾圖

### 1.6 Checkpoint templates
- **選擇**：邊個同 `1/3` 等值？`2/6` / `2/3` / `1/6`
- **是非**：`2/4` 同 `1/2` 一樣多？（要解釋點解）
- **填空（手動）**：`2/8 = ?/4`（答案 1）
- **通過準則**：一次答對；或錯後看完 fallback 再對。

### 1.7 Transfer patterns
- 換表徵：Bar 學會後用 Circle 問同一等值。
- 換數字：`2/5 = ?/10`
- 反向：已知 `3/6`，化簡到最簡。

---

## 2. 比較分數（Comparing Fractions）

### 2.1 Learning goals
- 能比較兩真分數大小（MVP：同分母；或異分母但可經等值到公分母／或同分子；分母 ≤12）。
- 能用視覺（Bar 對齊或數線）說明「邊個較大」。
- 能寫出 `<` `>` `=`。

### 2.2 Prerequisites
- 分數意義；建議已接觸等值（異分母比較時）。

### 2.3 HK curriculum alignment
- 小四 4N6 起建立分數大小直覺；小五延伸至異分母情境（與 5N2 準備相關）。
- MVP 明確支援：
  - 同分母比分子
  - 同分子比分母
  - 異分母：化至公分母再比（分母 ≤12）

### 2.4 Common misconceptions + evidence

| ID | 迷思 | 可觀察證據 | 介入 |
|----|------|------------|------|
| CMP-M1 | 分母大就大 | 選 `1/5 > 1/3` | 同分子兩 Bar Align + Compare |
| CMP-M2 | 分子大就大（忽略分母） | `2/5` vs `2/3` 選 2/5 較大僅因「一樣分子」錯理，或 `3/8` vs `1/2` 只比 3>1 | 化公分母或數線 |
| CMP-M3 | 差距分子＝差距大小 | 認為 3/4−1/4 與 5/6−3/6「一樣遠」就結論整體一樣大（進階；MVP 可輕觸） | NumberLine 距離 |
| CMP-M4 | 對「整体」基準不一致 | 兩圖整體大小不同就亂比 | 引擎強制整體等寬／等半徑 |

### 2.5 Preferred visual models
- **Primary**：兩條等長 FractionBar Align + Compare
- **Fallback**：NumberLine（0–1）兩點
- **Optional**：FractionCircle 同半徑

### 2.6 Checkpoint templates
- `3/8` ○ `1/2`（填 < > =）
- 邊個較大：`2/5` 定 `3/7`？（先求公分母或用視覺）
- 「點解 1/4 < 1/3？」開放短答（WoZ 人工評；app 可用選擇題：「每份細啲因為分得多啲」）

### 2.7 Transfer patterns
- 數字換大但仍 ≤12：`5/12` vs `1/2`
- 表徵轉換：Bar → NumberLine
- 等值橋：先確認 `2/4=1/2` 再比 `2/4` 與 `3/8`

---

## 3. 異分母加法（Adding Unlike Denominators）

### 3.1 Learning goals
- 理解不能直接加分母；要先變成「同樣大嘅一份」（公分母／LCD）。
- 能求兩分母 ≤12 的 LCD（或公分母），寫出等值分數再加分子。
- 能解釋 `1/2+1/3=5/6` 的視覺意義。
- **垂直切片**：`1/2+1/3` → Bars → LCD 6 → checkpoint「唔可以加分母」→ fallback 數線或摺紙 → transfer 題。

### 3.2 Prerequisites
- 等值分數；同分母加法（若兒童未會同分母加，先短前測或 OOS 提示「呢題超前」—— unresolved：是否內建同分母加微課，見 DECISIONS 未決）。

### 3.3 HK curriculum alignment
- **5N2 Fractions III**：addition/subtraction of fractions with unlike denominators。
- 實務：簡單題分母不超過 12。

### 3.4 Common misconceptions + evidence

| ID | 迷思 | 可觀察證據 | 介入 |
|----|------|------------|------|
| ADD-M1 | 分子加分子、分母加分母（1/2+1/3=2/5） | 答案 `2/5`；或 checkpoint 選「分母加埋」 | **必做**：錯誤示範標紅 → Regroup 到六等份 → 3/6+2/6=5/6 |
| ADD-M2 | 只化其中一個分母 | 1/2+1/3→3/6+1/3 就停 | Highlight 未對齊的份 |
| ADD-M3 | LCD 當「兩數相乘」唯一法且算錯 | 4 同 6 當成 LCD=24 後運算錯亂；或 2,3 乘積啱但程序錯 | 用細 Bar 展示最小公分母 6 已夠 |
| ADD-M4 | 和可以 >1 就放棄或亂化帶分數 | 2/3+3/4 | MVP：若和 >1，可顯示假分數或簡易帶分數標籤；複雜帶分數運算 OOS |
| ADD-M5 | 混淆等號兩邊 | 寫 1/2+1/3=1/5 | 回到意義：兩段合併 |

### 3.5 Preferred visual models
- **Primary**：FractionBar ×2 → Regroup(LCD) → Combine → Label 和
- **Fallback A**：NumberLine jumps
- **Fallback B**：PaperFold 敘事（半張 + 三分一；再想像切成六）
- **Circle**：可作第二備援，非必須

### 3.6 Checkpoint templates
- 「計 1/2+1/3，可唔可以做 (1+1)/(2+3)=2/5？」→ 否 + 正解 5/6
- 填空：1/2=□/6，1/3=□/6，和＝□/6
- 程序選擇：下一步應該係？(a) 加分母 (b) 找公分母 (c) 加小數)

### 3.7 Transfer patterns
- `1/4+1/6`（LCD 12）
- `2/5+1/10`
- 表徵：同一題改 NumberLine 問「跳完去邊？」
- 比較連結：先比 1/2 與 1/3，再問加起來

---

## 4. 跨主題 Misconception Map 摘要

| 主題 | 最高優先迷思 | 主視覺 | Fallback |
|------|--------------|--------|----------|
| 等值 | EQ-M1 上下加同數 | Bar Transform | PaperFold |
| 比較 | CMP-M1 分母大就大 | 雙 Bar Align | NumberLine |
| 加法 | ADD-M1 分母相加 | Bar Regroup+Combine | NumberLine / PaperFold |

Teaching Brain 應依 checkpoint／輸入命中 hypothesis，選擇 **不同視覺模型** 重講（唔好只重複同一動畫）。

---

## 5. 題目輸入約束（概念層）
- 只接受清晰印刷／手動 `LaTeX-like` 或純文字：`1/2+1/3`、`比較 3/8 同 1/2`、`2/4=?/8`
- 解析後必須 `MathVerifier` 產出 `VerifiedSolution`；失敗 → 優雅 OOS。
- 分母 >12（異分母加／比）→ OOS 訊息（TC）：「呢題超出而家練習範圍（分母大過 12）。」

---

## 6. Checkpoint → Fallback → Transfer 流程（概念）

```text
Concept ID + VerifiedSolution
    → LessonPlan (primary visual)
    → Checkpoint (targeted misconception)
         ├─ pass → Transfer question (new numbers / new model)
         └─ fail → Alt LessonPlan (fallback visual) → re-check → Transfer
```

---

## 7. 未決（概念層）
- 是否在異分母加之前強制內建「同分母加」30 秒微課。
- 假分數／和 >1 的顯示形式（假分數 vs 帶分數）。
- 比較題是否允許三個分數排序（建議 Phase 2）。
