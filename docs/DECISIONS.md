# DECISIONS.md — 決策紀錄

日期基準：2026-09-08（Asia/Hong_Kong）。狀態標記：`proposed` / `pending-approval` / `accepted` / `rejected`。

---

## D-001 — Phase 0 僅文件、不寫 production code
- **日期**：2026-09-08
- **狀態**：proposed → 建議 accepted（文件完成後仍 pending `APPROVE PHASE 0`）
- **選項**：
  1. 邊寫 blueprint 邊 scaffold Next.js
  2. 嚴格 Phase 0 文件 → 批准後再 Phase 1
- **建議**：選項 2。避免未對齊教學語法就鎖死實作細節。
- **影響**：本目錄只有 markdown；無 app/、無 API keys。

## D-002 — 技術棧偏好（Phase 1 待環境確認）
- **日期**：2026-09-08
- **狀態**：pending-approval
- **選項**：
  1. **TypeScript + Next.js + SVG/Canvas + 本地 Rational 模組**（建議）
  2. Python FastAPI + React SPA
  3. 純靜態 HTML + 手寫 SVG
- **建議**：選項 1。理由：行動優先、SSR/靜態皆可、SVG 易做「LEGO」視覺件、TS 型別可對齊 LessonPlan schema。
- **未決**：Phase 1 啟動前確認 box / CI 上 Node 20+、套件授權、是否用 Origin 新 repo。

## D-003 — Mock-first provider adapters
- **日期**：2026-09-08
- **狀態**：proposed
- **選項**：
  1. 一開始接付費 OCR/TTS/Vision
  2. **Adapter 介面 + mock 實作優先**；本機 Tesseract / 免費層 / 雲端晚接
- **建議**：選項 2。不假設必須付費 API；金鑰永不進瀏覽器。
- **實作約定**：`OcrProvider`、`TtsProvider`、`LessonDirector`（可 mock）、`MathVerifier`（必為本地 exact rational，不可 mock 出錯誤答案）。

## D-004 — 不假設付費 API
- **日期**：2026-09-08
- **狀態**：proposed
- **建議**：開發與 WoZ 全程可用 mock；雲端僅作可選升級。文件與 README 不寫死供應商合約。

## D-005 — Mobile-first UI
- **日期**：2026-09-08
- **狀態**：proposed
- **建議**：主要觸控路徑為直向手機；桌面為次要。視覺場景設計以單欄、大觸控目標為準。

## D-006 — 粵語 TTS 經 adapter
- **日期**：2026-09-08
- **狀態**：proposed
- **選項**：
  1. 瀏覽器 Web Speech（品質不穩、粵語支援不一）
  2. **Adapter：mock 音檔 → 之後 TopMediai / 其他粵語 TTS**（金鑰只在伺服器）
  3. 真人預錄（WoZ 可用）
- **建議**：介面固定；MVP demo 用 mock 或預錄；正式 TTS 延後。字幕（TC）與 `AnimationAction` 時間戳對齊，即使無音檔也可讀。

## D-007 — Phase 1 程式碼放 Origin / 新 repo
- **日期**：2026-09-08
- **狀態**：pending-approval
- **建議**：Phase 1 起新 private Origin（或使用者指定 SCM）repo；本 `/workspace/visual-math-learning` 可作為文件來源搬移，不預設鏡射到 GitHub 僅為部署。
- **未決**：repo 名稱、是否 monorepo（docs+app）。

## D-008 — MVP 題型嚴格限縮
- **日期**：2026-09-08
- **狀態**：proposed
- **範圍**：只做 (1) 等值分數 (2) 比較分數 (3) 異分母加法。手寫、複雜應用題、減法／乘法／除法分數、超過分母 12 的異分母加減 → out of scope。
- **建議**：接受。與 EDB KS2 4N6 / 5N2 對齊（見 FRACTION_CONCEPT_MAP）。

## D-009 — 雙引擎：Teaching Brain + Visual Mathematics Engine
- **日期**：2026-09-08
- **狀態**：proposed
- **建議**：AI（或規則）只做「課堂導演」產出 LessonPlan；所有分數標籤與結果由 exact Rational 驗證；畫面由決定性 SVG/Canvas 元件組裝，禁止 LLM 直接畫數學物件或生成無限制影片。

## D-010 — OCR：確認後才進教學
- **日期**：2026-09-08
- **狀態**：proposed
- **建議**：任何相機／圖片輸入必須顯示「辨識結果」讓兒童／家長確認或改成手動輸入；v1 手動文字永遠可用。手寫 OCR out of scope。

## D-011 — Wizard of Oz 作為 Phase 0 出口驗證
- **日期**：2026-09-08
- **狀態**：proposed
- **建議**：用 10 題真題 + 人工導演腳本驗證旅程，再批准 Phase 1。見 PROJECT_BLUEPRINT「How to run the first Wizard of Oz test」。

## D-012 — 隱私：MVP demo 免帳號
- **日期**：2026-09-08
- **狀態**：proposed
- **建議**：不收集人臉、不存照片作辨識庫、最少 PII；session 可本機暫存。家長說明寫入產品內文案。

---

## 待批准閘門
完成 Phase 0 文件後，需明確指令 **`APPROVE PHASE 0`** 才可開始 Phase 1 scaffold。


## D-007 update（2026-09-08）
- **狀態**：accepted
- **決定**：https://github.com/willyeahyeah/AImath
- Phase 0 docs 暫存 /workspace/visual-math-learning/；批准後搬入該 repo。


## D-014 — Phase 1 垂直切片完成
- **日期**：2026-09-08
- **狀態**：completed
- **交付**：
  - Next.js + TypeScript + Tailwind 專案
  - Rational 類（exact gcd/lcm）+ MathVerifier
  - Teaching Brain（Parser, Misconceptions, LessonPlanBuilder）
  - Visual Math Engine（SVG 渲染）
  - Mock OCR/TTS adapters
  - 完整 UI 流程（輸入→確認→教學→檢查點→fallback→遷移）
  - 38 個單元測試（全部通過）
  - E2E 測試架構
  - 響應式手機優先 UI
  - 繁中+英文 README
- **驗證**：
  - ✅ 1/2+1/3=5/6（精確）
  - ✅ LCD(2,3)=6
  - ✅ 拒絕 2/5
  - ✅ ADD-M1 檢查點
  - ✅ 遷移題 1/4+1/6
  - ✅ 模擬 OCR/TTS 清楚標記
- **分支**：cursor/phase1-vertical-slice-e206
