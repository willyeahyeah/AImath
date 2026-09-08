# 視覺數學學習 / Visual Math Learning

香港小學分數視覺學習 App — Phase 1 垂直切片實作

## 原則

> 「答案只係結果，理解先係產品。」

## Phase 1 實作完成

✅ 完整的 1/2+1/3 垂直切片，包括：
- 手動輸入（永遠可用）
- 相機/上傳介面（標記為模擬）
- 確認辨識結果
- 精確分數驗算（本地 Rational 模組）
- 結構化教案生成
- 確定性 SVG 分數條動畫
- 粵語旁白腳本 + 繁中字幕（TTS 模擬）
- 播放控制（播放、暫停、重播）
- ADD-M1 檢查點（不能加分母）
- 失敗時替代視覺路徑（NumberLine）
- 遷移題（1/4+1/6）
- 響應式手機優先介面

## 快速開始 / Quick Start

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 測試

```bash
# 單元測試
npm test

# 測試覆蓋率
npm test -- --coverage

# E2E 測試（需要先啟動開發服務器）
npm run test:e2e
```

### 建置

```bash
npm run build
npm start
```

## 專案結構

```
/workspace
├── app/                    # Next.js App Router 頁面
│   ├── page.tsx           # 主應用程式（完整流程）
│   ├── layout.tsx         # 根佈局
│   └── globals.css        # 全域樣式
├── components/            # React 元件
│   ├── FractionBar.tsx   # 分數條 SVG 元件
│   ├── ScenePlayer.tsx   # 場景播放器
│   └── Checkpoint.tsx    # 檢查點元件
├── lib/                   # 核心邏輯庫
│   ├── rational.ts       # 精確有理數算術（gcd/lcm）
│   ├── math-verifier.ts  # 數學驗證器（本地驗算）
│   ├── problem-parser.ts # 題目解析器
│   ├── misconceptions.ts # 迷思假設資料庫
│   ├── lesson-plan-builder.ts  # 教案建構器
│   ├── visual-math-engine.ts   # 視覺數學引擎
│   ├── ocr-provider.ts   # OCR 提供者（模擬）
│   └── tts-provider.ts   # TTS 提供者（模擬）
├── types/                 # TypeScript 類型定義
│   └── index.ts          # 所有核心類型
├── __tests__/            # 測試
│   ├── rational.test.ts
│   ├── math-verifier.test.ts
│   ├── problem-parser.test.ts
│   └── e2e/
│       └── journey.spec.ts
├── docs/                  # Phase 0 文件
│   ├── PROJECT_BLUEPRINT.md
│   ├── FRACTION_CONCEPT_MAP.md
│   ├── VISUAL_GRAMMAR.md
│   ├── DECISIONS.md
│   └── PROGRESS.md
└── README.md
```

## 技術棧

- **框架**: Next.js 16 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **測試**: Jest + Playwright
- **渲染**: SVG (確定性視覺)
- **數學**: 本地 Rational 類（整數 gcd/lcm）

## 關鍵實作細節

### 數學驗證（永不信任 LLM）

所有分數計算使用精確整數算術：

```typescript
import { Rational } from '@/lib/rational';

const r1 = new Rational(1, 2);
const r2 = new Rational(1, 3);
const sum = r1.add(r2);
// sum = 5/6 (精確，非浮點數)

const lcd = Rational.lcm(2, 3); // = 6
```

### 模擬 vs 實際

**模擬（Phase 1）**：
- ✓ OCR 辨識（返回固定測試資料）
- ✓ TTS 合成（返回靜音音頻）

**實際實作**：
- ✓ 問題解析
- ✓ 數學驗算
- ✓ 教案生成
- ✓ SVG 動畫
- ✓ 檢查點系統
- ✓ 遷移題

UI 清楚標示模擬功能（「相機功能（模擬中）」）

### 測試結果

```
Test Suites: 3 passed, 3 total
Tests:       38 passed, 38 total
```

關鍵驗證：
- ✅ 1/2+1/3 = 5/6（精確）
- ✅ LCD(2,3) = 6
- ✅ 拒絕 2/5（ADD-M1 迷思）
- ✅ 分母 > 12 超出範圍檢查

## 使用示範

### 1. 輸入題目
手動輸入：`1/2+1/3`

### 2. 確認
系統顯示：「計算 1/2 + 1/3」

### 3. 教學動畫
- 展示兩個分數條
- 示範錯誤方法（2/5 標記為錯）
- 重組為六等份（公分母）
- 合併為 5/6

### 4. 檢查點
問題：「計算 1/2+1/3 時，可唔可以將分母加埋變成 2/5？」
正確答案：「唔可以」

### 5. 失敗路徑（如適用）
用數線重新解釋

### 6. 遷移題
試下：「1/4 + 1/6 = ?」
正確答案：5/12

## MVP 範圍

### 支援
- **概念**: 等值分數、比較分數、異分母加法
- **輸入**: 清晰印刷題（手動輸入永遠可用）
- **分母**: ≤ 12
- **年級**: 香港小四至小五（P4-P5）
- **語言**: 繁體中文 UI + 粵語旁白（模擬）

### 不支援（超出 Phase 1）
- 手寫辨識
- 異分母減法、分數乘除
- 複雜應用題
- 分母 > 12
- 真實 OCR/TTS（需要 API 密鑰）

## 螢幕截圖

見 `docs/screenshots/` 目錄：
- `mobile-input.png` - 手機輸入畫面
- `mobile-teaching.png` - 手機教學畫面
- `desktop-overview.png` - 桌面完整視圖

## 開發備註

### 環境要求
- Node.js 20+
- npm 或 pnpm

### 配置
- 無需環境變數（所有功能本地運行）
- 無需 API 密鑰（模擬 OCR/TTS）

### 未來擴展
- Phase 2: 完整三主題範本
- Tesseract 本地 OCR
- 服務器端 TTS（粵語）
- 項目題庫

## 授權

ISC

## 連結

- **文件**: [docs/PROJECT_BLUEPRINT.md](docs/PROJECT_BLUEPRINT.md)
- **倉庫**: https://github.com/willyeahyeah/AImath
- **原則**: 答案只係結果，理解先係產品

---

**Phase 1 完成日期**: 2026-09-08  
**下一步**: Phase 2 擴展（等待批准）
