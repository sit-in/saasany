<h1 align="center">Saasany</h1>

<p align="center">
  <strong>Ship your AI SaaS in a weekend.</strong><br>
  Production-ready Next.js 16 template with auth, payments, AI, and i18n built in.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-blue" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/i18n-EN%20%7C%20ZH-orange" alt="i18n EN|ZH">
</p>

<!-- Add a screenshot here: ![Saasany](./public/screenshot.png) -->

---

## Why Saasany?

Most SaaS templates give you auth and payments. Saasany gives you a complete product:

- **AI-native** — Streaming chat and text generation with OpenAI, ready to swap models
- **Bilingual out of the box** — English + Chinese i18n with `next-intl`. Built for global markets (出海)
- **Opinionated design system** — Instrument Serif + DM Sans + warm emerald palette. Not another generic template
- **Actually production-ready** — Stripe webhooks, email templates, admin panel, API keys, legal pages

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Drizzle ORM + Neon (PostgreSQL) |
| Auth | Better Auth (email/password + OAuth) |
| Payments | Stripe (Checkout + Webhooks + Portal) |
| AI | Vercel AI SDK + OpenAI |
| Email | Resend |
| i18n | next-intl (EN/ZH) |
| Fonts | Instrument Serif + DM Sans + Geist Mono |

## Features

| Category | What you get |
|----------|-------------|
| **Auth** | Email/password, GitHub OAuth, session management |
| **Payments** | Stripe subscriptions, checkout, customer portal, webhooks |
| **AI** | Streaming chat, text generation, configurable models |
| **Dashboard** | Collapsible sidebar, stats cards, settings, billing |
| **Admin** | User management, subscription stats, role-based access |
| **Blog** | MDX-based with i18n support |
| **API Keys** | Generate, list, revoke |
| **i18n** | English + Chinese, URL-prefix routing |
| **Dark Mode** | System-aware theme switching |
| **SEO** | Sitemap, robots.txt, dynamic OG images, metadata API |
| **Email** | Welcome + subscription confirmation templates |
| **Legal** | Privacy Policy, Terms of Service |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/sit-in/saasany.git my-saas
cd my-saas

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Fill in your API keys (see Environment Variables below)

# 4. Set up database
npm run db:push

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | [Neon Console](https://console.neon.tech) |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3000/api/stripe/webhook` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | [GitHub OAuth Apps](https://github.com/settings/developers) (optional) |

See [`.env.example`](.env.example) for the full list.

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/          # Sign in, sign up, forgot password
│   │   ├── (dashboard)/     # Dashboard, settings, billing, AI, admin
│   │   ├── (marketing)/     # Blog, pricing, privacy, terms
│   │   └── page.tsx         # Landing page
│   └── api/
│       ├── ai/              # Chat and generation endpoints
│       ├── auth/            # Better Auth handler
│       ├── keys/            # API key management
│       ├── og/              # Dynamic OG image generation
│       └── stripe/          # Checkout, webhook, portal
├── components/
│   ├── dashboard/           # Sidebar, header
│   ├── emails/              # Email templates (React)
│   ├── landing/             # Hero, features, pricing
│   ├── layout/              # Header, footer, theme, locale switcher
│   └── ui/                  # shadcn/ui components
├── config/
│   └── site.ts              # Site config, pricing plans, email addresses
├── content/
│   └── blog/                # MDX blog posts (en/ + zh/)
├── i18n/
│   └── messages/            # Translation files (en.json, zh.json)
└── lib/
    ├── db/                  # Drizzle schema and connection
    ├── auth.ts              # Better Auth server config
    ├── email.ts             # Resend email functions
    ├── stripe.ts            # Stripe instance
    └── ai.ts                # AI model config
```

## Customization

### Branding
Edit `src/config/site.ts` — site name, description, email addresses, and social links are all in one file.

### Colors
Edit `src/app/globals.css` — all colors use OKLCH CSS variables. See `DESIGN.md` for the full design system.

### Fonts
Fonts are loaded in `src/app/[locale]/layout.tsx` via `next/font/google`. Default: Instrument Serif (headings) + DM Sans (body) + Geist Mono (code).

### Add a language
1. Add locale to `src/i18n/config.ts`
2. Create `src/i18n/messages/<locale>.json`
3. Add blog content in `src/content/blog/<locale>/`

### Change AI model
Edit `src/lib/ai.ts` — supports any provider compatible with Vercel AI SDK.

## Commands

```bash
npm run dev            # Development server
npm run build          # Production build
npm run lint           # ESLint check
npm run db:push        # Push schema to database
npm run db:generate    # Generate migration files
npm run db:studio      # Open Drizzle Studio
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy

### Stripe Webhook (Production)

Create a webhook in Stripe Dashboard pointing to `https://yourdomain.com/api/stripe/webhook`.

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, code conventions, and PR guidelines.

## AI 编程出海训练营

This template is a project from the **[AI 编程出海训练营](https://chuhai.fyyd.net/)** (AI Coding Bootcamp for Global Markets). Learn to build and ship AI SaaS products for international markets using modern tools and AI-assisted development.

- 训练营官网：https://chuhai.fyyd.net/
- 微信咨询：257735

## License

[MIT](LICENSE)
