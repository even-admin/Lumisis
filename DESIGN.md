# LUMISIS DESIGN.md

> **The committed aesthetic POV. Every component, page, animation, and copy decision references this document. No drift allowed without re-opening this file in conversation with the user.**

## North Star

**Editorial-Clinical-Luxury.** Institutional consulting needs gravitas + warmth. Closer to Aesop, A24 Films, McKinsey Digital, and Bloomberg Businessweek than to Linear or Vercel. Authoritative, calm, expensive-feeling, with editorial typography and warm neutrals — not startup-cool, not corporate-sterile.

The site whispers, not shouts. Premium feel comes from typographic restraint, atmospheric texture, generous whitespace, and signature moments — not from animation density.

## Anti-references (avoid)

- Linear, Stripe homepages — too startup-coded for institutional consulting
- Generic Bootstrap consulting templates — what we just escaped
- Framer Motion demo-heavy sites — performative animation undermines authority
- Apple marketing pages — too product-coded
- AI-slop tropes: purple gradients, glassmorphism on hero, rotating SaaS dashboards, "trusted by" logo strips treated as decoration

## References (study before building)

- **Aesop.com** — warm off-white, restrained type, generous whitespace, atmospheric photography
- **Bloomberg Businessweek covers** — display typography as the design itself
- **A24 Films marketing pages** — editorial layouts, oversized type, intentional asymmetry
- **McKinsey Digital reports** — institutional gravitas in long-form content
- **Aman Resorts** — calm, expensive, warm — visual quietness
- **Penguin Random House book pages** — editorial pacing, pull-quotes, breathing room

## Typography

**Fonts are the LUMISIS brand truth, not an approximation.** Use the licensed Gotham family + Futura Round Book the team owns. Drop Montserrat entirely. Self-host via Vite.

```
Display:   Gotham Black (900) / Bold (700)  → Bloomberg/Vanity-Fair gravitas
Body:      Gotham Book (400) / Light (300)
Eyebrow:   Futura Round Book → the distinctive "voice"
Numerals:  Gotham Bold + tabular-nums for stats (no layout shift on count-up)
```

### Type scale (modular, generous range)
```
12 / 14 / 16 / 18 / 24 / 32 / 48 / 72 / 96 / 144
```
144 reserved for hero on desktop. Fluid clamps in CSS:
- h1: `clamp(3rem, 8vw, 9rem)` → 48px mobile → 144px desktop
- h2: `clamp(2rem, 5vw, 4.5rem)` → 32px mobile → 72px desktop

### Tracking & line-height
- Display 700/900: `letter-spacing: -0.045em` on h1, `-0.03em` on h2, `line-height: 1.02`
- Body: `letter-spacing: 0`, `line-height: 1.6`, max width `60ch`
- Eyebrow (Futura Round): `letter-spacing: 0.22em`, uppercase, `font-size: 12px`
- Roman numerals (section markers): `letter-spacing: 0.3em`, accent color, underlined

### Weight transitions (no variable font — cross-fade weights)
Gotham isn't variable. To simulate variable-font weight reveals:
- Stack two `<span>` layers of the same word: one in Light (300), one in Black (900)
- Transition opacity over 600ms with stagger per word for hero reveals
- Don't try to fake `font-variation-settings` — use weight cross-fade instead

## Color

```
--color-background : #FAF8F5   /* warm off-white. NEVER pure white. */
--color-ink        : #0E0E10   /* near-black. NEVER pure black. */
--color-accent     : #7A1F1F   /* deep oxblood. Reserved for emphasis. */
--color-paper      : #F1ECE3   /* warm card surface */
--color-rule       : #1A1A1C   /* dividers, borders, ink rules */
--color-muted      : #6B6660   /* warm gray, secondary text */
--color-on-dark    : #F1ECE3   /* paper text on ink surfaces */
```

### Usage rules
- **Never** use pure `#000` or pure `#FFF` — they break the warm atmosphere
- **Oxblood** is reserved: section markers, primary CTAs on hover, pull-quote accent rules, key emphasis. Not for body text, not for icons in general.
- Sections alternate: `background` → `paper` → `ink` (rarely). Two-tone-light dominant, ink section used for high-contrast statement moments.
- **No** gradients except mesh atmosphere (and even those used sparingly)
- **No** neons, no purples, no violets, no electric blues
- **No** gradient text. Ever.

## Surface & Atmosphere

- **Global grain texture overlay** at 8% opacity, mix-blend-mode multiply. Implemented in `body::before` with inline SVG turbulence. Single most important "premium feel" upgrade.
- **Cards**: paper color background, 1px ink rule, no shadow. Hover transitions border to accent.
- **Sections**: alternate background and paper, rarely ink. Dividers are 1px ink-color hairlines, not gradients or thick borders.
- **No** glassmorphism, no clay-morphism, no neumorphism
- **No** drop-shadows. Period.
- Corners: max 2px radius on inputs/buttons. No `rounded-xl`, no pills. Rectangles communicate institution.

## Motion

The site moves with restraint. Scroll-linked storytelling beats hover-density.

### Allowed
- Word-by-word reveal on hero h1 (stagger 60ms, duration 700ms, cubic-bezier `(0.16, 1, 0.3, 1)`)
- Weight cross-fade on h1/h2 enter (Light → Black, 600ms)
- Scroll-triggered fade+rise reveals (data-reveal system, 28px translate, 700ms)
- Directional fill on button hover (accent color, left-to-right, 250ms)
- Sticky-pin narrative sections (Why Us 3 principles)
- AnimatedNumber count-up with tabular-nums
- Slow logo marquee (40s+, never frantic)
- View Transitions: fade-and-rise (8px) on route change, never plain fade
- Service card image scale (1.05) + saturation increase on hover
- Custom cursor: small accent dot, expands to ring on interactive elements (desktop only)

### Banned
- Bouncing elements (`spring` easings with overshoot)
- Glow effects, pulse animations on non-interactive elements
- Rotating carousels
- Animated SaaS-style dashboard previews
- Excessive parallax (slight is okay)
- Auto-playing video without explicit reduced-motion respect
- Anything that distracts from reading

### Easing
Default: `cubic-bezier(0.16, 1, 0.3, 1)` — snappy in, smooth out.
Slow movements (>500ms): same easing, longer duration. Don't switch curves casually.

### Reduced-motion
Always respected. `prefers-reduced-motion: reduce` → animations disabled, grain at 5% (still visible, no flash).

## Layout

- **Asymmetric grids**, not 12-col safety. Why Us page = 5/12 + 7/12 split, not 6/6. Hero text bleeds into space, doesn't center.
- **Generous whitespace** — 30%+ of every section. Sections rhythm: 80 / 120 / 160 / 240px vertical, not uniform.
- **Hero**: oversize display type on background-color, no hero photo (photos belong in service cards and atmosphere shots, not as wallpaper behind text).
- **Service grids**: 1 large + 2 small, or 3 small + 1 large — not uniform 3-column.
- **Stats**: oversized number with tiny label tucked into negative space. Never label-above-number.
- **Pull-quotes** between major sections as breathing moments.
- **Section padding**: section-padding utility (5rem mobile / 7.5rem tablet / 10rem desktop).

## Banned Defaults (the swap test)

If a design choice would work for *any* generic consulting firm, it doesn't belong here. Things to actively reject:

- Inter or Roboto as display
- Centered alignment on h2+
- 3-column "feature grid"
- "Trusted by" logo bar treated as decoration (use slow marquee with paper texture instead)
- Drop shadows of any kind
- Rounded corners larger than 4px
- Purple, violet, electric blue, magenta
- Gradient text (any)
- Hero photo as background with text over it (we already removed this)
- Emoji of any kind
- "Get started" / "Learn more" generic CTAs — write the actual action verb
- Stock-photo-style placeholder images
- AI-generated-looking imagery (we recognize the slop)

## Signature Elements

Every page must include at least one. These are what the user remembers.

1. **Roman numeral section markers** (I., II., III.) in oxblood, small, underlined — used for principle/process lists
2. **Editorial pull-quotes** between major sections, paper-color full-bleed, serif weight 300
3. **Global grain texture** atmosphere
4. **Kinetic h1** with weight cross-fade reveal
5. **Sticky-pin narrative** on "Why Us" (3 principles pin and reveal in sequence)
6. **Tabular-nums stats** with oversized numbers and tiny labels
7. **Custom SVG illustrations** for the 3 principles (Intention / Turning Point / Echo)
8. **Slow client logo marquee** with grain overlay
9. **Custom cursor** (desktop) — accent dot, expands to ring on interactive

## Copy Voice

- Direct, specific, calm. Never urgent, never hyped.
- No "We help you / I transform / I empower" — institutional voice, not personal-brand.
- No frameworks-as-marketing ("We use the 5C framework!"). Show, don't list.
- One idea per sentence. Tight, declarative.
- Spanish for ES (default), English for EN.
- ES voice = Mexican Spanish, professional but warm. Vos/usted balanced.
- EN voice = international English, restrained.
- Pull-quote candidates: "An echo, not an intervention." / "Resonance over reach." — short, declarative, single thought.

## Component Checklist (before commit)

For every new or modified component:

- [ ] Reads `DESIGN.md` directly or implicitly (no contradicting tokens)
- [ ] No banned defaults present
- [ ] Includes at least one signature element where appropriate
- [ ] Respects `prefers-reduced-motion`
- [ ] Tested via Playwright screenshot before commit
- [ ] Passes the swap test: would this work for any other consulting firm? If yes — start over.
- [ ] Passes the squint test: from 20 ft, can you tell what hierarchy is doing?
- [ ] Color choices justified against the palette (no off-palette accents)
- [ ] Typography uses Gotham or Futura Round only — no system font fallbacks visible

## Implementation Stack

- **Astro 6** + React 19 islands + TypeScript strict
- **Tailwind v4** via `@tailwindcss/vite` (no Tailwind config file — design tokens in `@theme` block in `global.css`)
- **Lenis** for smooth scroll
- **GSAP** allowed for scroll-triggered sticky-pin sections (the one place where the IntersectionObserver fallback isn't enough)
- **Magic UI MCP** components used sparingly — marquee, animated beam, kinetic text — only where they serve the editorial intent
- **shadcn/ui** for primitives that need accessibility (Dialog, DropdownMenu) — restyled to match DESIGN.md
- **Playwright MCP** for visual regression — every commit screenshots affected pages
- **frontend-design skill** invoked before any new design task

## How To Change This Document

This document is not a draft. Changes require:
1. Explicit user decision in conversation
2. New screenshot evidence the change makes the site better
3. Reference-site comparison showing what we're now matching

Drift happens silently. This document exists to prevent it.

---

*Last updated: 2026-05-13 (Editorial-Clinical-Luxury commit)*
*Fonts: Gotham (5 weights) + Futura Round Book — licensed to LUMISIS GROUP*
