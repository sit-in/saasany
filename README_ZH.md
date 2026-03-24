# saasany

> AI SaaS 全栈模板。认证、支付、AI 对话、国际化，开箱即用。

[English](README.md) | [中文](README_ZH.md) | [演示](https://saasany.vercel.app) | [文档](https://github.com/sit-in/saasany)

[![一键部署到 Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sit-in/saasany&env=DATABASE_URL,BETTER_AUTH_SECRET,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,OPENAI_API_KEY,RESEND_API_KEY&project-name=my-saas)
[![CI](https://github.com/sit-in/saasany/actions/workflows/ci.yml/badge.svg)](https://github.com/sit-in/saasany/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 架构概览

```
┌─────────────────────────────────────────────────────┐
│                    Next.js 16 App Router             │
├──────────┬──────────┬──────────┬────────────────────┤
│   认证   │   支付   │    AI    │      国际化         │
│  Better  │  Stripe  │  OpenAI  │    next-intl        │
│  Auth    │ Checkout │ Vercel   │    (中/英)           │
│  OAuth   │ Webhooks │ AI SDK   │                     │
├──────────┴──────────┴──────────┴────────────────────┤
│  Drizzle ORM  →  Neon PostgreSQL                     │
├─────────────────────────────────────────────────────┤
│  Tailwind v4 + shadcn/ui  │  6 套配色主题            │
│  Instrument Serif + DM Sans + Geist Mono             │
├─────────────────────────────────────────────────────┤
│                  部署: Vercel                         │
└─────────────────────────────────────────────────────┘
```

## 快速开始

```bash
git clone https://github.com/sit-in/saasany.git my-saas
cd my-saas
npm install
cp .env.example .env.local   # 填入你的 API keys
npm run db:push               # 初始化数据库
npm run dev                   # http://localhost:3000
```

或者点击上方 **一键部署到 Vercel** 按钮，零配置部署。

## 功能清单

- **认证** — 邮箱密码 + GitHub OAuth，session 管理
- **支付** — Stripe 订阅、Checkout、Customer Portal、Webhooks
- **AI** — 流式对话 + 文本生成，支持切换模型
- **仪表板** — 可折叠侧边栏、数据卡片、设置、账单
- **管理后台** — 用户管理、订阅统计、角色权限
- **博客** — MDX + i18n
- **API Keys** — 生成、列表、撤销
- **国际化** — 中英双语，URL prefix 路由
- **6 套主题** — Emerald、Ocean、Violet、Amber、Rose、Zinc
- **暗色模式** — 跟随系统
- **SEO** — Sitemap、robots.txt、动态 OG 图片

## 技术栈

```
Next.js 16 (App Router) + React 19 + TypeScript
Tailwind CSS v4 + shadcn/ui
Drizzle ORM + Neon PostgreSQL
Better Auth (邮箱 + OAuth)
Stripe (订阅 + Webhooks)
Vercel AI SDK + OpenAI
next-intl (中/英)
Resend (邮件)
```

## 项目结构

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

## 环境变量

```bash
DATABASE_URL=                  # Neon Console → https://console.neon.tech
BETTER_AUTH_SECRET=            # openssl rand -base64 32
STRIPE_SECRET_KEY=             # Stripe Dashboard
STRIPE_WEBHOOK_SECRET=         # stripe listen --forward-to localhost:3000/api/stripe/webhook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
OPENAI_API_KEY=                # OpenAI Platform
RESEND_API_KEY=                # Resend Dashboard
GITHUB_CLIENT_ID=              # (可选) GitHub OAuth Apps
GITHUB_CLIENT_SECRET=          # (可选)
```

完整列表见 [`.env.example`](.env.example)。

## 自定义

**品牌** — 改 `src/config/site.ts`，站名、邮箱、社交链接全在一个文件。

**配色** — 改 `src/app/globals.css`，OKLCH 变量。设计系统文档见 `DESIGN.md`。

**AI 模型** — 改 `src/lib/ai.ts`，支持 Vercel AI SDK 所有 provider。

**加语言** — `src/i18n/config.ts` 加 locale → `src/i18n/messages/` 加翻译文件 → `src/content/blog/` 加内容。

## 部署

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

## 常用命令

```bash
npm run dev            # 开发
npm run build          # 构建
npm run lint           # 检查
npm run db:push        # 推 schema
npm run db:studio      # Drizzle Studio
```

## 贡献

见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## AI 编程出海训练营

来自 **[AI 编程出海训练营](https://chuhai.fyyd.net/)**。用 AI 编程，做出海 SaaS。

官网：https://chuhai.fyyd.net/ · 微信：257735

## License

[MIT](LICENSE)
