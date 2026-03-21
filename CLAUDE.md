@AGENTS.md

# Sassany — AI SaaS 出海模板

Next.js 16 + React 19 全栈模板，集成认证、支付、AI、国际化。

## 常用命令

```bash
npm run dev          # 本地开发 http://localhost:3000
npm run build        # 生产构建（改完代码必跑）
npm run lint         # ESLint 检查
npx drizzle-kit push # 推送 schema 变更到数据库
npx drizzle-kit generate  # 生成迁移文件
npx shadcn@latest add <component>  # 添加 shadcn/ui 组件
```

## 核心技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 (App Router) + React 19 |
| 认证 | better-auth (邮箱/密码 + OAuth) |
| 数据库 | Drizzle ORM + Neon PostgreSQL (HTTP) |
| 支付 | Stripe (Checkout + Webhook + Portal) |
| AI | Vercel AI SDK + OpenAI |
| 国际化 | next-intl (en/zh, URL prefix as-needed) |
| 样式 | Tailwind CSS v4 + shadcn/ui (base-nova) |
| 邮件 | Resend |

## 项目约定

### 路由结构
- `src/app/[locale]/(auth)/` — 登录/注册等认证页面
- `src/app/[locale]/(dashboard)/` — 需登录的仪表板页面（layout 里做 session 检查）
- `src/app/api/` — API 路由，不走 i18n 中间件

### i18n 模式
```typescript
// 服务端组件
const t = await getTranslations('namespace');

// 客户端组件
const t = useTranslations('namespace');

// 导航（始终用 i18n 版本）
import { Link, redirect, useRouter } from '@/i18n/navigation';
```
翻译文件在 `src/i18n/messages/{en,zh}.json`，两个文件 key 必须完全对齐。

### 认证模式
```typescript
// 服务端获取 session
const session = await auth.api.getSession({ headers: await headers() });

// 客户端
import { useSession, signIn, signOut } from '@/lib/auth-client';
```

### 数据库操作
```typescript
import { db } from '@/lib/db';
import { user, subscription } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
```
Schema 在 `src/lib/db/schema.ts`，表包含：user, session, account, verification, subscription, apiKey, creditBalance。

### UI 组件
- shadcn/ui 组件在 `src/components/ui/`，用 `npx shadcn@latest add` 添加新组件
- 样式工具函数 `cn()` 来自 `@/lib/utils`
- 颜色用 CSS 变量（OKLCH），定义在 `src/app/globals.css`
- 图标统一用 `lucide-react`

### API 路由
- AI 路由需要认证，返回流式响应
- Stripe webhook 路由不需要认证，但必须验证签名
- API 密钥路由需要认证

## 环境变量

参考 `.env.example`，必填项：DATABASE_URL, BETTER_AUTH_SECRET, STRIPE 相关, OPENAI_API_KEY。
