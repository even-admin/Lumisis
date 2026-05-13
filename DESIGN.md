# LUMISIS DESIGN.md — Brand-True

> **The source of truth is `/Users/racosta/LUMISIS/BRANDING/Manual de identidad Lumisis _ 12 julio 2023.pdf`. This document translates the manual into code-relevant tokens. When in doubt, open the manual first. Do not invent colors, do not borrow external aesthetics, do not reference Aesop / A24 / McKinsey / Linear as design sources — LUMISIS has its own brand, follow it.**

## North Star

**LUMISIS Brand-True: people-focused institutional consulting, executed with the brand's actual color system and Gotham typography.**

LUMISIS does Strategy, Consulting, and Coaching. The brand markets to executives and organizations going through transformation. **Photography of people is central** — every major page should center the people LUMISIS works with. Backgrounds are **white-principal or black-negative only** (no warm off-whites, no creams, no paper tones). The brand has four corporate colors plus a digital gradient — use them as the system, not as a single accent.

## Previous Drift (so it doesn't happen again)

A previous design pass invented an "Editorial-Clinical-Luxury" aesthetic with oxblood (#7A1F1F), warm off-white (#FAF8F5), cream paper (#F1ECE3), and grain texture. **None of those are LUMISIS.** They were external aesthetic borrows. This document is the corrective.

## Color Corporativo (manual page 9)

| Token | HEX | Pantone | Role |
|-------|-----|---------|------|
| `--color-brand-black` | `#393938` | Pantone Black 100% | Primary ink + brand-black background. R57 G57 B56 — slight warm dark gray, NOT pure black |
| `--color-brand-blue` | `#0098DB` | Pantone 2925 C | **Primary digital accent** — institutional/strategic |
| `--color-brand-green` | `#61C250` | Pantone 360 C | Secondary — Well-being / Coaching contexts |
| `--color-brand-gold` | `#EEAF30` | Pantone 143 C | Tertiary — Strategy contexts |
| `--color-brand-red` | `#DE3831` | Pantone 179 C | Emphasis — Consulting / urgency |
| `--gradient-brand` | `#F5B335 → #E43D30 → #aa5b5e → #009ADE → #6ABF4B` | Digital media | **Signature moments only** — logo Vs, hero secondary CTAs, dividers |

### Grayscale (derived from brand black per manual page 9)
- 100% — `#393938` (brand black)
- 80% — `#5B5B5A`
- 60% — `#7C7C7B`
- 50% — `#9C9C9B`
- 30% — `#C4C4C3`
- 10% — `#ECECEC` (UI surface)

## Surface Modes — Only Two Valid (manual page 14)

- **Principal**: `#FFFFFF` (pure white). Use for most sections.
- **Negative**: `#393938` (brand black). Use for high-contrast statement moments, hero photos with dark overlay, and "sobre imagen oscura" treatments.

**No third tone.** No warm off-whites, no cream, no paper, no beige, no bone. The brand book is explicit: white or black.

## Accent System (locked in)

**Brand blue leads, others situational.**
- **Default accent** = `--color-brand-blue` (#0098DB). Use for primary CTAs, link hovers, focus rings, default UI accents, hover-fill on pill buttons.
- **Green / Gold / Red** appear only in their service contexts (Well-being/Coaching → green; Strategy → gold; Consulting → red). Don't sprinkle these as general accents.
- **Brand gradient** is for signature moments: logo V, hero secondary CTA hovers, dividers between major sections. Not every accent.

## Typography (manual page 12)

**Gotham** is the corporate typeface. Self-hosted, owned by LUMISIS GROUP.

Available weights:
- Light (300)
- Book (400)
- Medium (500)
- Bold (700)
- Black (900)

The manual specifies Light, Book, and Bold explicitly. Medium and Black were included in the licensed package and used where they fit the editorial intent.

### Type roles
- **Display (h1)**: Gotham Black (900), `clamp(2.5rem, 7vw, 7.5rem)`, `letter-spacing: -0.04em`, `line-height: 1.02`
- **Display (h2)**: Gotham Bold (700), `clamp(2rem, 4.5vw, 4rem)`, `letter-spacing: -0.025em`
- **Body**: Gotham Book (400), 18px, `line-height: 1.6`, max-width 62ch
- **Lede / subtitle**: Gotham Light (300), 18–22px (`clamp`)
- **Eyebrow**: Gotham Medium (500), 12px uppercase, `letter-spacing: 0.18em`
- **Numerals**: Gotham Bold with `font-feature-settings: 'tnum'` for layout-stable count-ups

## Photography (manual page 15)

Photography of people is **central** to the brand. The manual shows two valid logo applications over imagery:
- **Sobre imagen oscura** (over dark image) → white logo
- **Sobre imagen clara** (over light image) → black logo

**The hero is people-photography with dark overlay** — this is the LUMISIS signature, not an editorial type-hero on neutral background. Photos should show people in moments of transformation, decision, leadership, or engagement. No stock-photo clichés (no fake smiling teams around laptops), no AI-generated imagery.

## Hero Spec (locked in)

**Home page hero = black-negative mode with people photo:**
- Full-bleed photo (heroHomeAlt or equivalent)
- Dark overlay gradient: 55% top → 35% middle → 75% bottom
- Eyebrow in white Gotham Medium with brand-blue 1px underline
- h1 in white Gotham Black at `clamp(2.5rem, 7vw, 7.5rem)`
- Subtitle in Gotham Light, white at 82% opacity
- **Two pill CTAs**: solid white (fills brand-blue on hover) + outline white (fills white→black on hover). Both use letter-swipe animation
- Header is dark and overlaps the hero (the dark overlay handles contrast)
- **No white band below the hero** — next section flows directly

Why-us and solutions pages use white-principal mode with photography insets where appropriate.

## Buttons (LUMISIS-true)

**No square plain buttons. Two valid shapes:**

### Pill (primary CTA) — `.cta-pill`
- `border-radius: 9999px`
- Three variants:
  - **Solid** (`--solid`): white pill on dark hero → fills brand-blue on hover (text inverts to white)
  - **Outline** (`--outline`): transparent border → fills white on dark / blue on light
  - **Gradient** (`--gradient`): brand-black pill → fills with brand digital gradient on hover (signature moments only)
- Always with **letter-swipe** text animation: each letter is two stacked spans, top translates up off-screen while bottom (clone) translates in from below, stagger 18ms per character
- Padding: 1rem 2rem
- Letter-spacing: 0.14em uppercase

### Ghost (secondary/inline) — `.cta-ghost`
- Borderless, no background
- 1px brand-blue underline animates from 0 to scaleX(1) on hover (left-origin)
- Same letter-spacing and case as pill

**Banned button patterns**: square outlines, rounded-md (4–8px corners), drop shadows, gradient borders, neon glows, "Get started"-style fills with no character.

## Motion

- **Easing default**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy in, smooth out)
- **Scroll reveals**: `[data-reveal]` opacity 0 + translateY 28px → opacity 1 + translateY 0, 700ms
- **Letter-swipe**: signature CTA interaction, 380ms per letter with 18ms stagger
- **Pill fills**: 480ms left-to-right
- **View transitions**: fade + 6px translate on route change
- **AnimatedNumber**: count-up with tabular-nums, easeOutExpo, 2s
- **Reduced motion**: always respected — animations disabled, transitions to 0.01ms

## Layout

- Mobile-first responsive
- 8px spacing grid
- Section padding: 5rem mobile / 7.5rem tablet / 9rem desktop
- Site max-width: 80rem
- Content max-width: 65rem
- Body copy max-width: 62ch

## Banned Defaults (auto-reject if present)

- Inter or Roboto as display (use Gotham)
- Warm off-whites or creams as background (`#FAF8F5`, `#F1ECE3`, etc. — invented, not LUMISIS)
- Pure black `#000` as ink (use `#393938` brand black)
- Pure white in dark sections (`#FFFFFF` ink only, no off-whites)
- Oxblood, burgundy, deep wine, or any invented accent
- Purple, violet, magenta
- Gradient text
- Drop shadows (any)
- Rounded corners between 4px and 9999px (only sharp rectangles or full pills)
- Grain or noise texture overlays
- Glassmorphism, clay-morphism, neumorphism
- "Trusted by" logo bars treated as decoration (use static logo rows or marquee with purpose)
- Centered alignment on h2+
- 3-column "feature grid" (use asymmetric layouts)
- Generic "Get started"/"Learn more" CTAs (write the actual action verb)
- Roman numeral section markers (not brand)
- Editorial pull-quotes with serif (Gotham doesn't include a serif)
- AI-generated-looking imagery
- Hero photos centered behind small h1 text (we use full-bleed photo + dark overlay + large h1)

## Component Checklist (before commit)

For every new or modified component:

- [ ] Followed Design Workflow Step 0 (read brand manual if any doubt)
- [ ] Reads `DESIGN.md` tokens, no off-palette colors
- [ ] No banned defaults present
- [ ] Photography of people is used where the section is about people (Why Us, Team, Hero)
- [ ] Pure white or brand-black backgrounds only
- [ ] Brand blue is the lead accent; green/gold/red only in service contexts
- [ ] Buttons are pills or ghosts — no squares
- [ ] Letter-swipe animation on primary CTAs
- [ ] Respects `prefers-reduced-motion`
- [ ] Tested via Playwright screenshot before commit
- [ ] Passes the swap test: would another consulting firm use this? If yes — reconsider what's distinctively LUMISIS about it
- [ ] Side-by-side compared against the brand manual pages 9, 12, 14, 15

## Implementation Stack

- Astro 6 + React 19 islands + TypeScript strict
- Tailwind v4 via `@tailwindcss/vite` (no Tailwind config file — tokens in `@theme` block in `global.css`)
- Lenis smooth scroll
- shadcn/ui for accessibility primitives (Dialog, DropdownMenu) — restyled to match DESIGN.md
- Magic UI MCP components used **sparingly** — marquee for client logos, animated beam only where it serves a brand moment
- Playwright MCP for visual verification — every commit screenshots affected pages
- `frontend-design` skill invoked before any new visual task

## How To Change This Document

This document is not a draft. Changes require:
1. Explicit user decision in conversation
2. A new entry in the brand manual that supports the change (we follow the manual, not the other way around)
3. Screenshot evidence the change makes the site more LUMISIS, not more like another brand

Drift happens silently. This document exists to prevent it.

---

*Last updated: 2026-05-13 — corrected from invented "Editorial-Clinical-Luxury" back to actual LUMISIS brand identity per manual.*
*Brand fonts: Gotham (Light/Book/Medium/Bold/Black) + Futura Round Book — licensed to LUMISIS GROUP, self-hosted via `src/styles/fonts.css`.*
*Brand manual: `/Users/racosta/LUMISIS/BRANDING/Manual de identidad Lumisis _ 12 julio 2023.pdf`*
