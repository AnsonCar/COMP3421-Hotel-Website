# 後端技術文檔

## 介紹
本後端專案是 COMP3421-Hotel-Website 專案的一部分，負責處理酒店預訂系統的 API 請求，包括使用者認證、酒店查詢、預訂管理、評論和聯絡表單等功能。專案採用現代化的 TypeScript 開發，強調類型安全和高效能。後端使用 Hono 框架建置 RESTful API，連接到 PostgreSQL 資料庫，並透過 Drizzle ORM 處理資料操作。專案結構模組化，適合擴展和維護。

## 1. 使用的編程語言及其優勢
- **語言**：TypeScript (基於 Node.js 運行時)。
- **優勢**：
  - **類型安全**：TypeScript 是 JavaScript 的超集，提供靜態類型檢查，能在編譯時捕捉錯誤，減少運行時 bug，提高代碼可靠性。例如，在 [`backend/src/db/schema.ts`](backend/src/db/schema.ts) 中定義的資料庫模式使用 TypeScript 類型確保查詢結果的正確性。
  - **開發體驗**：支援 IntelliSense、自動補全和重構工具，提升開發效率。專案的 [`backend/tsconfig.json`](backend/tsconfig.json) 啟用嚴格模式 (`strict: true`) 和 Node16 模組解析，確保現代 ESM 支援。
  - **生態系統**：與 Node.js 無縫整合，適合構建高效能的伺服器端應用；支援 ESM (ECMAScript Modules)，符合現代 JavaScript 標準，如在 [`backend/src/index.ts`](backend/src/index.ts) 中的 import 語法。
  - **可維護性**：大型專案中，類型定義有助於團隊協作和長期維護。專案使用 TypeScript 編譯為 JavaScript (`tsc` 命令)，並透過 `tsx` 支援熱重載開發 (`npm run dev`)。

## 2. 使用的框架及其用處
### API 框架：Hono
- **描述**：Hono 是一個輕量級、快速的 Web 框架，專為邊緣計算和伺服器端應用設計。版本為 `^4.10.6`，透過 [`backend/package.json`](backend/package.json) 安裝。
- **用處**：
  - **路由管理**：支援 RESTful API 路由，例如 `/api` 下的酒店、預訂、評論和聯絡端點。透過 `app.route()` 掛載子路由器 (e.g., `hotelRouter` 在 [`backend/src/view/hotel.ts`](backend/src/view/hotel.ts))，實現模組化。根路由在 [`backend/src/index.ts`](backend/src/index.ts) 中定義，所有 API 前綴為 `/api`。
  - **中介軟體**：內建 CORS 支援，處理跨域請求；在 `index.ts` 中設定 `Access-Control-Allow-Origin: '*'` 等標頭，允許前端 (localhost:8000) 呼叫後端 (localhost:3000)。
  - **優勢**：體積小 (僅 ~10KB)、效能高 (比 Express 快數倍)，支援 JSX 和 TypeScript 原生整合。使用 `@hono/node-server` 部署到 Node.js 伺服器 (端口 3000)。
- **範例**：在 `index.ts` 中，`app.route('/api', hotelRouter)` 將酒店相關路由掛載到 `/api/hotels` 等端點。

### ORM 框架：Drizzle ORM
- **描述**：Drizzle 是一個類型安全的 SQL ORM，專為 TypeScript 設計，強調 SQL-like 查詢語法。版本為 `^0.44.7`，配置在 [`backend/drizzle.config.ts`](backend/drizzle.config.ts)。
- **用處**：
  - **資料庫互動**：定義資料庫模式 (schema) 在 [`backend/src/db/schema.ts`](backend/src/db/schema.ts)，使用 `pgTable`、`pgEnum` 等 PostgreSQL 特定工具建立表格 (e.g., `users`, `hotels`, `bookings`)。例如，`hotels` 表格包含檢查約束如 `check('star_rating_check', sql`${table.starRating} >= 1 AND ${table.starRating} <= 5`)`。
  - **遷移與種子**：透過 `drizzle-kit` 生成遷移檔案 (e.g., `backend/drizzle/0000_lovely_carlie_cooper.sql`) 和種子資料 (`backend/src/seed.ts`，透過 `npm run db:testdata` 執行)。遷移命令：`npm run db:generate` 和 `npm run db:migrate`。
  - **查詢優化**：支援原生 SQL 片段 (`sql` 模板)，並提供類型推斷，確保查詢結果的類型安全。例如，在 [`backend/src/controller/hotelController.ts`](backend/src/controller/hotelController.ts) 中，使用 `db.select().from(hotels).where(and(...conditions))` 建構動態查詢。
- **優勢**：不像傳統 ORM (e.g., Prisma) 那樣抽象化 SQL，Drizzle 更接近原生 SQL，減少學習曲線並提高效能；嚴格的 TypeScript 整合避免運行時錯誤。資料庫客戶端在 [`backend/src/db/index.ts`](backend/src/db/index.ts) 初始化，使用 `postgres` 驅動連線。

## 3. 使用的資料庫及其選擇理由
- **資料庫**：PostgreSQL (簡稱 PGSQL)，版本透過 `pg` (`^8.16.3`) 和 `postgres` (`^3.4.7`) 驅動。
- **配置**：在 [`backend/drizzle.config.ts`](backend/drizzle.config.ts) 中指定 `dialect: "postgresql"`，連線字串來自環境變數 `DATABASE_URL` (從 `backend/envs/.env.local` 載入，透過 [`backend/src/env.ts`](backend/src/env.ts) 管理)。如果未設 `DATABASE_URL`，則從 `POSTGRES_*` 變數自動建構 (e.g., `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}`)。
- **為何使用 PostgreSQL 而非 MySQL**：
  - **功能豐富**：PostgreSQL 支援進階資料類型，如 JSONB (適合儲存彈性資料)、全文字搜尋和地理空間擴充 (PostGIS)，適合酒店系統的複雜查詢 (e.g., 地址搜尋使用 `ILIKE` 在 `hotelController.ts`)。
  - **標準符合與可靠性**：嚴格遵守 SQL 標準，ACID 相容性強，適合交易密集型應用如預訂系統；內建檢查約束確保資料完整性 (e.g., 星級 1-5、退房日期 > 入住日期)。
  - **開源與效能**：完全開源、無授權費用；併發處理優於 MySQL，尤其在讀寫混合負載下；擴充性強，支援分片和複寫。
  - **MySQL 的缺點**：MySQL 在複雜 JOIN 和子查詢上效能較差，且對嚴格模式支援不一致；PostgreSQL 更適合現代 Web 應用，且與 Drizzle ORM 完美整合 (MySQL 支援較有限)。
  - **專案適用**：酒店資料涉及評論平均分數計算 (`hotelController.getHotelDetails`) 和多表關聯 (e.g., `bookings` JOIN `hotels`)，PostgreSQL 的查詢優化器更高效。測試資料在 [`backend/test-data.sql`](backend/test-data.sql) 中提供。

資料庫初始化：使用 Docker Compose (根目錄 `docker-compose.yml`) 啟動 PostgreSQL 容器，環境變數驗證在 `env.ts` 中拋出錯誤若缺少必要變數 (e.g., `JWT_SECRET`)。

## 4. 代碼架構
專案採用模組化、MVC-like 架構，強調分離關注點。根目錄為 [`backend`](backend/)，主要結構如下：

### 目錄結構
- **`src/`**：核心源碼。
  - **`db/`**：資料庫相關。
    - [`index.ts`](backend/src/db/index.ts)：Drizzle 客戶端初始化 (`const db = drizzle(client)`)，連線 PostgreSQL。
    - [`schema.ts`](backend/src/db/schema.ts)：定義 5 個主要表格：
      - `users`：使用者 (userId, firstName, lastName, email, password)。
      - `hotels`：酒店 (hotelId, name, address, starRating, userRating, roomType, pricePerNight, description)，包含檢查約束。
      - `reviews`：評論 (reviewId, userId → users, hotelId → hotels, userRating, comment, time)。
      - `bookings`：預訂 (bookingId, userId → users, hotelId → hotels, checkInDate, checkOutDate, guests, status enum ['pending', 'confirmed'])，包含日期和客人數檢查。
      - `contacts`：聯絡 (contactId, name, email, subject, message, createdAt)。
  - **`controller/`**：業務邏輯處理，處理 CRUD 和驗證。
    - [`hotelController.ts`](backend/src/controller/hotelController.ts)：酒店操作。
      - `getHotels`：支援過濾 (starRating, minPrice/maxPrice, address 模糊搜尋) 和排序 (name, price, rating)，使用 Drizzle 的 `and()`, `like()`, `sql` 模板。
      - `getFeaturedHotels`：取得前 10 個高評分酒店 (`orderBy(desc(hotels.userRating))`)。
      - `getHotelDetails`：取得單一酒店細節 + 評論，計算平均評分 (`reduce` 聚合)。
    - [`bookingController.ts`](backend/src/controller/bookingController.ts)：預訂操作，需要 JWT 認證 (`c.get('jwtPayload').sub`)。
      - `createBooking`：建立預訂，驗證日期 (`checkOut > checkIn`)、客人數 (>0)、酒店存在，預設 status 'pending'。
      - `getUserBookings`：取得使用者預訂，JOIN hotels 顯示酒店資訊，排序 by bookingId。
      - `getBookingDetails`：單一預訂細節，驗證擁有權。
      - `updateBooking`：更新 pending 預訂 (日期、客人數)，驗證邏輯。
      - `cancelBooking`：刪除 pending 預訂。
    - [`reviewController.ts`](backend/src/controller/reviewController.ts)：評論操作。
      - `getHotelReviews`：取得酒店評論，JOIN users 顯示姓名，排序 by time desc。
      - `createReview`：建立評論，驗證 rating 1-5、未重複、酒店存在。
      - `updateReview`：更新使用者評論 (rating, comment)。
      - `deleteReview`：刪除使用者評論。
    - [`contactController.ts`](backend/src/controller/contactController.ts)：聯絡表單。
      - `submitContact`：儲存訊息，嚴格驗證 (email regex、長度)，無認證需求。
  - **`view/`**：路由器 (Hono 子應用)，對應控制器，定義端點 (e.g., `router.get('/hotels', getHotels)`)。
    - `user.ts`：認證路由 (註冊/登入，使用 bcryptjs 雜湊密碼)。
    - `hotel.ts`：`/api/hotels` (GET 清單/特色/細節)。
    - `booking.ts`：`/api/bookings` (POST/GET/PUT/DELETE，需 JWT)。
    - `review.ts`：`/api/reviews/:hotelId` (GET/POST/PUT/DELETE，需 JWT)。
    - `contact.ts`：`/api/contact` (POST)。
  - **`types/`**：自訂類型 (e.g., [`type.d.ts`](backend/src/types/type.d.ts))。
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


## 5. 詳細代碼介紹
以下詳細說明主要代碼模組，包含邏輯流程和關鍵片段 (參考檔案連結)。

### 環境與初始化 ([`env.ts`](backend/src/env.ts))
- 載入 dotenv 根據 NODE_ENV 選擇 `.env.local` (開發) 或 `.env` (生產)。
- 驗證必要變數 (POSTGRES_USER 等)，拋出錯誤若缺少。
- 建構 DATABASE_URL，若未設則使用預設 localhost:5432。
- 匯出 env 物件，供其他模組使用 (e.g., db/index.ts)。

![](./backend_env.png)

### 資料庫 Schema ([`schema.ts`](backend/src/db/schema.ts))
- 使用 Drizzle pg-core 定義表格、外鍵 (e.g., reviews.userId references users.userId)、枚舉 (bookingStatusEnum)、檢查 (e.g., guests > 0, checkOutDate > checkInDate)。
- 支援 ILIKE 模糊搜尋 (PostgreSQL 特定)。

![](./table_1.png)
![](./table_2.png)

### 酒店控制器 ([`hotelController.ts`](backend/src/controller/hotelController.ts))
- **getHotels**：解析 query (starRating, minPrice 等)，建構 conditions 陣列 (e.g., `eq(hotels.starRating, parseInt(starRating))`, `sql`${price} >= ${min}` for 範圍, ILIKE for 地址/名稱搜尋)，`where(and(...))`，排序 switch (asc/desc)。
- **getFeaturedHotels**：簡單 limit 10 + orderBy desc userRating。
- **getHotelDetails**：單一查詢 + reviews JOIN，計算平均 `reduce((sum, r) => sum + r.userRating, 0) / length`，四捨五入到 1 位小數。

### 預訂控制器 ([`bookingController.ts`](backend/src/controller/bookingController.ts))
- 所有操作需使用者 ID (從 JWT)。
- **createBooking**：JSON 解析，驗證日期 (new Date, checkOut > checkIn)、guests >0、酒店存在 (select where)，insert returning()，status='pending'。
- **getUserBookings**：JOIN hotels，select 特定欄 (hotelName 等)，where userId，orderBy bookingId。
- **updateBooking**：僅 pending，動態 updateData (驗證日期邏輯，如若更新 checkOut 須 > 原 checkIn)，若無變更 400。
- **cancelBooking**：僅 pending，delete where userId AND bookingId。

### 評論控制器 ([`reviewController.ts`](backend/src/controller/reviewController.ts))
- **getHotelReviews**：JOIN users (firstName 等)，where hotelId，orderBy desc time。
- **createReview**：驗證 rating 1-5，重複檢查 (where userId AND hotelId)，insert (comment 可 null)。
- **updateReview**：擁有權檢查，動態更新，若無變更 400。
- **deleteReview**：擁有權後 delete。

### 聯絡控制器 ([`contactController.ts`](backend/src/controller/contactController.ts))
- **submitContact**：JSON 解析，嚴格驗證 (trim(), length 1-255/100, email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)，insert returning()，無認證。

### 路由與入口 ([`index.ts`](backend/src/index.ts) & view/*.ts)
- CORS middleware 處理 OPTIONS 預檢。
- 路由掛載：app.route('/auth', userRouter), app.route('/api', hotelRouter 等)。
- 根路由 '/' 返回 'Hello Hono!'。

![](./index_api.png)

## 6. 依賴與安全
- **主要依賴**：
  - `hono` & `@hono/node-server`：API 框架。
  - `drizzle-orm` & `drizzle-kit`：ORM 和遷移。
  - `pg` & `postgres`：PostgreSQL 驅動。
  - `bcryptjs`：密碼加密。
  - `dotenv`：環境管理。
- **安全**：CORS 設定允許所有來源 (開發用)；密碼使用 bcryptjs 雜湊；資料庫連線使用環境變數。

## 7. 測試與除錯
- 整合 Cypress E2E 測試 (根目錄 `cypress/`)，後端間接透過 API 測試。
- 除錯：使用 `console.log` 或 VS Code 偵錯器；檢查遷移狀態 (`drizzle/meta/`)。
![](./test.png)

## 8. 未來改進
- 新增驗證中介軟體 (e.g., Zod)。
- 實作 JWT 認證。
- 優化查詢效能 (索引 on hotels.address)。
