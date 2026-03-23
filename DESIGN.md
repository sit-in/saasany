# Design System — Saasany

## Product Context
- **What this is:** Production-ready Next.js template for building AI SaaS products. "Ship your AI SaaS in a weekend."
- **Who it's for:** Developers and founders who want to launch AI-powered SaaS products fast
- **Space/industry:** AI SaaS boilerplate/starter template. Peers: ShipFast, Supastarter, NEXTY.DEV, SaaSBold
- **Project type:** Hybrid — marketing landing page + dashboard web app

## Aesthetic Direction
- **Direction:** Brutally Minimal — typography and whitespace do all the design work, no unnecessary decoration
- **Decoration level:** Minimal — subtle grid texture on hero is OK; no gradient blobs, no decorative shadows, no colored circles around icons
- **Mood:** Precise, confident, tasteful. The product should feel like it was made by someone who cares about craft but doesn't show off. "The developer's developer chose this."
- **Reference sites:** ShipFast (dark/yellow, indie), Supastarter (light/orange, corporate), NEXTY.DEV (light/navy, standard), SaaSBold (light/blue, generic). Saasany differentiates with serif typography, warm emerald accent, and stripped decoration.

## Typography
- **Display/Hero:** Instrument Serif — elegant serif that creates instant differentiation from all-sans-serif competitors. Use for h1, hero headlines, and section titles on marketing pages.
- **Body:** DM Sans — clean geometric sans-serif, excellent readability at all sizes. Use for body text, UI labels, navigation, buttons.
- **UI/Labels:** DM Sans (same as body, weight 500-600 for emphasis)
- **Data/Tables:** DM Sans with `font-variant-numeric: tabular-nums` — ensures aligned columns in data views
- **Code:** Geist Mono — already in the project, excellent for code blocks and technical content
- **Loading:** Google Fonts CDN — `Instrument+Serif:ital@0;1` and `DM+Sans:wght@300;400;500;600;700`
- **Scale:**
  - Display XL: 72px / 4.5rem (hero headlines)
  - Display: 48px / 3rem (section titles)
  - H1: 36px / 2.25rem
  - H2: 28px / 1.75rem
  - H3: 22px / 1.375rem
  - H4: 18px / 1.125rem
  - Body: 16px / 1rem
  - Small: 14px / 0.875rem
  - Caption: 13px / 0.8125rem
  - Micro: 11px / 0.6875rem

## Color
- **Approach:** Restrained — one primary accent + warm neutrals. Color is meaningful and rare.
- **Primary:** `#0D9276` — warm emerald/teal. Represents growth, reliability, premium. Unique in the SaaS template space (competitors use blue/purple/yellow/orange). Works in both Chinese and Western cultural contexts.
- **Primary Dark:** `#0A7A63` — hover/active states
- **Primary Light:** `#10B090` — highlights
- **Primary 50:** `#ECFDF6` — subtle backgrounds, badges
- **Primary 100:** `#D1FAE8` — slightly more prominent backgrounds
- **Primary 900:** `#064E3B` — dark mode text on primary backgrounds
- **Foreground:** `#1C1917` — warm near-black (stone-900)
- **Foreground Secondary:** `#57534E` — secondary text (stone-600)
- **Foreground Muted:** `#A8A29E` — placeholder, disabled (stone-400)
- **Background:** `#FAFAF8` — warm off-white (not pure white, not blue-tinted)
- **Background Card:** `#FFFFFF` — card surfaces
- **Background Muted:** `#F5F5F0` — subtle sections, code blocks
- **Background Subtle:** `#EEEDEA` — borders, dividers area
- **Border:** `#E7E5E0` — default borders
- **Border Strong:** `#D6D3CD` — emphasized borders
- **Semantic:** success `#16A34A`, warning `#CA8A04`, error `#DC2626`, info `#2563EB`
- **Dark mode strategy:**
  - Background: `#141210` (warm dark)
  - Card: `#1C1A17`
  - Muted: `#252320`
  - Primary shifts to `#12B58D` (slightly lighter/brighter for contrast)
  - Borders: `rgba(245, 245, 240, 0.08)` and `0.14` for strong
  - Foreground becomes `#F5F5F0` (warm off-white)
  - Semantic colors shift to lighter variants with transparent backgrounds

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable — not cramped, not wasteful
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)

## Layout
- **Approach:** Grid-disciplined — strict columns, predictable alignment
- **Grid:** 12 columns. Mobile: 4 cols. Tablet: 8 cols. Desktop: 12 cols.
- **Max content width:** 1280px
- **Border radius:**
  - sm: 4px (small elements, badges)
  - md: 8px (buttons, inputs, cards)
  - lg: 12px (larger cards, modals)
  - full: 9999px (pills, avatars)

## Motion
- **Approach:** Minimal-functional — only transitions that aid comprehension
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150-200ms) medium(200-300ms) long(300-500ms)
- **Rules:**
  - Hover states: 50-100ms (instant feel)
  - Page transitions: 200-300ms
  - No staggered delays on hero elements (they feel sluggish)
  - Scroll-triggered animations: use `IntersectionObserver`, trigger once, 200ms ease-out

## AI Slop Blacklist
Never include these patterns in any UI or marketing page:
- Purple/violet gradients as accent
- 3-column feature grid with icons in colored circles
- Centered everything with uniform spacing (vary the rhythm)
- Uniform bubbly border-radius on all elements
- Gradient buttons as primary CTA
- Blurry gradient orbs/blobs as decoration
- "Built for X" / "Designed for Y" generic marketing copy

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-23 | Initial design system created | Created by /design-consultation. Competitive research showed all SaaS templates converge on sans-serif + blue/purple + gradient blobs. Differentiated with serif display font, warm emerald accent, and stripped decoration. |
| 2026-03-23 | Instrument Serif for display | Risk: no competitor uses serif headings. Gain: instant visual memory and brand differentiation. |
| 2026-03-23 | Warm emerald #0D9276 as primary | Risk: less "techy" than blue. Gain: unique in space, culturally versatile for 出海 positioning. |
| 2026-03-23 | Warm stone neutrals over cool grays | Pairs better with emerald primary. Cool blue-grays would clash. |
