# Vigyanics

A world-class premium educational technology website for Vigyanics — a STEM, Robotics, AI, Innovation and ATL-focused learning organization.

## Run & Operate

- `pnpm --filter @workspace/vigyanics run dev` — run the Vigyanics frontend (port 19502)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion
- Fonts: Inter, Space Grotesk, JetBrains Mono (Google Fonts)
- Icons: Lucide React
- Routing: Wouter (single-page, anchor-based)
- API: Express 5 (backend, minimal use for this landing page)

## Where things live

- `artifacts/vigyanics/src/pages/Home.tsx` — root page, assembles all sections
- `artifacts/vigyanics/src/components/` — all section components
- `artifacts/vigyanics/src/index.css` — global theme (CSS variables, animations, glassmorphism utilities)
- `artifacts/api-server/src/` — Express API server

## Color System

- Deep Space Blue: `#0B1F3A` → `hsl(214 68% 14%)`
- Electric Cyan: `#00D4FF` → `hsl(190 100% 50%)`
- Innovation Green: `#00C896` → `hsl(165 100% 39%)`
- AI Purple: `#8B5CF6` → `hsl(258 90% 66%)`

CSS utilities: `text-vigyanics-blue`, `bg-vigyanics-cyan`, `text-vigyanics-green`, `text-vigyanics-purple`

## Sections Built

1. Navbar — glassmorphism sticky nav with mobile menu
2. Hero — full-screen with animated neural network background
3. TrustStats — animated counters (5000+ students, 1200+ projects, 80+ schools, 150+ competitions)
4. ValueProp — "Learning by Doing" philosophy cards
5. Programs — 4 programs (STEM Foundations, Robotics, AI & Future Tech, Innovation Labs)
6. HowItWorks — 3-step visual journey with animated connector
7. WhyVigyanics — comparison table + floating badges
8. ForSchools — enterprise section for school decision-makers
9. ProjectShowcase — interactive project gallery with lightbox
10. SuccessStories — achievement stories with outcomes
11. Testimonials — carousel with prev/next controls
12. DesignedFor — 4 audience cards (Students, Schools, ATL Labs, Innovation Centers)
13. FinalCTA — full-width CTA with WhatsApp integration
14. Footer — multi-column with social links
15. WhatsAppButton — floating pulsing WhatsApp button

## Store (vigyanics.com/store)

A premium e-commerce store page at `/store`. Navigates to `/store/:id` for product detail pages.

- `artifacts/vigyanics/src/pages/Store.tsx` — store homepage (assembles all store sections)
- `artifacts/vigyanics/src/pages/ProductDetail.tsx` — individual product detail page
- `artifacts/vigyanics/src/components/store/` — all store section components
- `artifacts/vigyanics/src/data/products.ts` — product catalog (12 products across 10 categories)
- `artifacts/vigyanics/src/context/CartContext.tsx` — global cart + wishlist state
- `artifacts/vigyanics/src/components/store/CartDrawer.tsx` — slide-out cart drawer

Store sections: StoreHero, FeaturedCategories (10), ProductGrid (Featured / Best Sellers / New Arrivals), SchoolSolutions (ATL packs), CartDrawer, Trust strip

Navbar is context-aware: shows store nav links on `/store`, main nav links on `/`. Cart icon with animated badge lives in the Navbar globally.

## Architecture decisions

- Single-page app with anchor-based smooth scroll navigation (no multi-page routing)
- All section components are standalone, assembled in Home.tsx
- WhatsApp links use `wa.me` format — replace `919999999999` with real number
- Presentation-only site, no backend integration required
- Glassmorphism via `glass-panel` and `glass-card` CSS utility classes
- Neural network SVG background is a reusable component (`NeuralBackground.tsx`)

## User preferences

- No emojis in the UI
- Premium modern look: fusion of Apple, OpenAI, Stripe, Linear, Tesla aesthetics
- All 4 brand colors should appear meaningfully throughout (not just decoratively)

## Gotchas

- WhatsApp phone number (`919999999999`) is a placeholder — must be replaced before going live
- Google Fonts `@import url(...)` must remain the FIRST line of `index.css`
- `font-display` Tailwind class maps to Space Grotesk via `@theme inline`
- AnimatePresence with multiple children must NOT use `mode="wait"`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
