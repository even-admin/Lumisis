# LUMISIS — Session Handoff

> Working doc to continue the build in a fresh chat. Not project documentation —
> delete or fold into real docs once the work is committed and stable.
> Last updated: 2026-05-14.

---

## 0. Workspace & session rooting — READ BEFORE ANYTHING

**Always launch the Claude Code session with `/Users/racosta/LUMISIS` as the working directory.**

- The LUMISIS repo is fully independent: own `.git`, own remote (`github.com/even-admin/Lumisis`), single clean worktree, own `CLAUDE.md`. Nothing is shared with the `dr-luis-merida` (Dr. Ramírez) site.
- However — the *previous* session was accidentally launched from inside a `dr-luis-merida` git worktree (`/Users/racosta/dr-luis-merida/.claude/worktrees/recursing-joliot-527c6f`). All the LUMISIS work still landed correctly on `even-admin/Lumisis main` (we `cd`'d into the right repo for every git op), but the session loaded the wrong project's `CLAUDE.md`, memory, and permissions.
- **Fix**: `cd /Users/racosta/LUMISIS` and start Claude Code from there — so it loads LUMISIS's `CLAUDE.md` and files its transcript/plan under the LUMISIS project. Running in the main checkout is fine; no worktree needed.
- `.claude/` is now gitignored in this repo, so any worktrees/launch config Claude creates won't pollute `git status`.
- One-time cleanup (do it from a `dr-luis-merida` checkout, not from a LUMISIS session): `git -C /Users/racosta/dr-luis-merida worktree remove .claude/worktrees/recursing-joliot-527c6f` then `git -C /Users/racosta/dr-luis-merida worktree prune` to clear the orphan + 3 other stale dr-luis-merida worktrees.

---

## 1. Project snapshot

- **What**: LUMISIS — bilingual consulting-firm website (Strategy · Consulting · Coaching), replacing a Framer build. Spanish is the default locale, English under `/en/`.
- **Stack**: Astro 6.3 · React 19 islands · Tailwind v4 (via `@tailwindcss/vite`, tokens in an `@theme` block, no config file) · Lenis smooth scroll · Three.js Globe island · Astro View Transitions (`ClientRouter`).
- **Repo**: `/Users/racosta/LUMISIS` → GitHub Pages, repo `even-admin/Lumisis`, `base: '/Lumisis'` (so local + prod URLs are under `/Lumisis/`).
- **Brand**: `#FFFFFF` white · `#393938` brand-black · `#0098DB` brand-blue · digital gradient gold→red→blue→green (`#F5B335 #E43D30 #009ADE #6ABF4B`). Gotham family + Futura Round. Brand manual: `BRANDING/Manual de identidad Lumisis _ 12 julio 2023.pdf` — **read it before any color/aesthetic decision**.

## 2. Dev workflow

- `npm run dev` → `http://localhost:4321/Lumisis/` — HMR. (A dev server was running this session as background task `bwofdgbpl`; in a new chat just start a fresh one.)
- `npm run build` → static `dist/`, builds 20 pages.
- **Stale-CSS caveat**: `transition:persist` components (Header, Footer) sometimes serve stale scoped CSS under HMR after many edits. If footer/header CSS changes don't show, **restart `npm run dev`** — that flushes Vite's module graph.

## 3. Git state — READ FIRST

- **`main` is up to date and pushed.** The entire home-page redesign is committed and on `even-admin/Lumisis`.
- **Latest commit**: `af25d12` — "feat(home): finish home page — Presencia composition, services mosaic, footer, CSS migration" (the whole prior session's work: Quiénes Somos scroll-progress underline, Presencia Global composition, Services 2×3 mosaic, Resonant Breakthroughs removal, footer 4-column rebuild, mobile-menu fix, page-scoped → `global.css` migration, 33→47 / 7-continentes stat fix).
- A follow-up `chore` commit gitignores `.claude/` and adds §0 of this handoff.
- **Working tree should be clean** at the start of the next session — verify with `git -C /Users/racosta/LUMISIS status`.
- GitHub Pages auto-deploys from `main` on push.

## 4. Home page — current state

Section order: **Hero → Quiénes Somos → Presencia Global → Services → Footer.**

| Section | State | Notes |
|---|---|---|
| **Hero** | Done | People-photo, dark overlay (pulled-back gradient `0.25/0.30/0.65/0.85`), white headline, pill CTAs. |
| **Quiénes Somos** | Done | Eyebrow + oversized statement (with scroll-progress brand-blue underline on "los momentos que definen el futuro") + supporting paragraph (4 brand-blue hover chips) + 3-pillar grid (numbered, hover lift + bar + label underline) + CTA. |
| **Logo Marquee** | Built, **hidden** | Gated behind `const SHOW_LOGO_BAND = false` in `index.astro` frontmatter. Two-row brand-black marquee. Flip the flag to re-enable. |
| **Presencia Global** | Done | Merged offices + stats. 2-col editorial: globe left (Three.js, `showLabels={false}`, `pinSize={0.008}`), content right (3 stats → divider that draws on reveal → 5-city directory → "Habla con un experto" CTA). Eyebrow "Trayectoria" + H2 "Presencia global." + lede. Corner accents on the grid. |
| **Services** | Done | Uniform 2×3 bento mosaic, `aspect-ratio: 4/3` tiles, 1px hairline dividers (`gap: 1px` + grid bg), image zoom + brand-blue tint + arrow nudge on hover. Tiles link to `/soluciones/{slug}`. |
| **Resonant Breakthroughs** | **Removed** | Was redundant with `/por-que-nosotros`. |
| **Footer** | Done | 4-column whitehouse-style: Navegación · Soluciones (all 6 services) · Conecta · Contacto. Brand-gradient strip on top. Bottom signature row: logo + "Hecho en Mérida, México · © LUMISIS GROUP". |

## 5. Conventions established this session — KEEP THESE

- **No scoped `<style>` blocks in `src/pages/` files.** Page-level CSS lives in `src/styles/global.css`, namespaced by section prefix: `.home-intro__*`, `.presencia*` / `.presencia-stat*` / `.city__*`, `.services*` / `.service-tile*`, `.why-us__*`. Component-scoped `<style>` *inside* `src/components/` is fine (Header, Footer keep theirs). **Reason**: Astro's `ClientRouter` doesn't reliably re-inject page-scoped `<style>` blocks on return navigation — layouts silently collapse. `global.css` is imported by `BaseLayout` and always loaded.
- **Motion vocabulary**: easing `cubic-bezier(0.16, 1, 0.3, 1)`; durations 320ms (hover) / 380ms (underline draw) / 600–700ms (reveals). Brand-blue underline-draw pattern: `::after { height: 1.5px; background: #0098DB; transform: scaleX(0); transform-origin: left center }` → `scaleX(1)` on hover/reveal.
- **Reveal system**: `[data-reveal]` + optional `data-reveal-delay="<ms>"` — IntersectionObserver in `BaseLayout.astro`. Adds `.revealed`. Respects `prefers-reduced-motion`.
- **`backdrop-filter` gotcha**: it creates a containing block for `position: fixed` descendants. Keep full-screen overlays OUT of backdrop-filtered ancestors (this is why the mobile menu is now a sibling of `<header>`, not a child).
- **Logo files**: `lumisis-white.png` (white wordmark + colored V + baked tagline) for dark backgrounds; `lumisis-color.png` (black wordmark + colored V) for light. `lumisis-icon.png` is the V alone. The white one has the "Strategy I Consulting I Coaching" tagline baked into the artwork — do NOT add a separate tagline `<p>` next to it.

## 6. Open items / follow-ups

- [ ] **Commit the uncommitted work** (see §3) — do this first.
- [ ] **Placeholder email** `hola@lumisis.com` in the footer Contacto column — confirm/replace with the real address.
- [ ] **English mirror pages** `src/pages/en/index.astro` and `src/pages/en/why-us.astro` — NOT touched this session. They still have the old structure (old static client-logo strip, old why-us preview, English stat labels, no Presencia composition, old footer logic inherited). They need the same redesign the Spanish pages got. Biggest remaining chunk of work.
- [ ] **`SHOW_LOGO_BAND` flag** stays `false` — team to confirm whether a client-logo band is used at all (placeholder logos risk competitor-conflict optics).
- [ ] **Single-source the firm's numbers** — "47 países / 7 continentes / 20 años / +800 compañías / +100k ejecutivos" appear in multiple places (home Presencia, `/por-que-nosotros` footprint + stats). Consider a `FIRM_STATS` constant in `src/lib/constants.ts` so they can't drift again. (This session fixed a 33-vs-47 drift manually.)
- [ ] **`GLOBE_PINS`** in `constants.ts` still has bilingual-mixed `name` fields, but `showLabels={false}` hides the in-globe boxes so it's cosmetic-only. The authoritative office list is the Presencia footer directory.
- [ ] Other pages (`/soluciones`, `/soluciones/*`, `/contacto`, service detail pages) — not reviewed this session. Unknown polish state.

## 7. Key files map

| File | Role |
|---|---|
| `src/pages/index.astro` | Home page. Sections + the mark-progress `<script>` (scroll listener for `--mark-progress`). No `<style>` block anymore. |
| `src/pages/por-que-nosotros.astro` | Why Us page — hero, 3 principles, Why-Us numbered list (moved here from home), partner logos, leadership team, stats, global footprint. No `<style>` block anymore. |
| `src/styles/global.css` | Global tokens (`@theme`) + reveal system + **all migrated page-level CSS** (Quiénes Somos, logo marquee, Presencia, Services, Why-Us). |
| `src/components/layout/Header.astro` | Institutional nav — transparent-over-hero → compact-white-on-scroll. Stacked logo swap. Mobile menu is a **sibling** of `<header>` (component-scoped `<style>` kept). |
| `src/components/layout/Footer.astro` | 4-column footer (component-scoped `<style>` kept). |
| `src/components/layout/BaseLayout.astro` | `<head>`, `ClientRouter`, Lenis init, `[data-reveal]` IntersectionObserver. |
| `src/components/islands/Globe.tsx` | Three.js globe. Props: `pins`, `showLabels`, `pinSize`, etc. |
| `src/components/islands/AnimatedNumber.tsx` | Count-up number island (used in Presencia + Why-Us stats). |
| `src/lib/constants.ts` | `SITE`, `NAV_ITEMS`, `SOCIAL_LINKS`, `SERVICES`, `GLOBE_PINS`, `prefixBase()`. |
| `src/lib/images.ts` | Image imports — `CLIENT_LOGOS`, `PARTNER_LOGOS`, `TEAM_MEMBERS`, `SERVICE_IMAGES`, logo variants. |

## 8. How to resume in the new chat

1. Confirm the session is rooted at `/Users/racosta/LUMISIS` (see §0).
2. Read this file.
3. `git -C /Users/racosta/LUMISIS status` — working tree should be clean, `main` up to date.
4. Start `npm run dev`, open `http://localhost:4321/Lumisis/`, sanity-check the home page.
5. Most likely next task: **English mirror pages** (§6) — port the Spanish-page redesign to `/en/`.
