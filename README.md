# saasany

> Production-ready Next.js 16 template for AI SaaS. Auth, payments, AI chat, i18n — out of the box.

[English](README.md) | [中文](README_ZH.md) | [Demo](https://saasany.vercel.app) | [Docs](https://github.com/sit-in/saasany)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sit-in/saasany&env=DATABASE_URL,BETTER_AUTH_SECRET,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,OPENAI_API_KEY,RESEND_API_KEY&project-name=my-saas)
[![CI](https://github.com/sit-in/saasany/actions/workflows/ci.yml/badge.svg)](https://github.com/sit-in/saasany/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js 16 App Router             │
├──────────┬──────────┬──────────┬────────────────────┤
│  Auth    │ Payments │    AI    │       i18n          │
│  Better  │  Stripe  │  OpenAI  │    next-intl        │
│  Auth    │ Checkout │ Vercel   │    (EN/ZH)          │
│  OAuth   │ Webhooks │ AI SDK   │                     │
├──────────┴──────────┴──────────┴────────────────────┤
│  Drizzle ORM  →  Neon PostgreSQL                     │
├─────────────────────────────────────────────────────┤
│  Tailwind v4 + shadcn/ui  │  6 Color Themes         │
│  Instrument Serif + DM Sans + Geist Mono             │
├─────────────────────────────────────────────────────┤
│                  Deploy: Vercel                      │
└─────────────────────────────────────────────────────┘
```

## Quick Start

```bash
git clone https://github.com/sit-in/saasany.git my-saas
cd my-saas
npm install
cp .env.example .env.local   # fill in your API keys
npm run db:push               # init database
npm run dev                   # http://localhost:3000
```

Or click the **Deploy with Vercel** button above for one-click deployment.

## What's Included

- **Auth** — Email/password + GitHub OAuth, session management
- **Payments** — Stripe subscriptions, checkout, customer portal, webhooks
- **AI** — Streaming chat + text generation, swappable models
- **Dashboard** — Collapsible sidebar, stat cards, settings, billing
- **Admin** — User management, subscription stats, RBAC
- **Blog** — MDX + i18n
- **API Keys** — Generate, list, revoke
- **i18n** — English + Chinese, URL prefix routing
- **6 Themes** — Emerald, Ocean, Violet, Amber, Rose, Zinc
- **Dark Mode** — System-aware
- **SEO** — Sitemap, robots.txt, dynamic OG images

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
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/            # Sign in, sign up, forgot password
│   │   ├── (dashboard)/       # Dashboard, settings, billing, AI, admin
│   │   ├── (marketing)/       # Blog, pricing, privacy, terms
│   │   └── page.tsx           # Landing page
│   └── api/
│       ├── ai/                # Chat + generation
│       ├── auth/              # Better Auth
│       ├── keys/              # API key management
│       ├── og/                # OG image generation
│       └── stripe/            # Checkout, webhook, portal
├── components/
│   ├── dashboard/             # Sidebar
│   ├── emails/                # Email templates
│   ├── landing/               # Hero, features, pricing
│   ├── layout/                # Header, footer, theme, locale switcher
│   └── ui/                    # shadcn/ui
├── config/site.ts             # Site config (start here to rebrand)
├── content/blog/              # MDX blog (en/ + zh/)
├── i18n/messages/             # Translation files
└── lib/
    ├── db/                    # Drizzle schema
    ├── auth.ts                # Auth config
    ├── email.ts               # Email
    ├── stripe.ts              # Stripe
    └── ai.ts                  # AI model config
```

## Environment Variables

```bash
DATABASE_URL=                  # Neon → https://console.neon.tech
BETTER_AUTH_SECRET=            # openssl rand -base64 32
STRIPE_SECRET_KEY=             # Stripe Dashboard
STRIPE_WEBHOOK_SECRET=         # stripe listen --forward-to localhost:3000/api/stripe/webhook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
OPENAI_API_KEY=                # OpenAI Platform
RESEND_API_KEY=                # Resend Dashboard
GITHUB_CLIENT_ID=              # (optional) GitHub OAuth
GITHUB_CLIENT_SECRET=          # (optional)
```

Full list in [`.env.example`](.env.example).

## Customize

**Branding** — Edit `src/config/site.ts`. Name, emails, social links in one file.

**Colors** — Edit `src/app/globals.css`. OKLCH variables. See `DESIGN.md`.

**AI model** — Edit `src/lib/ai.ts`. Any Vercel AI SDK provider.

**Add language** — `src/i18n/config.ts` → `src/i18n/messages/` → `src/content/blog/`.

## Deploy

```bash
# Vercel (recommended)
# 1. Push to GitHub
# 2. Import in Vercel → vercel.com/new
# 3. Add env vars
# 4. Deploy

# Stripe Webhook (production)
# Dashboard → Webhooks → https://yourdomain.com/api/stripe/webhook
# Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
```

## Commands

```bash
npm run dev            # dev server
npm run build          # production build
npm run lint           # lint check
npm run db:push        # push schema
npm run db:studio      # Drizzle Studio
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## AI 编程出海训练营

From the **[AI 编程出海训练营](https://chuhai.fyyd.net/)** (AI Coding Bootcamp for Global Markets).

Website: https://chuhai.fyyd.net/ · WeChat: 257735

## License

[MIT](LICENSE)
