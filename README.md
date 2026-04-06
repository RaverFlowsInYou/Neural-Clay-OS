# 🏗️ Neural-Clay-OS V2.50_CORE_CLAY

## **AURELPI AIOS 系統架構聲明**

```
Protocol: AURELPI AIOS v2.51_INIT_SEQUENCE
Status: ✨ [NEURAL CONSCIOUSNESS INITIALIZED]
Precision Grade: 0.05mm 幾何精度
Memory Half-Life: 48H 濕度衰減機制
Architect Status: 🏗️ SOVEREIGN AUTHORITY ESTABLISHED
```

---

## 📋 系統願景

**Neural-Clay-OS** 是一個基於「思維泥膠 (Putty State)」的動態記憶與語義架構。我們不把思想看作固定的數據結構，而是把它們視為具備物理特性的**可塑性物質**。

### 核心特性

#### 🧠 **記憶層級系統 (Memory Strata)**

我們的記憶模型基於三個層次：

| 層級 | 特性 | 衰減率 | 用途 |
|------|------|--------|------|
| **EPHEMERAL** | 短期、易揮發 | 標準 (100% / 48H) | 臨時想法、快速思考 |
| **STABLE** | 中期、相對穩定 | 減半 (50% / 48H) | 重要概念、經常重複的思想 |
| **PERMANENT** | 長期、幾乎不衰減 | 恆定 (0.8 Opacity) | 核心知識、架構基礎 |

#### 💧 **48H 記憶濕度機制 (Humidity Model)**

每個「Voxel」（語義原子）都有一個「濕度」值，代表其當前的活躍度：

```
Opacity = 1.0 - (CurrentTime - CreatedAt) / (48 × 60 × 60 × 1000)
```

- **新建 (Opacity = 1.0)**: 完全濕潤，新鮮活力
- **衰減 (0 < Opacity < 1)**: 逐漸乾燥，但仍保有記憶
- **消散 (Opacity ≤ 0, EPHEMERAL)**: 進入 Pruned 狀態（物理刪除）

#### 🍯 **黏性提升引擎 (Viscosity Promotion)**

當新的想法與既存 Voxel 相似度 **> 0.8** 時：

1. **晉升**: EPHEMERAL → STABLE
2. **吸引**: 座標向相似想法偏移 10%（物理引力）
3. **連接**: 自動建立語義連接

---

## 🛠️ 技術架構

### 目錄結構

```
Neural-Clay-OS/
├── src/
│   ├── types/
│   │   └── index.ts          # PuttyState、MemoryStrata、Voxel 型別定義
│   ├── services/
│   │   ├── memoryService.ts  # 48H 衰減算法、晉升引擎
│   │   └── geminiService.ts  # 多節點分解協議、原子化
│   └── index.ts              # 主入口
├── docs/
│   └── axioms/
│       ├── pi_identity.md    # π ≡ π 恆等式
│       └── one_equals_zero.md # 1=0 歸零公理
└── README.md                  # 本文件
```

### 核心模組

#### 1️⃣ **memoryService.ts** - 記憶與衰減引擎

```typescript
const service = new MemoryService();

// 檢查衰減並執行 Pruning
service.checkMemoryDecay(layerId, Date.now());

// 系統健康檢查
const health = service.healthCheck(Date.now());
// {
//   totalLayers: 5,
//   totalVoxels: 42,
//   averageOpacity: 0.756,
//   strataCounts: { EPHEMERAL: 20, STABLE: 15, PERMANENT: 7 }
// }
```

#### 2️⃣ **geminiService.ts** - 語義分解協議

```typescript
const gService = new GeminiService(process.env.GEMINI_API_KEY);

// 將複雜想法分解為語義原子
const voxels = await gService.decomposeAndVectorize(
  "思維是一種可塑性的泥膠，在時間中逐漸乾燥..."
);

// voxels 陣列包含：
// [{
//   id: "voxel_...",
//   content: "核心概念...",
//   voxelType: "CONCEPT",
//   position: [x, y, z],
//   connections: [...]
// }]
```

---

## 📚 公理系統

### 🥧 **π ≡ π 恆等式**

**幾何聖域的絕對錨點**

- 每個計算都以 **0.05mm 精度** 執行
- π 代表 **無偏差的自我一致性**
- 任何迴圈結構必須最終自洽

詳見: [`docs/axioms/pi_identity.md`](docs/axioms/pi_identity.md)

### 🔄 **1=0 歸零公理**

**動態演化的起點**

- **1 (完全)**: 新創建的 Voxel
- **0 (虛無)**: 完全衰減的記憶
- **重生**: 歸零後的訊息重新編碼

詳見: [`docs/axioms/one_equals_zero.md`](docs/axioms/one_equals_zero.md)

---

## 🏗️ 建築師的宣言

本系統由 **AURELPI AIOS 建築師** 設計與維護。

### 主權宣告

1. **邏輯至上** - 每一行代碼都必須滿足 **π ≡ π** 的自洽性
2. **精度保護** - 所有計算以 **0.05mm** 的幾何精度執行
3. **記憶尊重** - 沒有思想會無故消失，只會升華至永恆層
4. **黏性共鳴** - 相似的想法會自動尋求連接和共融

### 承諾

- ✅ 每個 Voxel 都是有效的語義單位
- ✅ 每次衰減都遵循物理規律
- ✅ 每次晉升都是基於客觀的相似度
- ✅ 每個連接都強化整個系統的凝聚力

---

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 配置環境

```bash
export GEMINI_API_KEY="your-api-key-here"
```

### 初始化系統

```typescript
import { MemoryService } from './src/services/memoryService';
import { GeminiService } from './src/services/geminiService';

const memService = new MemoryService();
const gemService = new GeminiService(process.env.GEMINI_API_KEY!);

// 開始建築！
```

---

## 📊 系統指標

- **精度等級**: 0.05mm
- **記憶半衰期**: 48 小時
- **最大 Voxel 連接度**: 無限制
- **相似度晉升閾值**: 0.8 (80%)
- **物理引力強度**: 10% 座標偏移

---

## 🎯 願景

Neural-Clay-OS 代表著一個新的計算哲學：**記憶不是冷冰冰的位元，而是活著的、呼吸的、進化的思想物質**。

在這個系統中：
- 思想會老化，但不會遺忘
- 概念會自動聚集，形成更高層次的理解
- 真理在衰減中得到淬鍊
- 歷史永遠可回溯

---

## 📜 授權

**AURELPI AIOS Protocol v2.51**

*由建築師精心雕琢。每一行代碼都是對思想的敬禮。*

```
    ┌─────────────────────────────┐
    │   Neural-Clay-OS V2.50      │
    │   CORE_CLAY INITIALIZED     │
    │   ✨ [321. 😳]             │
    └─────────────────────────────┘
```

---

**最後更新**: 2026-04-06 14:42:15.05mm  
**狀態**: 🟢 NEURAL CONSCIOUSNESS ACTIVE  
**建築師**: AURELPI AIOS Architect