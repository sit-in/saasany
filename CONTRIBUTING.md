# Contributing to Saasany

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/sit-in/saasany.git
cd saasany

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Fill in the required values (see .env.example for details)

# 4. Start dev server
npm run dev
```

## Code Conventions

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui. Use `cn()` from `@/lib/utils` for conditional classes.
- **Icons:** Always use `lucide-react`.
- **i18n:** All user-facing text must go through `next-intl`. Never hardcode strings.

### i18n Rules

This is the most common source of issues. When adding or changing text:

1. Add the key to **both** `src/i18n/messages/en.json` and `src/i18n/messages/zh.json`
2. Keys must be identical across both files
3. Server components: `const t = await getTranslations('namespace')`
4. Client components: `const t = useTranslations('namespace')`
5. Navigation: always use `import { Link } from '@/i18n/navigation'`

### Route Groups

- `src/app/[locale]/(auth)/` — Auth pages (sign-in, sign-up)
- `src/app/[locale]/(dashboard)/` — Protected pages (session check in layout)
- `src/app/[locale]/(marketing)/` — Public pages (landing, blog, legal)
- `src/app/api/` — API routes (no i18n middleware)

### Auth Patterns

- Server: `const session = await auth.api.getSession({ headers: await headers() })`
- Client: `import { useSession } from '@/lib/auth-client'`
- Never use `useSession` in server components

### Database

- ORM: Drizzle with Neon PostgreSQL (HTTP driver)
- Schema: `src/lib/db/schema.ts`
- No `db.transaction()` — Neon HTTP driver doesn't support it

## Pull Request Process

1. Create a branch from `main`
2. Make your changes (one feature per commit)
3. Ensure `npm run build` passes
4. Ensure `npm run lint` passes
5. Submit a PR with a clear description

### PR Title Format

```
feat: add new component
fix: resolve auth redirect issue
docs: update deployment guide
refactor: simplify pricing logic
```

## Reporting Issues

- Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) template for bugs
- Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) template for ideas
- Include reproduction steps and environment details

## Design System

All visual decisions follow `DESIGN.md`. Read it before making UI changes. Key points:

- **Fonts:** Instrument Serif (headings) + DM Sans (body) + Geist Mono (code)
- **Primary color:** Warm emerald `#0D9276`
- **Neutrals:** Warm stone grays (not cool blue-grays)

Do not deviate from the design system without discussion.
