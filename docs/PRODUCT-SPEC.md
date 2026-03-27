# 育兒智多星 — 完整開發規劃文件

> **版本**：v1.0｜**建立日期**：2026-03-27｜**狀態**：規劃階段

---

## 目錄

1. [產品願景與定位](#1-產品願景與定位)
2. [使用者旅程](#2-使用者旅程-user-journey)
3. [功能模組詳細規劃](#3-功能模組詳細規劃)
4. [技術架構規劃](#4-技術架構規劃)
5. [資料來源規劃](#5-資料來源規劃)
6. [開發階段與里程碑](#6-開發階段與里程碑)
7. [MVP 核心功能清單](#7-mvp-核心功能清單)
8. [商業模式建議](#8-商業模式建議)

---

## 1. 產品願景與定位

### 1.1 產品願景

成為台灣每個家庭的「AI 育兒夥伴」——不是冰冷的工具，而是能理解每個孩子獨特性、每個家庭不同處境的智慧助手。我們相信，好的育兒不需要父母成為專家，而是需要一個能把專業知識轉化為「此刻最適合你家孩子」的具體行動建議的可靠夥伴。

### 1.2 核心定位

打造一個**完全個性化**的專業育兒管家，隨時陪伴在父母身邊，針對每個家庭的實際情況輸出最適配的育兒計劃。

### 1.3 目標用戶

| 用戶角色 | 描述 | 核心需求 |
|---------|------|---------|
| 新手父母 | 0–3 歲嬰幼兒的爸媽，第一次帶孩子 | 減少焦慮、獲得可信賴的即時指引 |
| 雙寶家庭 | 有兩個以上孩子的父母 | 同時管理不同年齡孩子的需求 |
| 職場父母 | 工作忙碌但想給孩子最好的 | 高效規劃、快速得到答案 |
| 協同照顧者 | 祖父母、保母、伴侶 | 統一育兒方針、資訊同步 |

### 1.4 競爭差異

| 面向 | 現有方案 (BabyHome、媽媽經等) | 育兒智多星 |
|------|---------------------------|-----------|
| 資訊型態 | 通用文章、論壇討論 | 基於孩子數據的個性化建議 |
| 分析能力 | 無 | AI 驅動的生長分析與偏差偵測 |
| 景點推薦 | 通用親子景點清單 | 根據孩子狀況動態篩選（過敏、蚊蟲、疫情） |
| 幼兒園資訊 | 片段、難以比較 | 全台結構化資料庫 + 智慧配對 |
| 多人協作 | 不支援 | 多代養者共同平台 |

---

## 2. 使用者旅程 (User Journey)

### 2.1 首次使用流程

```
下載 APP → 註冊/登入
    → Onboarding 問卷（孩子年齡、特殊狀況、家庭結構）
    → 系統生成個性化首頁
    → 引導填寫第一筆生長數據
    → 解鎖個性化分析報告
    → 推薦本週活動 / 景點 / 發展里程碑
```

### 2.2 日常使用場景

**場景 A：晨間 — 飲食規劃**
父母打開 APP → 查看今日副食品/餐點建議 → 記錄孩子實際進食內容 → 系統累積數據並調整建議。

**場景 B：週末 — 親子出遊**
父母想找地方帶小孩去 → 系統根據孩子年齡、體質（易被蚊蟲叮咬）、當前疫情資訊 → 推薦合適景點 → 顯示從家裡出發的車程與交通方式 → 規劃行程路線。

**場景 C：成長檢視**
收到月度成長報告通知 → 查看身高體重曲線 → 系統偵測到身高成長速度偏低 → 分析可能原因（蛋白質不足、油脂偏低） → 給出具體飲食調整建議。

**場景 D：選擇幼兒園**
進入幼兒園查詢 → 輸入地區與偏好（蒙特梭利、重視獨立性） → 系統顯示匹配結果 → 展示每間幼兒園的辦學特色、查驗記錄、費用 → 父母收藏 & 比較。

**場景 E：多代養者協作**
媽媽新增阿嬤為協作者 → 阿嬤安裝 APP 並加入 → 看到系統為孩子制定的飲食與作息方案 → 各照顧者依據同一方案執行 → 減少育兒觀念衝突。

### 2.3 使用者旅程地圖

```
階段        認知         入門          日常使用        深度使用        傳播
─────────────────────────────────────────────────────────────────────────
接觸點     社群廣告     Onboarding    每日記錄        成長分析       分享功能
           口碑推薦     問卷引導      景點推薦        幼兒園配對     邀請協作者
           搜尋引擎     首頁個性化    副食品建議      多人協作       社群口碑

情緒       好奇         期待          安心 / 便利     信賴 / 依賴    自豪 / 推薦

關鍵指標   下載量       問卷完成率    DAU / 記錄頻率  付費轉換       NPS / 邀請數
```

---

## 3. 功能模組詳細規劃

### 3.1 模組一：個性化入口 (Onboarding)

#### 子功能

| 子功能 | 說明 |
|-------|------|
| 孩子基本資料建立 | 姓名/暱稱、出生日期、性別、出生體重身高 |
| 年齡階段判定 | 系統依出生日期自動歸類：新生兒(0-3m)、嬰兒(4-12m)、幼兒(1-3y)、學齡前(3-6y) |
| 健康特殊狀況 | 過敏原、慢性疾病、早產週數、特殊體質（易被蚊蟲叮咬等） |
| 家庭結構問卷 | 單親/雙親、幾胎、照顧者組成、居住區域 |
| 個性化首頁生成 | 基於以上資料產出客製化首頁，含推薦模組排序 |
| 養育偏好設定 | 教養風格偏好（蒙特梭利、華德福等）、語言環境（雙語家庭）、飲食習慣（素食）|

#### 資料需求

- 用戶輸入：孩子基本資料、家庭結構、偏好
- 系統資料：各年齡階段的發展里程碑知識庫、推薦演算法

#### 技術實現

- 前端：引導式多步驟表單（Stepper UI），支援新增多個孩子
- 後端：用戶 Profile 建立，寫入 Supabase `children` 與 `family` 表
- AI：基於問卷結果觸發個性化推薦引擎，生成首頁配置

---

### 3.2 模組二：兒童生長數據個性化分析

#### 子功能

| 子功能 | 說明 |
|-------|------|
| 生長數據記錄 | 定期記錄身高、體重、頭圍 |
| 飲食日記 | 拍照或手動輸入每日飲食內容 |
| 成長曲線視覺化 | 對照 WHO 標準成長曲線，顯示百分位 |
| AI 偏差分析 | 偵測成長異常並推斷可能原因 |
| 營養缺口分析 | 基於飲食日記分析營養素攝取，找出不足處 |
| 個性化改善建議 | 針對分析結果給出具體飲食/生活調整方案 |
| 月度成長報告 | 每月自動產生成長摘要報告 |

#### 資料需求

- 用戶輸入：身高、體重、頭圍、飲食照片/文字紀錄
- 外部資料：WHO 兒童成長標準數據、台灣國民營養調查、食品營養資料庫
- AI 模型：食物影像辨識模型、營養分析模型、成長趨勢預測模型

#### 技術實現

- 前端：數據輸入表單 + 拍照上傳 + 圖表元件（Recharts 或 ECharts）
- 後端：Supabase 儲存成長紀錄，Edge Functions 處理圖片
- AI 引擎：
  - 食物影像辨識 → 呼叫 Vision API（OpenAI / Google Vision）辨識食材
  - LLM（Claude / GPT）進行營養分析與建議生成
  - 成長曲線分析 → 比對 WHO 標準數據集

#### 分析邏輯範例

```
輸入：3歲男孩，過去一年身高成長 3 公分
標準：該年齡段標準年成長約 6-8 公分

→ 偏差偵測：成長速度低於標準 50%
→ 飲食分析：過去 30 天飲食紀錄顯示
   - 蛋白質攝取：每日約 15g（建議 25-30g）→ 不足
   - 油脂攝取：偏低，缺乏堅果類食物
   - 鈣質攝取：接近標準

→ 輸出建議：
   1. 增加高蛋白食物（雞蛋、魚肉、豆腐）
   2. 每日補充堅果類（核桃、杏仁磨碎拌入餐點）
   3. 建議就醫檢查生長激素
```

---

### 3.3 模組三：親子景點個性化推薦

#### 子功能

| 子功能 | 說明 |
|-------|------|
| 智慧景點搜尋 | 結合孩子年齡、體質、天氣、疫情的多維度篩選 |
| 蚊蟲/過敏篩選 | 標記易有蚊蟲的景點，為過敏兒自動排除 |
| 疫情即時過濾 | 串接疾管署資料，排除有流行病毒風險的區域 |
| 雙寶/多寶適配 | 找出同時適合不同年齡孩子的景點 |
| 交通規劃 | 基於用戶住址計算車程，推薦最佳交通方式 |
| 行程排程 | 結合景點營業時間、預估停留時間規劃一日行程 |
| 使用者評價系統 | 讓家長留下帶孩子去的真實體驗與評分 |

#### 資料需求

- 景點資料庫：全台親子景點（名稱、地址、座標、適合年齡、室內/外、設施）
- 環境資料：蚊蟲風險等級（季節 + 地理環境推估）、即時天氣
- 疫情資料：衛福部疾管署公開資料
- 地圖 & 交通：Google Maps API（距離、路線、交通時間）
- 用戶資料：居住地址、孩子年齡與體質

#### 技術實現

- 前端：地圖元件（Google Maps / Mapbox）、篩選器 UI、行程卡片
- 後端：景點資料庫建置於 Supabase，PostGIS 地理查詢
- 排程任務：每日爬取疾管署疫情通報、天氣預報
- AI：LLM 綜合多維度資料進行推薦排序

---

### 3.4 模組四：幼兒園資訊查詢與匹配

#### 子功能

| 子功能 | 說明 |
|-------|------|
| 全台幼兒園資料庫 | 收錄教育部立案之所有幼兒園 |
| 結構化資訊展示 | 辦學特色、教學方法、師生比、查驗紀錄、裁罰紀錄 |
| 從業人員資訊 | 教師離職率、師資穩定度指標 |
| 智慧匹配 | 根據父母教養偏好、距離、預算做配對 |
| 費用透明化 | 月費、註冊費、延托費、教材費等完整費用呈現 |
| 比較功能 | 同時比較 2–3 間幼兒園的各項指標 |
| 家長評價 | 已在讀家長的匿名評價系統 |

#### 資料需求

- 政府公開資料：教育部全國幼兒園查詢系統、各縣市幼兒園查驗紀錄
- 爬取資料：幼兒園官網（辦學理念、師資介紹、收費標準）
- 用戶輸入：家長評價、真實費用回報
- 計算資料：從用戶住址到各幼兒園的通勤距離

#### 技術實現

- 前端：搜尋 + 篩選 + 列表/地圖雙視圖、比較表格元件
- 後端：Supabase `kindergartens` 表，欄位包含結構化評分
- 爬蟲：Python 排程爬取教育部資料（定期更新）
- AI：自然語言查詢（「家附近有沒有蒙特梭利的幼兒園，月費三萬以內？」）

#### 資料模型

```
kindergartens
├── id (PK)
├── name（園所名稱）
├── city / district（縣市 / 區域）
├── address / lat / lng（地址與座標）
├── phone / website
├── type（公立 / 私立 / 非營利 / 準公共）
├── teaching_method（蒙特梭利 / 華德福 / 主題式 / 角落教學...）
├── student_teacher_ratio（師生比）
├── capacity（核定人數）
├── monthly_fee / registration_fee / ...
├── inspection_records（JSONB — 查驗紀錄）
├── violation_records（JSONB — 裁罰紀錄）
├── staff_turnover_rate（師資離職率）
├── features（JSONB — 特色標籤）
└── updated_at
```

---

### 3.5 模組五：多代養者協作

#### 子功能

| 子功能 | 說明 |
|-------|------|
| 家庭成員邀請 | 透過連結或 QR Code 邀請伴侶、祖父母加入 |
| 角色權限管理 | 主要照顧者（管理權限）、協作照顧者（檢視與記錄） |
| 統一育兒計畫 | 所有人看到同一份飲食 / 作息 / 活動計畫 |
| 記錄同步 | 任一照顧者記錄的飲食、活動自動同步 |
| 照顧者日曆 | 排定每個人負責的照顧時段 |
| 溝通備忘 | 照顧者間的留言板與提醒功能 |

#### 資料需求

- 用戶輸入：家庭成員資料、照顧排程
- 系統產生：共享的育兒計畫、同步紀錄

#### 技術實現

- 前端：邀請流程 UI、共享看板、日曆元件
- 後端：Supabase `families` + `family_members` 表，Row Level Security (RLS) 控制權限
- 即時同步：Supabase Realtime 訂閱，確保多裝置即時更新
- 通知：推播通知提醒照顧者任務與排程

---

### 3.6 模組六：延伸服務

#### 3.6.1 副食品搭配建議

| 項目 | 說明 |
|-----|------|
| 月齡適配食材清單 | 依孩子月齡推薦可嘗試的新食材 |
| 過敏風險標示 | 高過敏風險食材特別標示，建議少量嘗試 |
| 每週食譜建議 | 系統自動規劃均衡的一週副食品菜單 |
| 食材搭配禁忌 | 標示不宜同時食用的組合 |

#### 3.6.2 大動作 / 小動作發展追蹤

| 項目 | 說明 |
|-----|------|
| 發展里程碑清單 | 各月齡應達到的動作發展指標 |
| 進度記錄 | 父母勾選孩子已達成的里程碑 |
| 偏差提醒 | 若延遲達標，系統提醒並建議刺激活動 |
| 活動建議 | 推薦促進特定動作發展的親子遊戲 |

#### 3.6.3 情緒智商 / 專注力發展

| 項目 | 說明 |
|-----|------|
| 情緒引導腳本 | 針對常見情緒場景（哭鬧、拒絕、分離焦慮）提供引導話術 |
| 專注力評估 | 簡易觀察量表，追蹤專注力發展趨勢 |
| 遊戲建議 | 提升情緒管理與專注力的遊戲推薦 |

#### 3.6.4 家長心態建設（核心重點）

| 項目 | 說明 |
|-----|------|
| 心態文章推送 | 依孩子階段推送相關的心態建設內容 |
| 父母壓力量表 | 簡易自我評估工具 |
| 正念育兒引導 | 短音頻 / 文字引導，幫助父母釋放壓力 |
| 伴侶溝通建議 | 育兒分工、觀念差異的溝通技巧 |
| 社群互助 | 同階段父母的匿名交流空間 |

---

## 4. 技術架構規劃

### 4.1 整體架構圖

```
┌─────────────────────────────────────────────────────────┐
│                     用戶端 (Client)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │
│  │ iOS App  │  │Android App│  │   Web App (PWA)      │   │
│  │ React    │  │ React    │  │   Next.js 14+        │   │
│  │ Native   │  │ Native   │  │   App Router         │   │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘   │
└───────┼──────────────┼──────────────────┼────────────────┘
        │              │                  │
        └──────────────┼──────────────────┘
                       │ HTTPS / WebSocket
        ┌──────────────┴──────────────────┐
        │         API Gateway             │
        │    (Supabase Edge Functions)     │
        └──────────────┬──────────────────┘
                       │
   ┌───────────────────┼───────────────────────┐
   │                   │                       │
   ▼                   ▼                       ▼
┌──────────┐   ┌──────────────┐   ┌────────────────────┐
│ Supabase │   │  AI 分析引擎  │   │  排程任務服務       │
│ Core     │   │              │   │                    │
│ ─ Auth   │   │ ─ LLM API   │   │ ─ 疫情資料爬取     │
│ ─ DB     │   │   (Claude/   │   │ ─ 幼兒園資料更新   │
│ ─ Storage│   │    GPT)      │   │ ─ 天氣資料同步     │
│ ─ Realtime│  │ ─ Vision API │   │ ─ 月度報告生成     │
│ ─ RLS    │   │ ─ 推薦引擎   │   │                    │
└──────────┘   └──────────────┘   └────────────────────┘
```

### 4.2 前端架構

**技術選型**

| 層級 | 技術 | 理由 |
|------|------|------|
| Web 框架 | Next.js 14+ (App Router) | SSR/SSG 支援、SEO 友好、React 生態系 |
| 行動端 | React Native / Expo | 與 Web 共用邏輯層，一份 codebase |
| 狀態管理 | Zustand | 輕量、簡單、支援持久化 |
| UI 元件庫 | shadcn/ui + Tailwind CSS | 高度可定制、現代設計 |
| 圖表 | Recharts | React 原生、支援自訂成長曲線 |
| 地圖 | Google Maps SDK / Mapbox | 交通規劃 + 景點呈現 |
| 表單 | React Hook Form + Zod | 型別安全的表單驗證 |

**前端目錄結構**

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # 登入/註冊
│   ├── (onboarding)/       # 個性化入門流程
│   ├── dashboard/          # 個性化首頁
│   ├── growth/             # 生長數據與分析
│   ├── places/             # 親子景點
│   ├── kindergartens/      # 幼兒園查詢
│   ├── family/             # 家庭協作
│   └── settings/           # 設定
├── components/
│   ├── ui/                 # 基礎 UI 元件
│   ├── charts/             # 圖表元件
│   ├── forms/              # 表單元件
│   └── layouts/            # 版面佈局
├── lib/
│   ├── supabase/           # Supabase 客戶端
│   ├── ai/                 # AI API 呼叫封裝
│   └── utils/              # 工具函數
├── hooks/                  # 自訂 Hooks
├── stores/                 # Zustand 狀態
└── types/                  # TypeScript 型別
```

### 4.3 後端架構 (Supabase)

**Supabase 使用規劃**

| 服務 | 用途 |
|------|------|
| Auth | Email/密碼 + Google/Apple/LINE 社群登入 |
| Database (PostgreSQL) | 所有結構化數據儲存 |
| Storage | 飲食照片、用戶頭像 |
| Edge Functions | API 邏輯、AI 呼叫中介、爬蟲觸發 |
| Realtime | 多代養者資料即時同步 |
| Row Level Security | 確保家庭資料隔離 |

### 4.4 資料庫設計

```sql
-- 用戶表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  city TEXT,
  district TEXT,
  address TEXT,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  parenting_style TEXT[],       -- 教養風格偏好
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 家庭表
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 家庭成員
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id),
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL,             -- 'primary_caregiver', 'partner', 'grandparent', 'other'
  permissions TEXT DEFAULT 'view', -- 'admin', 'edit', 'view'
  joined_at TIMESTAMPTZ DEFAULT now()
);

-- 孩子表
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id),
  nickname TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT,
  birth_weight_g INTEGER,
  birth_height_cm DECIMAL(5,2),
  gestational_weeks INTEGER,      -- 早產記錄
  allergies TEXT[],
  health_conditions TEXT[],
  special_traits TEXT[],           -- 如：易被蚊蟲叮咬
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 生長紀錄
CREATE TABLE growth_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id),
  recorded_by UUID REFERENCES users(id),
  measured_at DATE NOT NULL,
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  head_circumference_cm DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 飲食紀錄
CREATE TABLE meal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id),
  recorded_by UUID REFERENCES users(id),
  meal_date DATE NOT NULL,
  meal_type TEXT NOT NULL,          -- 'breakfast', 'lunch', 'dinner', 'snack'
  photo_url TEXT,
  description TEXT,
  ai_analysis JSONB,               -- AI 分析結果（辨識食材、營養素估算）
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 發展里程碑追蹤
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id),
  category TEXT NOT NULL,           -- 'gross_motor', 'fine_motor', 'language', 'social', 'cognitive'
  milestone_key TEXT NOT NULL,      -- 參照里程碑知識庫
  achieved_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 親子景點
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  district TEXT,
  address TEXT,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  place_type TEXT[],                -- 'park', 'museum', 'indoor_playground', ...
  suitable_age_min INTEGER,         -- 適合最小月齡
  suitable_age_max INTEGER,         -- 適合最大月齡
  is_indoor BOOLEAN,
  mosquito_risk_level INTEGER,      -- 1-5 蚊蟲風險等級
  features TEXT[],
  opening_hours JSONB,
  avg_stay_minutes INTEGER,
  avg_rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 幼兒園（見 3.4 資料模型）
CREATE TABLE kindergartens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  district TEXT,
  address TEXT,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  phone TEXT,
  website TEXT,
  type TEXT,                        -- 'public', 'private', 'nonprofit', 'quasi_public'
  teaching_method TEXT[],
  student_teacher_ratio DECIMAL(4,1),
  capacity INTEGER,
  monthly_fee INTEGER,
  registration_fee INTEGER,
  extended_care_fee INTEGER,
  material_fee INTEGER,
  inspection_records JSONB,
  violation_records JSONB,
  staff_turnover_rate DECIMAL(4,2),
  features JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI 分析報告
CREATE TABLE ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id),
  report_type TEXT NOT NULL,        -- 'monthly_growth', 'nutrition_gap', 'milestone_review'
  report_date DATE NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.5 AI 分析引擎

```
┌─────────────────────────────────────────────┐
│               AI 分析引擎                     │
│                                             │
│  ┌─────────────┐    ┌─────────────────────┐ │
│  │ 食物影像辨識 │    │ 成長趨勢分析         │ │
│  │ Vision API  │    │ WHO 標準比對         │ │
│  │ (Google /   │    │ 偏差偵測演算法        │ │
│  │  OpenAI)    │    │ 趨勢預測             │ │
│  └──────┬──────┘    └──────────┬──────────┘ │
│         │                      │            │
│         ▼                      ▼            │
│  ┌──────────────────────────────────────┐   │
│  │         LLM 推理層                    │   │
│  │   (Claude API / OpenAI GPT-4)        │   │
│  │                                      │   │
│  │  ─ 營養分析與建議生成                  │   │
│  │  ─ 景點多維度推薦                     │   │
│  │  ─ 幼兒園自然語言查詢                  │   │
│  │  ─ 情緒引導腳本生成                   │   │
│  │  ─ 月度報告撰寫                      │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │         推薦引擎                      │   │
│  │  ─ 協同過濾（相似家庭推薦）            │   │
│  │  ─ 內容推薦（基於孩子 Profile）        │   │
│  │  ─ 上下文推薦（時間、天氣、位置）       │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**AI API 成本估算（MVP 階段 / 月）**

| 服務 | 用量預估 | 月費估算 |
|------|---------|---------|
| Claude API (Haiku) | 日常對話與建議 | ~$200–500 |
| Claude API (Sonnet) | 深度分析報告 | ~$300–800 |
| Google Vision / OpenAI Vision | 食物辨識 | ~$100–300 |
| 合計 | | ~$600–1,600 |

---

## 5. 資料來源規劃

### 5.1 資料來源總覽

| 資料類型 | 來源 | 取得方式 | 更新頻率 |
|---------|------|---------|---------|
| WHO 兒童成長標準 | WHO 官方 | 一次性下載 CSV | 年度檢查 |
| 台灣食品營養資料 | 衛福部食藥署 | API / 下載 | 季度更新 |
| 傳染病疫情通報 | 疾管署 OpenData | API 串接 | 每日 |
| 全國幼兒園名冊 | 教育部 | 爬蟲 + 人工校正 | 每月 |
| 幼兒園查驗紀錄 | 各縣市教育局 | 爬蟲 | 每月 |
| 親子景點 | Google Places + 社群回報 | API + UGC | 持續 |
| 天氣資料 | 中央氣象署 | API 串接 | 每小時 |
| 蚊蟲風險 | 環境部 + 季節模型 | 計算推估 | 每日 |
| 發展里程碑知識庫 | 兒科醫學文獻 | 人工整理 | 半年度 |
| 副食品知識庫 | 營養師顧問 + 衛教資料 | 人工整理 | 季度 |

### 5.2 爬蟲規劃

| 目標 | 技術 | 注意事項 |
|------|------|---------|
| 教育部幼兒園系統 | Python (Playwright + BeautifulSoup) | 尊重 robots.txt，設定合理間隔 |
| 各縣市查驗公告 | Python (Requests + lxml) | 各縣市格式不同，需個別 parser |
| 幼兒園官網 | Scrapy + LLM 結構化 | 非結構化資料需 LLM 提取 |

### 5.3 API 串接

| 服務 | API | 用途 |
|------|-----|------|
| Google Maps Platform | Directions API, Places API | 交通規劃、景點資料補充 |
| 中央氣象署 | 開放資料 API | 天氣預報 |
| 疾管署 | 傳染病統計 API | 疫情資料 |
| 衛福部食藥署 | 食品營養成分資料集 | 營養分析 |
| Anthropic Claude | Messages API | AI 分析與對話 |
| Google Cloud Vision | Image Annotation | 食物影像辨識 |

---

## 6. 開發階段與里程碑

### Phase 1：POC 強化（第 1–4 週）

**目標**：將現有單一 HTML + React CDN 的 POC 提升為可展示的 Demo。

| 週次 | 任務 | 交付物 |
|------|------|-------|
| W1 | 專案初始化：遷移至 Next.js + TypeScript | 專案骨架、CI/CD |
| W1 | Supabase 專案建立，Auth + 基礎表建置 | 資料庫 Schema v1 |
| W2 | Onboarding 流程 UI + 基本邏輯 | 可操作的 Onboarding |
| W2 | 個性化首頁 — 靜態 Mock 版 | Dashboard 頁面 |
| W3 | 生長數據輸入 + WHO 曲線顯示 | 成長曲線圖表 |
| W3 | 基礎 AI 串接 — 簡易營養建議 | AI 回覆功能 |
| W4 | 整合測試 + Demo 準備 | 可展示 Demo |

**里程碑**：可以完整走過「註冊 → Onboarding → 記錄數據 → 看到 AI 建議」的流程。

---

### Phase 2：MVP 開發（第 5–14 週）

**目標**：推出最小可行產品，開始招募早期用戶。

| 週次 | 任務 | 交付物 |
|------|------|-------|
| W5–6 | 生長分析完整功能：飲食日記 + AI 偏差分析 | 完整生長分析模組 |
| W7–8 | 親子景點 MVP：基礎搜尋 + 地圖 + 交通 | 景點推薦模組 |
| W9–10 | 幼兒園資料庫建置 + 查詢介面 | 幼兒園查詢模組 |
| W11 | 副食品建議 + 發展里程碑追蹤 | 延伸服務基礎版 |
| W12 | 家長心態建設內容上架 | 心態文章 + 壓力量表 |
| W13 | 多代養者協作基礎版 | 邀請 + 同步功能 |
| W14 | Beta 測試 + 修正 | MVP Beta 版 |

**里程碑**：MVP 上線 TestFlight / 內部測試群組，招募 100 位 Beta 用戶。

---

### Phase 3：正式版（第 15–26 週）

**目標**：公開上架 App Store / Google Play。

| 週次 | 任務 | 交付物 |
|------|------|-------|
| W15–16 | React Native 行動端開發 | iOS + Android App |
| W17–18 | 景點進階功能：蚊蟲/疫情篩選、雙寶適配 | 進階推薦引擎 |
| W19–20 | 幼兒園進階：比較功能、家長評價 | 完整幼兒園平台 |
| W21–22 | AI 食物影像辨識上線 | 拍照記錄飲食 |
| W23–24 | 通知系統 + 月度報告自動化 | 推播 + 報告 |
| W25 | 付費方案上線 | 訂閱制基礎設施 |
| W26 | 正式上架準備 + 壓力測試 | 正式版 v1.0 |

**里程碑**：App Store / Google Play 上架，開始行銷推廣。

---

### Phase 4：AI 個性化深化（第 27–40 週）

**目標**：透過數據累積打造真正個性化的 AI 育兒夥伴。

| 週次 | 任務 | 交付物 |
|------|------|-------|
| W27–30 | 推薦引擎升級：協同過濾 + 個人化排序 | 精準推薦系統 |
| W31–34 | AI 對話助手（育兒問答 Chatbot） | 智慧對答功能 |
| W35–37 | 情緒智商 / 專注力進階追蹤模組 | 全方位發展追蹤 |
| W38–40 | 社群功能 + 數據洞察儀表板 | 社群互助 + 分析後台 |

**里程碑**：系統具備根據長期數據累積做出精準個性化建議的能力。

---

### 總覽時程

```
月份  1    2    3    4    5    6    7    8    9    10
     ├────┤
     Phase 1
     POC 強化
          ├─────────────────────┤
          Phase 2 — MVP 開發
                                ├──────────────────────┤
                                Phase 3 — 正式版
                                                       ├──────────────┤
                                                       Phase 4 — AI 深化
```

---

## 7. MVP 核心功能清單

MVP 的原則：**做最少的功能，驗證最關鍵的假設**。

### 必須有 (Must Have)

| # | 功能 | 驗證假設 |
|---|------|---------|
| 1 | 用戶註冊 + Onboarding 問卷 | 父母願意花時間填寫孩子資料 |
| 2 | 個性化首頁 | 個性化內容提高日活與留存 |
| 3 | 生長數據記錄 + WHO 曲線 | 父母有持續記錄的動力 |
| 4 | AI 生長偏差分析 + 飲食建議 | AI 分析結果對父母有實際幫助 |
| 5 | 飲食日記（手動文字輸入） | 父母願意記錄飲食 |
| 6 | 幼兒園基礎查詢（全台資料庫） | 結構化幼兒園資料有市場需求 |
| 7 | 家長心態建設文章 | 心態內容是留存關鍵 |

### 應該有 (Should Have)

| # | 功能 | 說明 |
|---|------|------|
| 8 | 親子景點基礎推薦 | 有地圖但先不含蚊蟲/疫情篩選 |
| 9 | 副食品搭配建議 | 依月齡的基礎版 |
| 10 | 發展里程碑勾選 | 簡易追蹤，尚無 AI 分析 |

### 可以延後 (Nice to Have)

| # | 功能 | 延後理由 |
|---|------|---------|
| 11 | 多代養者協作 | 需先有穩定的單人使用體驗 |
| 12 | AI 食物影像辨識 | 技術複雜度高，文字輸入可替代 |
| 13 | 蚊蟲/疫情篩選 | 需額外資料源整合 |
| 14 | 社群功能 | 需足夠用戶基數 |
| 15 | 幼兒園比較 + 評價 | 需累積用戶評價資料 |

---

## 8. 商業模式建議

### 8.1 定價策略：Freemium + 訂閱制

#### 免費版（基礎功能）

| 功能 | 說明 |
|------|------|
| Onboarding + 個性化首頁 | 完整體驗 |
| 基礎生長記錄 + WHO 曲線 | 記錄與基本對照 |
| 幼兒園資料庫查詢 | 基礎搜尋（每日限 5 次） |
| 親子景點瀏覽 | 基礎列表（無個性化篩選） |
| 家長心態文章 | 每週 2 篇免費 |
| 發展里程碑勾選 | 基礎追蹤 |

#### 付費版 — 「智多星 Pro」（NT$199 / 月 或 NT$1,990 / 年）

| 功能 | 說明 |
|------|------|
| AI 生長偏差分析 | 完整 AI 營養分析報告 |
| 飲食日記 + AI 拍照辨識 | 智慧飲食追蹤 |
| 月度成長報告 | AI 自動生成的完整報告 |
| 進階景點推薦 | 蚊蟲/疫情篩選、交通規劃 |
| 幼兒園智慧配對 | 無限查詢 + 比較功能 |
| 副食品個性化菜單 | 每週客製化食譜 |
| 多代養者協作 | 家庭共享帳號 |
| 全部心態文章 | 無限閱讀 |

#### 家庭版 — 「智多星 Family」（NT$299 / 月 或 NT$2,990 / 年）

| 功能 | 說明 |
|------|------|
| Pro 全部功能 | 含所有 Pro 權益 |
| 多孩管理 | 支援 3 個孩子以上 |
| 5 位協作者 | 伴侶 + 祖父母 + 保母 |
| AI 育兒問答 | 無限次 Chatbot 對話 |
| 優先客服 | 專屬客服通道 |

### 8.2 其他收入來源

| 收入類型 | 說明 | 時程 |
|---------|------|------|
| 聯盟行銷 | 推薦嬰幼兒用品、營養品、親子景點門票（抽佣） | Phase 3 |
| 幼兒園合作 | 幼兒園付費刊登 / 優先排序 | Phase 3 |
| 企業方案 | 企業員工福利育兒 APP 授權 | Phase 4 |
| 數據洞察（去識別化） | 育兒趨勢報告銷售給品牌 / 研究機構 | Phase 4+ |

### 8.3 關鍵指標 (KPIs)

| 階段 | 指標 | 目標 |
|------|------|------|
| MVP | 月活躍用戶 (MAU) | 1,000 |
| MVP | 問卷完成率 | > 80% |
| MVP | 週回訪率 | > 40% |
| 正式版 | MAU | 10,000 |
| 正式版 | 付費轉換率 | > 5% |
| 正式版 | NPS | > 50 |
| AI 深化 | MAU | 50,000 |
| AI 深化 | 年訂閱續約率 | > 70% |

---

## 附錄

### A. 技術升級路徑

目前 POC 為單一 HTML + React CDN，升級路徑如下：

```
現況                     Phase 1                Phase 2-3
─────────────────────────────────────────────────────────
HTML + React CDN    →   Next.js + TypeScript  →  Next.js + React Native
無後端              →   Supabase              →  Supabase + Edge Functions
無 AI               →   Claude API 基礎串接    →  多模型 AI Pipeline
無資料庫            →   PostgreSQL (Supabase)  →  + Redis Cache + PostGIS
```

### B. 合規與隱私

| 項目 | 措施 |
|------|------|
| 個資保護 | 遵循台灣《個人資料保護法》，敏感資料加密儲存 |
| 兒童隱私 | 不儲存孩子真實姓名（僅暱稱），照片僅用於飲食辨識後刪除原圖 |
| 資料備份 | Supabase 自動備份 + 跨區域備援 |
| 醫療免責 | 明確標示「本 APP 僅供參考，不取代專業醫療診斷」 |

### C. 團隊建議

| 角色 | 人數 | 備註 |
|------|------|------|
| 全端工程師 | 2 | React + Next.js + Supabase |
| AI / ML 工程師 | 1 | LLM 整合、推薦引擎 |
| 產品設計師 (UI/UX) | 1 | 專注行動端體驗 |
| 產品經理 | 1 | 可由創辦人兼任 |
| 內容顧問 | 1–2 (兼職) | 兒科/營養師，審核 AI 輸出品質 |
| 資料工程師 | 1 (Phase 2+) | 爬蟲 + 資料管線 |

---

> **文件維護者**：育兒智多星產品團隊
> **下次更新**：Phase 1 完成後依實際狀況調整
