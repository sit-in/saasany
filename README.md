# Sassany

A production-ready Next.js template for building AI SaaS products. Ship your AI SaaS in a weekend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Drizzle ORM + Neon (PostgreSQL) |
| Auth | Better Auth |
| Payments | Stripe (Checkout + Portal) |
| AI | Vercel AI SDK (OpenAI) |
| Email | Resend |
| i18n | next-intl (EN/ZH) |
| Deployment | Vercel |

## Features

- **Authentication** - Email/password + GitHub OAuth, session management
- **Payments** - Stripe subscriptions, checkout, customer portal, webhooks
- **AI Integration** - Streaming chat, text generation, configurable models
- **Dashboard** - Collapsible sidebar, stats cards, settings, billing
- **Admin Panel** - User management, subscription stats, role-based access
- **Blog** - MDX-based with i18n support
- **API Keys** - Generate, list, revoke API keys
- **Internationalization** - English and Chinese out of the box
- **Dark Mode** - System-aware theme switching
- **SEO** - Sitemap, robots.txt, OG images, metadata API
- **Email Templates** - Welcome and subscription confirmation
- **Legal Pages** - Privacy Policy, Terms of Service

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url> my-saas
cd my-saas
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your values:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | [Neon Console](https://console.neon.tech) |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3000/api/stripe/webhook` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) |
| `GITHUB_CLIENT_ID` | [GitHub OAuth Apps](https://github.com/settings/developers) (optional) |

### 3. Set up database

```bash
npm run db:push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── [locale]/                 # i18n routes
│   │   ├── (auth)/               # Sign in, sign up, forgot password
│   │   ├── (dashboard)/          # Dashboard, settings, billing, AI, admin
│   │   ├── (marketing)/          # Blog, pricing, privacy, terms
│   │   └── page.tsx              # Landing page
│   └── api/
│       ├── ai/                   # Chat and generation endpoints
│       ├── auth/                 # Better Auth handler
│       ├── keys/                 # API key management
│       ├── og/                   # OG image generation
│       └── stripe/               # Checkout, webhook, portal
├── components/
│   ├── dashboard/                # Sidebar, header
│   ├── emails/                   # Email templates
│   ├── landing/                  # Hero, features, pricing sections
│   ├── layout/                   # Header, footer, theme, locale
│   └── ui/                       # shadcn components
├── config/
│   └── site.ts                   # Site config and pricing plans
├── content/
│   └── blog/                     # MDX blog posts (en/zh)
├── i18n/
│   ├── messages/                 # Translation files
│   ├── config.ts                 # Locale settings
│   ├── navigation.ts             # i18n-aware navigation
│   └── routing.ts                # Route definitions
└── lib/
    ├── ai.ts                     # AI model config
    ├── auth.ts                   # Better Auth server config
    ├── auth-client.ts            # Better Auth client
    ├── blog.ts                   # Blog utilities
    ├── db/                       # Drizzle schema and connection
    ├── email.ts                  # Resend email functions
    ├── stripe.ts                 # Stripe instance
    └── utils.ts                  # Utility functions
```

## Database Commands

```bash
npm run db:generate    # Generate migration files
npm run db:migrate     # Run migrations
npm run db:push        # Push schema directly (dev)
npm run db:studio      # Open Drizzle Studio
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy

### Stripe Webhook (Production)

Create a webhook endpoint in Stripe Dashboard pointing to:
```
https://yourdomain.com/api/stripe/webhook
```

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Customization

### Change branding
- Edit `src/config/site.ts` for site name, description, and links
- Replace logo in `src/components/layout/header.tsx`
- Update colors in `src/app/globals.css`

### Add a new language
1. Add locale to `src/i18n/config.ts`
2. Create translation file in `src/i18n/messages/`
3. Add blog content in `src/content/blog/<locale>/`

### Change AI model
Edit `src/lib/ai.ts` to switch between OpenAI, Anthropic, or other providers supported by Vercel AI SDK.

### Add pricing plans
Edit `src/config/site.ts` and create corresponding Stripe price IDs.

## License

MIT
