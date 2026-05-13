# CLAUDE.md — LUMISIS Website

## What This Is

Corporate website for LUMISIS, a boutique strategy/consulting/coaching firm based in Merida, Mexico. Bilingual (ES default + EN). Replaces a Framer site with a fully owned Astro build.

## Stack

- **Astro 5** (v6.3+) + TypeScript strict
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **MDX** via `@astrojs/mdx` (content collections for services and journal)
- **Sitemap** via `@astrojs/sitemap` with hreflang
- **Fonts**: Self-hosted Gotham (Light/Book/Medium/Bold/Black) + Futura Round Book — licensed to LUMISIS GROUP, declared in `src/styles/fonts.css`
- **Deploy**: GitHub Pages (staging) → Cloudflare Pages (production, later)

## Commands

```bash
npm run dev     # Astro dev server (port 4321)
npm run build   # Static build → dist/
npm run preview # Preview production build locally
```

## File Structure

```
src/
├── assets/           # Images processed by astro:assets (WebP/AVIF at build)
├── components/
│   ├── layout/       # Container, Section, Header, Footer
│   ├── ui/           # Button, Badge, Card
│   ├── sections/     # Hero, StatsBar, ServiceGrid, TeamGrid, etc.
│   └── seo/          # StructuredData, OGMeta
├── content/
│   ├── services/     # MDX service pages
│   │   ├── es/       # planeacion-estrategica.mdx, etc.
│   │   └── en/       # strategic-planning.mdx, etc.
│   └── journal/      # MDX blog posts (same es/en structure)
├── i18n/
│   ├── ui.ts         # UI string translations
│   └── utils.ts      # getLocale, t(), path helpers with BASE_URL
├── layouts/
│   ├── BaseLayout.astro      # HTML head, fonts, meta, hreflang
│   ├── PageLayout.astro      # Header + Footer wrapper
│   └── ServiceLayout.astro   # Service detail template
├── lib/
│   └── constants.ts  # Site metadata, nav items, service slugs, prefixBase()
├── pages/            # ES routes at root, EN routes at /en/
└── styles/
    └── global.css    # Design tokens, @font-face, base styles
```

## i18n

- **Spanish at root**: `/`, `/por-que-nosotros`, `/soluciones/[slug]`, `/contacto`
- **English at /en/**: `/en/`, `/en/why-us`, `/en/solutions/[slug]`, `/en/contact`
- UI strings in `src/i18n/ui.ts`
- All internal links MUST use `prefixBase()` from constants (handles GitHub Pages base path)

## Design System

**Two sources of truth, in this order:**
1. **`/Users/racosta/LUMISIS/BRANDING/Manual de identidad Lumisis _ 12 julio 2023.pdf`** — the actual LUMISIS brand book. Authoritative for all color, typography, logo usage, and photography decisions.
2. **`/Users/racosta/LUMISIS/DESIGN.md`** — code-level translation of the manual into tokens, components, motion, and banned defaults.

Aesthetic direction = **LUMISIS Brand-True** (no invented label).

Quick reference (full spec in DESIGN.md):
- Background modes: **pure white `#FFFFFF` (principal) OR brand black `#393938` (negative)** — only these two, no warm off-whites
- Ink color: `#393938` (brand black) on white, `#FFFFFF` on brand black
- Accents: brand blue `#0098DB` leads; green `#61C250` / gold `#EEAF30` / red `#DE3831` only in service contexts; brand gradient `(F5B335 → E43D30 → aa5b5e → 009ADE → 6ABF4B)` for signature moments
- Typography: Gotham (Light/Book/Medium/Bold/Black) — self-hosted, owned
- Photography of people is central — heroes use full-bleed photo + dark overlay + white display type
- Buttons: pills (`border-radius: 9999px`) or ghosts — no squares
- Signatures: letter-swipe text animation on pill CTAs, brand-blue fill on hover, brand-gradient on special moments
- Banned: warm off-whites, pure black `#000`, invented accents (oxblood etc.), purple, gradient text, drop shadows, mid-radius corners, grain textures

## Design Workflow (MANDATORY for any UI/component/page/style task)

Any task that touches visual presentation follows this sequence — no exceptions:

**Step 0 (before everything else)** — If you have *any* doubt about a color, shape, font, or aesthetic choice, open `/Users/racosta/LUMISIS/BRANDING/Manual de identidad Lumisis _ 12 julio 2023.pdf` first. **Do not invent colors. Do not invent aesthetic terminology. Do not reference external brands (Aesop, A24, McKinsey, Linear, Vercel, Stripe, etc.) as the source.** LUMISIS has its own brand book — it is THE source. If you propose a color, you must be able to quote which manual page it comes from.

1. **Read `/Users/racosta/LUMISIS/DESIGN.md`** — the code-relevant translation of the manual. Every choice must comply with it.
2. **Invoke `frontend-design` skill** before writing code. State the aesthetic direction as "LUMISIS Brand-True per manual" — do not invent labels.
3. **Build** referencing DESIGN.md tokens — no off-palette colors, no banned defaults, no warm off-whites, no invented accents.
4. **Screenshot via Playwright MCP** after build. Compare against the section in DESIGN.md *and* against the brand manual pages it derives from.
5. **Self-critique**:
   - Brand-truth test: open the manual, does this match? If you can't point to a manual page that supports the choice, the choice is wrong.
   - Swap test: could this be any other consulting firm's site? If yes — start over.
   - Squint test: from 20ft, is the hierarchy doing what it should?
6. **Run `ux-auditor` agent** for accessibility + heuristic review on substantive changes.
7. **Only then** propose commit.

Skipping Step 0 is how we got "Editorial-Clinical-Luxury with oxblood and warm off-white." That was a drift. It cost a full commit to roll back. Do not skip Step 0.

### Banned defaults (auto-reject if present)
Inter as display, warm off-whites (`#FAF8F5`, `#F1ECE3`, etc.), pure black `#000` as ink (use `#393938`), invented accent colors (oxblood, burgundy, anything not in the manual), purple/violet/magenta, rounded corners between 4px and 9999px (only rectangles or full pills), drop shadows, centered h2+, 3-column "feature grids," "Trusted by" decorative logo strips, emoji, generic "Get started"/"Learn more" CTAs, hero photos as wallpaper behind small text (use full-bleed + large display), AI-slop imagery, grain/noise overlays, roman numeral section markers, editorial pull-quotes with serif (Gotham has no serif).

## How to Add a Journal Post

Create a new MDX file in `src/content/journal/es/` (or `en/`):

```mdx
---
title: "Your Post Title"
date: 2026-05-15
author: "Author Name"
excerpt: "One-sentence summary for cards and meta description."
tags: ["strategy", "leadership"]
lang: es
translationSlug: "your-post-slug-in-other-language"
draft: false
---

Your markdown content here.
```

Then create the matching file in the other language folder with the corresponding `translationSlug`.

## How to Add a Service

1. Create MDX in `src/content/services/es/your-slug.mdx` and `en/your-slug.mdx`
2. Add the service to `SERVICES` array in `src/lib/constants.ts`
3. Update `ROUTE_MAP` in `src/i18n/utils.ts` if the service needs custom URL translation

## Conventions

- Static-by-default Astro components. React islands only when interactivity is required.
- Named exports, no `any`, strict TypeScript.
- Spanish content (es-MX) as default. Clinical, professional tone.
- Mobile-first responsive. All spacing multiples of 8px.
- `prefixBase()` on every internal `href` (required for GitHub Pages subpath).

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages.
Staging URL: `https://even-admin.github.io/LUMISIS/`

When custom domain is ready: update `site` and `base` in `astro.config.mjs`, add CNAME to `public/`.

## Reference

- `_extraction/EXTRACTION.md` — original Framer site copy, page structure, 11 client clarification items
- `_extraction/assets/originals/` — downloaded Framer CDN images by category
- `BRANDING/` (gitignored) — brand identity manual PDF with colors, fonts, logo specs
- `MEDIA/` (gitignored) — owned editorial photography (20 images, 5-16MB originals)
