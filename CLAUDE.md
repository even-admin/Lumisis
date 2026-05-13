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

**THE source of truth is `/Users/racosta/LUMISIS/DESIGN.md`.** Aesthetic POV is **Editorial-Clinical-Luxury**. Read DESIGN.md before any visual/component work — it specifies typography, color, motion, layout, anti-patterns, and signature elements.

Quick reference (full spec in DESIGN.md):
- Palette: `--color-background` (#FAF8F5 warm off-white), `--color-ink` (#0E0E10), `--color-accent` (#7A1F1F oxblood), `--color-paper` (#F1ECE3)
- Typography: Gotham (Light/Book/Medium/Bold/Black) + Futura Round Book (eyebrows)
- Atmosphere: global grain texture overlay (in `body::before`)
- Banned: pure white/black, purple/violet, gradient text, rounded-xl, drop-shadow, centered h2+, 3-column feature grids
- Signatures: roman numeral markers, editorial pull-quotes, kinetic h1 weight cross-fade, sticky-pin narratives

## Design Workflow (MANDATORY for any UI/component/page/style task)

Any task that touches visual presentation follows this sequence — no exceptions:

1. **Read `/Users/racosta/LUMISIS/DESIGN.md`** first. Every choice must comply with it.
2. **Invoke `frontend-design` skill** before writing code. State the aesthetic direction (Editorial-Clinical-Luxury) explicitly in the skill prompt.
3. **Build** referencing DESIGN.md tokens — no off-palette colors, no banned defaults.
4. **Screenshot via Playwright MCP** after build. Compare against the section in DESIGN.md.
5. **Self-critique with frontend-design**:
   - Swap test: could this be any other consulting firm's site? If yes — start over.
   - Squint test: from 20ft, is the hierarchy doing what it should?
6. **Run `ux-auditor` agent** for accessibility + heuristic review on substantive changes.
7. **Only then** propose commit.

Skipping steps produces bland output. The whole point of this workflow is to prevent the regression to safe/generic defaults.

### Banned defaults (auto-reject if present)
Inter as display, purple/violet/magenta, rounded corners >4px, drop-shadows, centered h2+, 3-column "feature grids," "Trusted by" decorative logo strips, emoji, generic "Get started"/"Learn more" CTAs, hero photos as wallpaper behind text, AI-slop imagery.

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
