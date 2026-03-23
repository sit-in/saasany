# saasany

> AI SaaS 全栈模板。认证、支付、AI 对话、国际化，开箱即用。

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black)

## Quick Start

```bash
git clone https://github.com/sit-in/saasany.git my-saas
cd my-saas
npm install
cp .env.example .env.local   # 填入你的 API keys
npm run db:push               # 初始化数据库
npm run dev                   # http://localhost:3000
```

## What's Included

- **Auth** — 邮箱密码 + GitHub OAuth，session 管理
- **Payments** — Stripe 订阅、Checkout、Customer Portal、Webhooks
- **AI** — 流式对话 + 文本生成，支持切换模型
- **Dashboard** — 可折叠侧边栏、数据卡片、设置、账单
- **Admin** — 用户管理、订阅统计、角色权限
- **Blog** — MDX + i18n
- **API Keys** — 生成、列表、撤销
- **i18n** — 中英双语，URL prefix 路由
- **Dark Mode** — 跟随系统
- **SEO** — Sitemap、robots.txt、动态 OG 图片

## Stack

```
Next.js 16 (App Router) + React 19 + TypeScript
Tailwind CSS v4 + shadcn/ui
Drizzle ORM + Neon PostgreSQL
Better Auth (email + OAuth)
Stripe (subscriptions + webhooks)
Vercel AI SDK + OpenAI
next-intl (EN/ZH)
Resend (email)
Instrument Serif + DM Sans + Geist Mono
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/            # 登录、注册、忘记密码
│   │   ├── (dashboard)/       # Dashboard、设置、账单、AI、管理
│   │   ├── (marketing)/       # 博客、定价、隐私、条款
│   │   └── page.tsx           # 落地页
│   └── api/
│       ├── ai/                # 对话 + 生成
│       ├── auth/              # Better Auth
│       ├── keys/              # API Key 管理
│       ├── og/                # OG 图片生成
│       └── stripe/            # Checkout、Webhook、Portal
├── components/
│   ├── dashboard/             # 侧边栏
│   ├── emails/                # 邮件模板
│   ├── landing/               # Hero、Features、Pricing
│   ├── layout/                # Header、Footer、主题、语言切换
│   └── ui/                    # shadcn/ui
├── config/site.ts             # 站点配置（改品牌名从这里开始）
├── content/blog/              # MDX 博客 (en/ + zh/)
├── i18n/messages/             # 翻译文件
└── lib/
    ├── db/                    # Drizzle schema
    ├── auth.ts                # 认证配置
    ├── email.ts               # 邮件
    ├── stripe.ts              # Stripe
    └── ai.ts                  # AI 模型配置
```

## Environment Variables

```bash
DATABASE_URL=                  # Neon Console → https://console.neon.tech
BETTER_AUTH_SECRET=            # openssl rand -base64 32
STRIPE_SECRET_KEY=             # Stripe Dashboard
STRIPE_WEBHOOK_SECRET=         # stripe listen --forward-to localhost:3000/api/stripe/webhook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
OPENAI_API_KEY=                # OpenAI Platform
RESEND_API_KEY=                # Resend Dashboard
GITHUB_CLIENT_ID=              # (optional) GitHub OAuth Apps
GITHUB_CLIENT_SECRET=          # (optional)
```

完整列表见 [`.env.example`](.env.example)。

## Customize

**品牌** — 改 `src/config/site.ts`，站名、邮箱、社交链接全在一个文件。

**配色** — 改 `src/app/globals.css`，OKLCH 变量。设计系统文档见 `DESIGN.md`。

**AI 模型** — 改 `src/lib/ai.ts`，支持 Vercel AI SDK 所有 provider。

**加语言** — `src/i18n/config.ts` 加 locale → `src/i18n/messages/` 加翻译文件 → `src/content/blog/` 加内容。

## Deploy

```bash
# Vercel (推荐)
# 1. Push to GitHub
# 2. Import in Vercel → vercel.com/new
# 3. 填环境变量
# 4. Deploy

# Stripe Webhook (生产环境)
# Dashboard → Webhooks → https://yourdomain.com/api/stripe/webhook
# Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
```

## Commands

```bash
npm run dev            # 开发
npm run build          # 构建
npm run lint           # 检查
npm run db:push        # 推 schema
npm run db:studio      # Drizzle Studio
```

## Contributing

见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## AI 编程出海训练营

来自 **[AI 编程出海训练营](https://chuhai.fyyd.net/)**。用 AI 编程，做出海 SaaS。

官网：https://chuhai.fyyd.net/ · 微信：257735

## License

[MIT](LICENSE)
