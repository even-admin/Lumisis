# Lumisis — Framer Site Extraction

Extracted from `https://lumisis.framer.website` on 2026-05-11.

This is a structured pull of all the content, copy, and asset URLs from the current Framer site. Use it as the source-of-truth reference when rebuilding in Astro. The original Framer site stays live as a visual reference — open it side-by-side with Claude Code while building.

---

## Site map (current state)

```
/                                                        Home
/why-us                                                  Why Us
/solutions                                               Solutions hub (gallery of services)
  /solutions/sound-ethics-website                        → Strategic Planning *
  /solutions/luna-studio-rebrand                         → Strategic Offsite *
  /solutions/bloom-wellness-brand-identity               → Leadership Programs *
  /solutions/ember-coffee-co-e-commerce                  → Family Owned Business Evolution *
  /solutions/northwood-architecture-portfolio            → Executive Coaching *
  /solutions/jet-ai-platform-website                     → Culture Evolution *
/contact                                                 Contact
```

\* **The slugs are placeholders from the original Framer template.** They were never renamed when the content was switched to consulting services. In the new build, rename to clean slugs like `/solutions/strategic-planning`, `/solutions/strategic-offsite`, etc. — much better for SEO and for the client to read.

Total pages: 10. Bilingual build doubles to 20 routes (10 ES + 10 EN).

---

## Brand & global elements

- **Brand name**: LUMISIS (sometimes "Lumisis®" with registered mark, sometimes "LUMISIS GROUP")
- **Tagline / positioning line**: "Thrive Through Uncertainty"
- **Brand essence sentence**: "Unleashing the Potential of Organizations, Leaders, and Cultures."
- **Recurring motif**: *resonance / echo / intention / breakthrough / turning point*
- **Copyright**: © 2026 LUMISIS GROUP
- **Locations referenced**: "Our offices" (plural — copy on home page mentions multiple offices, contact page does not list addresses yet)

### Navigation

Top nav: Home · Why Us? · Solutions · Contact Us

### Footer

Two columns: Navigation (Home, Why Us, Solutions, Contact) and Connect (Instagram, LinkedIn, X).

⚠️ **BUG in current Framer site**: Footer "WHY US" links to `/solutions` and footer "SOLUTIONS" links to `/why-us` — they're swapped. Fix when rebuilding.

⚠️ **Legal links point to Framer's own legal pages** (`framer.com/legal/...`). Lumisis needs its own Terms and Privacy Policy.

⚠️ **Social links point to base domains** (`instagram.com`, `linkedin.com`, `x.com`) with no actual Lumisis profiles. Get the real handles from the client.

---

## Page 1 — Home (`/`)

### Hero

- Headline: **THRIVE THROUGH UNCERTAINTY**
- CTA cue: "scroll down"
- Hero image: face with sunlight (large editorial portrait)

### Brand essence band

> Unleashing the Potential of Organizations, Leaders, and Cultures.

### Client logos strip (5 logos)

Currently shown — five client logos rotating.

### Why Us section

- Eyebrow: "WHY US?"
- Headline: **WHY COMPANIES CHOOSE Lumisis®**
- Subhead: "We approach things with intention, thoughtfulness, planning and a strategic mindset."
- Section label: "OUR ADVANTAGES include:"
- Numbered list:
  1. Clear, Actionable Strategy
  2. Proven Frameworks
  3. Hands-On Implementation
  4. Transparent Costs
  5. Design for Long-Term Growth

### Stats band

⚠️ All three stats are currently placeholders showing `+0`:
- `+0` Companies
- `+0k` Impacted Executives
- `+0` Countries

→ Get real numbers from client. (Why-us page mentions "47 countries / 7 continents" — that's probably the right figure for the Countries stat.)

### Resonant breakthroughs section

- Eyebrow: "RESONANT STRATEGIC BREAKTHROUGHS"
- Body: "Everything we do is resonant, has an echo and a powerful impact on organizations, people and the planet."
- CTA: "Discover More" → `/why-us#skills-page-hero`

### Services gallery (6 service cards)

Each card has image + service name + "EXPLORE" button → `/solutions`:

1. Strategic Planning
2. Strategic Offsite
3. Culture Evolution
4. Leadership Programs
5. Executive Coaching
6. Family Business

### Offices section

- Eyebrow: "FIND US"
- Interaction cue: "ZOOM IN"
- Headline: **OUR OFFICES.**
- Body: "We ensure yours resonates with purpose, creating a lasting impact on your organization and the world."
- CTA: "CONTACT US" → `/contact`

→ No actual office addresses visible. Get from client.

---

## Page 2 — Why Us (`/why-us`)

### Hero

- Headline: **Resonant Strategic Breakthroughs**
- Background image: hands holding/passing a fire ball

### Three principles section

**1. The Power of Intention**
> We ensure that every intervention is not just active, but purposeful. Creating a powerful, positive echo that extends beyond the boardroom to impact your organization, your people, and the planet.

**2. A Definitive Turning Point**
> We aim for breakthroughs. Our goal is to generate unprecedented results that serve as a true turning point, a moment that participants profoundly recognize as a clear "before and after" in the life of their organization.

**3. The Echo**
> We do not believe in isolated actions. Everything we do is designed to be resonant. We ensure that our work vibrates with purpose long after the engagement ends.

### Our Partners (6 logos)

Six partner/client logos in a marquee/strip layout.

### Leadership Team

- Eyebrow: "EXPERTS"
- Headline: **LEADERSHIP TEAM**
- Subhead: "Our approach is defined by deep thoughtfulness, rigorous planning, and a strategic mindset."

Five team members (portraits only — no titles/bios on current site):
1. Amenoffis Acosta
2. Rosa Villa
3. Gabriel Mijares
4. Victor Zorrilla
5. Juan Benitez

→ Need from client: role/title per person, short bio per person, LinkedIn URL per person.

### Stats band (We Create an Echo)

⚠️ Placeholders:
- `+0k` workshops
- `+0k` Talent release Hours
- `+0` conferences

### Footprint section

- Headline: **OUR FOOTPRINT**
- Body: "At LUMISIS Group, we address challenges with a global mindset. We have developed projects in more than **47 countries** spread across **7 continents.**"
- Visual: world map graphic

---

## Page 3 — Solutions hub (`/solutions`)

### Hero

- Headline: **Unleashing Potential**
- Subhead: *"We turn uncertainty into a definitive turning point for your future."*
- Hero image: stylized orange figures / fire imagery

### Service grid (6 cards linking to detail pages)

Each card is image-led with title overlay. Links to the corresponding `/solutions/[placeholder-slug]` page.

---

## Pages 4–9 — Service detail pages

All six service detail pages share the same template structure (taken from `/solutions/sound-ethics-website` as the reference). Currently they share the same generic body copy — the client will need to provide service-specific copy for each. The template:

```
[Hero image]
# [SERVICE NAME]                         ← e.g. STRATEGIC PLANNING
[Project info image — circular/spotlight visual]

[Short tagline — currently: "Clarity that Thrives in Uncertainty"]

[Paragraph 1 — currently: "We move beyond static roadmaps to build resonant strategies."]

[Paragraph 2 — currently: "By approaching your future with deep intention and thoughtfulness, we help you navigate complexity and define a path that generates a powerful, lasting impact on your organization."]

Solutions in Motion
### strategic problem solving

[Two linked cards to other services]
```

### The six services and their current slugs

| Service | Current slug (placeholder) | Suggested new slug (ES) | Suggested new slug (EN) |
|---|---|---|---|
| Strategic Planning | `sound-ethics-website` | `planeacion-estrategica` | `strategic-planning` |
| Strategic Offsite | `luna-studio-rebrand` | `offsite-estrategico` | `strategic-offsite` |
| Leadership Programs | `bloom-wellness-brand-identity` | `programas-de-liderazgo` | `leadership-programs` |
| Family Owned Business Evolution | `ember-coffee-co-e-commerce` | `evolucion-empresa-familiar` | `family-business-evolution` |
| Executive Coaching | `northwood-architecture-portfolio` | `coaching-ejecutivo` | `executive-coaching` |
| Culture Evolution | `jet-ai-platform-website` | `evolucion-cultural` | `culture-evolution` |

→ **Client task**: write 200–400 word body for each service in both languages.

---

## Page 10 — Contact (`/contact`)

- Section eyebrow: "Contact Us"
- Headline: **START YOUR NEXT STRATEGIC BREAKTHROUGH**
- Body: "Collaborate with our experts to create impactful experiences together."
- Form fields: Your name*, Your Email*, Message
- Submit button

→ Form does not currently send anywhere. In the new build we'll wire to a Cloudflare Worker → email service (Resend or similar). Per the plan, we ship the site first and wire the form in a second pass.

---

## Bilingual considerations

The current Framer site is **English only**. The new build needs Spanish. Recommended approach:

- Spanish at root (`/`, `/por-que-nosotros`, `/soluciones`, `/contacto`)
- English at `/en/` (`/en/`, `/en/why-us`, `/en/solutions`, `/en/contact`)
- Defaults to Spanish since Lumisis is Mexico-based

Client needs to provide Spanish translations of all the English copy above, OR sign off on translations we draft and they review.

---

## Image inventory

All images are hosted on Framer's CDN (`framerusercontent.com/images/`). The IDs are stable. Use the included `download-assets.sh` script to pull them all to `/assets/originals/` in one go. The URLs without query strings return the original full-resolution file.

### Inventory by category

**Hero / editorial photography** (6 images, large)
- `LmJJ9lI62PIwVlYe2JRaFWqQ9qo.jpg` — Home hero (face with sunlight)
- `61Uq11PLwS4dYtwnoA7uOirhNQQ.jpg` — Home hero alt
- `jlJ91T1ffzrXZRVKp2VnWvY1oyQ.jpg` — Why Us hero (hands + fireball)
- `0g4LOdUcrJUjIt36i313PSMZPE.png` — Solutions hub hero
- `IGcVxXe9DvbSmSSgSygtiD4kfA.png` — Strategic Planning detail hero
- `PEbHLWaYPrqEgzwblChIaP2YFg.jpg` — Strategic Offsite imagery

**Service cards on home** (6 images)
- `JrOfhF8BfFDRoWLDcHh4fiWf98.png` — Strategic Planning
- `PZajiFKur0sQkqDF8jP6Yvqqxk.png` — Strategic Planning (variant)
- `2NXwFttVQ4ZZ6IyaLKVIGXuwA.png` — Strategic Planning (variant)
- `enjEK9hquCL44pQm1RLmswXlCIE.jpg` — Culture Evolution
- `0L5tEHp8sNioQ2iRxtP6RcZIEW8.jpg` — Leadership Programs
- `S5ipT0GFPQlF9HTSt79lLTAZ2Q.png` — Executive Coaching
- `WVjqZUBIRfttZMQiJ8xI0PrNOGs.jpg` — Family Business

**Client / partner logos** (11 images)
- Home strip: `78wexQZnOmOhWKSewWCYQMm6c.jpg`, `rkdJPZha71QsCIx94t3XA7FpdWY.png`, `4SWHpM6OuiMYyg3xOArzIPnNs.png`, `xr7Qk5Hm7lOdzcdAkAvRkiCQ.png`, `sSjK1Y69HNGFzPYWkPa69U1ZPl0.png`
- Why Us partners: `RGHNG521vdY1ziGJW1szIEsokM.png`, `TNi5XVCIwmh1qwR48Ec4BBbDs.png`, `TUk37nolbXzghpHGYw5vKHWJqA.png`, `53m5ij2V0UV7aIIaciVkakGYNAI.png`, `4U686mrcOZCS2fb7ir4reX1xc.png`, `crjVj1k1XrXtoqjsRxDIGsofGc.png`

**Leadership team portraits** (5 images)
- `0bzrNpTCuCmzPm8t9vVhjc7yBo.png` — Amenoffis Acosta
- `L8ZXBXemE5UNSMHoufcE24TXjHI.png` — Rosa Villa
- `hRUSUGZ3xAYccRnkgl2HRYApHS4.png` — Gabriel Mijares
- `IIqDRYppJ0NSdXAx9uDbZikHA.png` — Victor Zorrilla
- `AXytjTLh90TbiTcd19egap6k6Q.png` — Juan Benitez

**Why Us editorial / branding imagery** (5 images)
- `U3FIhc2e4J2i5DxkVUuF40GPoE.png` — Branding visual
- `bTHIIHsHsyhDVSG4MKOIm26Q.png` — Web dev / design visual
- `Y4v9lXk9joXQ2ceX7pXa5MW4tU.png` — Web dev / design (variant)
- `bYgdwjbzXNu9zQIExzaQBJr08eM.png` — Videography / photography
- `iXQnSHRdp3DJE0310JFg24DHZ0.png` — Videography / photography (variant)

**Map / footprint**
- `CFFj0RkiqKIbQ4a00pcJXnxSfY.png` — World footprint map (47 countries / 7 continents)

**Service detail page imagery**
- `ZdbzA6wYwTbVNfpPyd0FD1PJZk.png` — Strategic Planning "project info" graphic

→ Five more service detail pages haven't been fully crawled here (Luna Studio, Bloom Wellness, Ember Coffee, Northwood, Jet AI). Each likely has 1 hero + 1 info image. The `download-assets.sh` script will fetch what's been catalogued; the bash helper at the bottom of that script crawls those remaining pages and appends their image URLs.

Total catalogued so far: **34 unique images**.

---

## Things to fix / clarify before / during the rebuild

1. **Renaming service slugs** (see table above) — non-negotiable for SEO and client legibility
2. **Footer nav bug** (WHY US / SOLUTIONS labels swapped)
3. **Real stat numbers** in three places (home, why-us)
4. **Office addresses** for the contact / footer
5. **Real social media URLs** (or remove if not yet active)
6. **Real Terms & Conditions and Privacy Policy** pages (currently link to Framer's own)
7. **Service body copy** — 200–400 words per service, in both languages
8. **Team member titles + bios + LinkedIn URLs**
9. **Spanish translations** for everything
10. **A real OG/share image** (currently the site has no custom OG image — just text titles)
11. **Favicon** (the current one is the Framer default)

---

## Next step

Run `./download-assets.sh` in this folder to pull all the catalogued images down into `./assets/originals/`. Then move this entire folder into the new Astro project repo as `/_extraction/` so Claude Code has the full reference. The README.md explains the suggested handoff into the Astro build.
