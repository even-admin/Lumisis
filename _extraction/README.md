# Lumisis — Extraction Package

This folder is everything we pulled out of the live Framer site (`lumisis.framer.website`) on 2026-05-11, organized so it's directly usable when rebuilding in Astro with Claude Code.

## What's in here

```
lumisis-extraction/
├── README.md            ← you are here
├── EXTRACTION.md        ← all page content, copy, structure, bugs found, things to clarify with client
└── download-assets.sh   ← bash script that pulls all images to ./assets/originals/ and crawls remaining pages
```

After running the script, you'll also have:

```
├── assets/originals/         ← all images, organized by category (hero, services, team, logos, etc.)
└── page-transcripts/         ← raw HTML of the 5 service detail pages we didn't fully extract here
```

## How to use this

### Step 1 — Download all the assets

```bash
chmod +x download-assets.sh
./download-assets.sh
```

That'll pull all 34 catalogued images plus crawl the remaining 5 service detail pages. Takes about a minute.

### Step 2 — Review with the client

Open `EXTRACTION.md` and walk through it with the Lumisis team. There are 11 specific things they need to clarify, decide on, or provide — listed under "Things to fix / clarify" near the bottom. Most important to nail down before development:

- Real stat numbers (3 places have `+0` placeholders)
- Team titles, bios, LinkedIn URLs
- Office addresses
- Service-specific body copy (200–400 words per service)
- Spanish translations (or sign-off on translations we draft)

### Step 3 — Hand off to the Astro build

When the Astro project repo is created, move this entire folder in as `/_extraction/`. The underscore prefix keeps it out of the build, but it'll be sitting right next to your source code so Claude Code can read from it during development.

Recommended structure inside the new Astro repo:

```
lumisis-web/
├── _extraction/         ← THIS FOLDER, copied in whole
│   ├── EXTRACTION.md
│   ├── assets/originals/
│   └── page-transcripts/
├── src/
│   ├── content/         ← markdown files for services & journal
│   ├── pages/           ← ES and EN routes
│   └── ...
├── public/
│   └── assets/          ← optimized assets actually used in the build
└── CLAUDE.md            ← project conventions for ongoing Claude Code work
```

Then when you tell Claude Code to build the home page, it can read `_extraction/EXTRACTION.md` for the copy and reference `_extraction/assets/originals/hero/home-hero-face-with-sunlight.jpg` directly.

## Why this approach instead of running a Framer scraper

For a 4-page site (10 with sub-routes), running a Puppeteer-based scraper would have produced:

- A ZIP of minified, runtime-dependent HTML that isn't really usable code
- Asset files (which we already have, more cleanly, here)
- A lot of build setup

What you have in this folder is more directly useful: clean structured copy organized by page, image URLs labeled by purpose, and a flat asset library categorized by function. Better starting point for a clean Astro rebuild.

## Important caveat about asset rights

The Framer site uses stock-looking editorial photography (faces, hands, fireballs, etc.). Before publishing the new build:

- Confirm with the client that they have **commercial usage rights** for every photograph
- If any are templated/placeholder images from Framer's library, **replace them**
- Same for the client/partner logos — confirm permission to display each one

The logos especially: showing a client logo implies a working relationship. Some require explicit permission to use in marketing materials.

## Once this is done — next conversation

When you're ready, we move to scaffolding the actual Astro repo: i18n setup, content collections, typography, layouts, Cloudflare Pages deployment. That conversation can be in Claude Code locally so it operates directly on the filesystem.
