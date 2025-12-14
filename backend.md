# 後端技術文檔

## 介紹
本後端專案是 COMP3421-Hotel-Website 專案的一部分，負責處理酒店預訂系統的 API 請求，包括使用者認證、酒店查詢、預訂管理、評論和聯絡表單等功能。專案採用現代化的 TypeScript 開發，強調類型安全和高效能。

## 1. 使用的編程語言及其優勢
- **語言**：TypeScript (基於 Node.js 運行時)。
- **優勢**：
  - **類型安全**：TypeScript 是 JavaScript 的超集，提供靜態類型檢查，能在編譯時捕捉錯誤，減少運行時 bug，提高代碼可靠性。
  - **開發體驗**：支援 IntelliSense、自動補全和重構工具，提升開發效率。
  - **生態系統**：與 Node.js 無縫整合，適合構建高效能的伺服器端應用；支援 ESM (ECMAScript Modules)，符合現代 JavaScript 標準。
  - **可維護性**：大型專案中，類型定義有助於團隊協作和長期維護。

專案使用 TypeScript 編譯為 JavaScript (`tsc` 命令)，並透過 `tsx` 支援熱重載開發。

## 2. 使用的框架及其用處
### API 框架：Hono
- **描述**：Hono 是一個輕量級、快速的 Web 框架，專為邊緣計算和伺服器端應用設計。
- **用處**：
  - **路由管理**：支援 RESTful API 路由，例如 `/api` 下的酒店、預訂、評論和聯絡端點。透過 `app.route()` 掛載子路由器 (e.g., `hotelRouter`, `bookingRouter`)，實現模組化。
  - **中介軟體**：內建 CORS 支援，處理跨域請求；輕量設計確保低延遲，適合高併發場景。
  - **優勢**：體積小 (僅 ~10KB)、效能高 (比 Express 快數倍)，支援 JSX 和 TypeScript 原生整合。
- **配置**：在 [`backend/src/index.ts`](backend/src/index.ts) 中初始化 Hono app，並使用 `@hono/node-server` 部署到 Node.js 伺服器 (端口 3000)。

### ORM 框架：Drizzle ORM
- **描述**：Drizzle 是一個類型安全的 SQL ORM，專為 TypeScript 設計，強調 SQL-like 查詢語法。
- **用處**：
  - **資料庫互動**：定義資料庫模式 (schema) 在 [`backend/src/db/schema.ts`](backend/src/db/schema.ts)，使用 `pgTable`、`pgEnum` 等 PostgreSQL 特定工具建立表格 (e.g., `users`, `hotels`, `bookings`)。
  - **遷移與種子**：透過 `drizzle-kit` 生成遷移檔案 (e.g., `backend/drizzle/0000_lovely_carlie_cooper.sql`) 和種子資料 (`backend/src/seed.ts`)。
  - **查詢優化**：支援原生 SQL 片段 (`sql` 模板)，並提供類型推斷，確保查詢結果的類型安全。
- **優勢**：不像傳統 ORM (e.g., Prisma) 那樣抽象化 SQL，Drizzle 更接近原生 SQL，減少學習曲線並提高效能；嚴格的 TypeScript 整合避免運行時錯誤。

## 3. 使用的資料庫及其選擇理由
- **資料庫**：PostgreSQL (簡稱 PGSQL)。
- **配置**：在 [`backend/drizzle.config.ts`](backend/drizzle.config.ts) 中指定 `dialect: "postgresql"`，連線字串來自環境變數 `DATABASE_URL` (從 `backend/envs/.env.local` 載入)。依賴套件包括 `pg` 和 `postgres`。
- **為何使用 PostgreSQL 而非 MySQL**：
  - **功能豐富**：PostgreSQL 支援進階資料類型，如 JSONB (適合儲存彈性資料)、全文字搜尋和地理空間擴充 (PostGIS)，適合酒店系統的複雜查詢 (e.g., 位置搜尋、評論聚合)。
  - **標準符合與可靠性**：嚴格遵守 SQL 標準，ACID 相容性強，適合交易密集型應用如預訂系統；內建檢查約束 (e.g., `check` 在 schema 中驗證星級 1-5) 確保資料完整性。
  - **開源與效能**：完全開源、無授權費用；併發處理優於 MySQL，尤其在讀寫混合負載下；擴充性強，支援分片和複寫。
  - **MySQL 的缺點**：MySQL 在複雜 JOIN 和子查詢上效能較差，且對嚴格模式支援不一致；PostgreSQL 更適合現代 Web 應用，且與 Drizzle ORM 完美整合 (MySQL 支援較有限)。
  - **專案適用**：酒店資料涉及評論平均分數計算 (`hotelController.getHotelDetails`) 和多表關聯，PostgreSQL 的查詢優化器更高效。

資料庫初始化：使用 `npm run db:generate` 生成遷移，`npm run db:migrate` 應用，`npm run db:testdata` 插入測試資料。

## 4. 代碼架構
專案採用模組化、MVC-like 架構，強調分離關注點。根目錄為 [`backend`](backend/)，主要結構如下：

### 目錄結構
- **`src/`**：核心源碼。
  - **`db/`**：資料庫相關。
    - [`index.ts`](backend/src/db/index.ts)：Drizzle 客戶端初始化 (連線 PostgreSQL)。
    - [`schema.ts`](backend/src/db/schema.ts)：定義表格 (users, hotels, reviews, bookings, contacts)，包含外鍵、枚舉 (e.g., `bookingStatusEnum`) 和檢查約束。
  - **`controller/`**：業務邏輯處理。
    - e.g., [`hotelController.ts`](backend/src/controller/hotelController.ts)：處理酒店 CRUD、搜尋和細節 (包含平均評分計算)。
    - 其他：`bookingController.ts` (預訂管理)、`reviewController.ts` (評論)、`contactController.ts` (聯絡)。
  - **`view/`**：路由器 (Hono 子應用)，對應控制器。
    - e.g., [`hotel.ts`](backend/src/view/hotel.ts)：定義 `/api/hotels` 等端點，呼叫對應控制器。
    - 其他：`user.ts` (認證)、`booking.ts`、`review.ts`、`contact.ts`。
  - **`types/`**：自訂類型定義 (e.g., [`type.d.ts`](backend/src/types/type.d.ts))。
  - **`env.ts`](backend/src/env.ts)：環境變數載入 (使用 `dotenv`)。
  - **`index.ts`](backend/src/index.ts)：應用入口，設定 Hono app、CORS 和路由掛載；啟動伺服器。
  - **`seed.ts`](backend/src/seed.ts)：資料庫種子腳本。
- **`drizzle/`**：遷移檔案 (自動生成)。
- **`envs/`**：環境設定 (e.g., `.env.local` 包含 `POSTGRES_*` 變數，自動建構 `DATABASE_URL`)。
- **根檔案**：
  - [`package.json`](backend/package.json)：依賴 (Hono, Drizzle, bcryptjs 等) 和腳本 (dev, build, db 命令)。
  - [`tsconfig.json`](backend/tsconfig.json)：TypeScript 配置 (嚴格模式、`module: "Node16"`)。
  - [`dockerfile`](backend/dockerfile) 和 [`start.sh`](backend/start.sh)：容器化和啟動腳本。
  - [`test-data.sql`](backend/test-data.sql)：額外測試資料。

### 架構特點
- **MVC 變體**：Controller 處理邏輯，View 作為路由層，Model 由 Drizzle schema 定義。
- **路由組織**：所有 API 端點前綴 `/api`，子路由分離 (e.g., `/api/hotels` for 酒店)。
- **錯誤處理**：通用 500 錯誤回應；bcryptjs 用於密碼雜湊。
- **非明顯模式**：
  - 環境變數：從 `.env.local` 載入，`DATABASE_URL` 若未設則從 `POSTGRES_*` 建構。
  - 酒店圖片：控制器中使用 Unsplash URL 依星級硬編碼。
  - 前端 API 呼叫：硬編碼 `http://localhost:3000`。
- **開發與部署**：
  - 開發：`npm run dev` (tsx watch)。
  - 建置：`npm run build` (tsc)，運行 `npm start`。
  - Docker：使用 `docker-compose.yml` (根目錄) 整合後端、PostgreSQL 和 Traefik。

## 5. 依賴與安全
- **主要依賴**：
  - `hono` & `@hono/node-server`：API 框架。
  - `drizzle-orm` & `drizzle-kit`：ORM 和遷移。
  - `pg` & `postgres`：PostgreSQL 驅動。
  - `bcryptjs`：密碼加密。
  - `dotenv`：環境管理。
- **安全**：CORS 設定允許所有來源 (開發用)；密碼使用 bcryptjs 雜湊；資料庫連線使用環境變數。

## 6. 測試與除錯
- 整合 Cypress E2E 測試 (根目錄 `cypress/`)，後端間接透過 API 測試。
- 除錯：使用 `console.log` 或 VS Code 偵錯器；檢查遷移狀態 (`drizzle/meta/`)。

## 未來改進
- 新增驗證中介軟體 (e.g., Zod)。
- 實作 JWT 認證。
- 優化查詢效能 (索引 on hotels.address)。

如需更多細節，請參考 [`backend/README.md`](backend/README.md) 或特定控制器檔案。