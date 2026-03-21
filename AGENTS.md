<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 编码规则

## 绝对不要
- 在 `src/app/api/` 路由里用 next-intl（API 路由不走 i18n 中间件）
- 在服务端组件里用 `useSession`/`useTranslations` 等 hook（用对应的服务端 API）
- 硬编码中文或英文文案到组件里（必须走 i18n）
- 在 Stripe webhook 路由里加认证检查（它用签名验证）
- Neon HTTP 驱动不支持事务，不要用 `db.transaction()`

## 新增页面检查清单
1. 路由文件放对 route group：认证相关放 `(auth)`，需登录的放 `(dashboard)`
2. 翻译 key 同步添加到 `en.json` 和 `zh.json`
3. 如果是 dashboard 页面，在 sidebar 的导航数组里加入口
4. 页面标题用 `generateMetadata` 导出，走 i18n

## 新增 API 路由检查清单
1. 需要认证的路由，先获取 session 并检查
2. 返回 JSON 用 `NextResponse.json()`
3. 错误处理返回合适的 HTTP 状态码
4. AI 流式路由用 `streamText` 的 `toDataStreamResponse()`

## 新增 UI 组件
1. 优先用 shadcn/ui 已有组件（`src/components/ui/`）
2. 没有的先 `npx shadcn@latest add <name>` 安装
3. 样式用 Tailwind，避免内联 style
4. 客户端组件文件顶部加 `"use client"`
