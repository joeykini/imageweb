# ImageWeb - AI圖像生成平台

ImageWeb是一個智能AI圖像生成平台，包含前台頁面和後台管理系統。用戶可以使用AI技術生成各種圖像，管理員可以通過後台管理用戶、積分等。

## 主要功能

### 前台
- 多種登錄方式（Google、GitHub、Metamask、Apple等）通過Clerk整合
- AI圖像生成
- 個人中心
- 用戶積分系統

### 後台
- 用戶管理
- 添加/刪除/編輯用戶
- 修改用戶積分
- 封禁/解封用戶

## 技術棧

- **前端框架**: Next.js 15+
- **UI庫**: TailwindCSS
- **認證**: Clerk
- **API**: Next.js API Routes
- **語言**: TypeScript
- **部署**: Vercel (推薦)

## 安裝說明

### 前提條件
- Node.js 18+
- Yarn或npm

### 安裝步驟

1. 克隆存儲庫
```bash
git clone https://github.com/joeykini/imageweb.git
cd imageweb
```

2. 安裝依賴
```bash
npm install
# 或
yarn install
```

3. 創建環境變量文件
在項目根目錄創建`.env.local`文件，添加以下內容：
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
```

4. 運行開發服務器
```bash
npm run dev
# 或
yarn dev
```

5. 打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 部署

項目可以輕鬆部署到Vercel：

1. 在Vercel上導入項目
2. 設置環境變量
3. 部署

## 後台管理

### 訪問後台
- 後台地址：`/manage-system-c4xpz`
- 默認登錄賬號：請先使用Clerk登錄前台，然後訪問後台

### 用戶管理
- 列表顯示：查看所有用戶信息
- 添加用戶：手動添加新用戶
- 編輯用戶：修改用戶信息
- 刪除用戶：從系統中刪除用戶
- 積分管理：調整用戶積分

## 許可證
MIT