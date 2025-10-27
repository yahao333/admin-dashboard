# 前端（Next.js）

## 快速开始
- 安装依赖：`npm ci`
- 本地开发：`npm run dev`
- 构建：`npm run build`

## 环境变量
- 将 `src/frontend/.env.local.example` 复制为 `.env.local`
- 设置 `NEXT_PUBLIC_API_BASE`（示例：`http://106.14.242.106:38080` 或本地 `http://localhost:38080`）

```env
NEXT_PUBLIC_API_BASE=http://106.14.242.106:38080
```

## 登录态管理
- 登录/注册成功后，后端返回令牌；前端保存至 `localStorage` 键 `jwt`
- 受保护请求自动使用 `Authorization: Bearer <token>`；401 时清空令牌并跳转登录

## CI 构建（示例）
- Vercel：在项目设置中配置 `NEXT_PUBLIC_API_BASE` 环境变量，默认使用 `npm run build`
- GitHub Actions：参考根目录 `README.md` 的 `frontend-build` 工作流片段，将 `NEXT_PUBLIC_API_BASE` 作为构建期环境变量传入

## 页面
- `/login` 登录页，`/register` 注册页，`/dashboard` 仪表盘（受保护）
- UI 使用 TailwindCSS + Shadcn/ui，并通过 `theme-vpn` 类启用统一深色主题变量