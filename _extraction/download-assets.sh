#!/usr/bin/env bash
# download-assets.sh
# Pulls all catalogued Lumisis Framer CDN assets into ./assets/originals/
# Then crawls the remaining service detail pages and appends any missed images.
#
# Usage:
#   chmod +x download-assets.sh
#   ./download-assets.sh
#
# Requirements: curl, grep, sort (all standard on macOS and Linux)

set -euo pipefail

OUTDIR="./assets/originals"
mkdir -p "$OUTDIR"

CDN="https://framerusercontent.com/images"

# All image IDs catalogued from the four main pages + Strategic Planning detail.
# Format: ID|EXT|CATEGORY|DESCRIPTION
IMAGES=(
  # Hero / editorial
  "LmJJ9lI62PIwVlYe2JRaFWqQ9qo|jpg|hero|home-hero-face-with-sunlight"
  "61Uq11PLwS4dYtwnoA7uOirhNQQ|jpg|hero|home-hero-alt"
  "jlJ91T1ffzrXZRVKp2VnWvY1oyQ|jpg|hero|why-us-hero-hands-fireball"
  "0g4LOdUcrJUjIt36i313PSMZPE|png|hero|solutions-hub-hero"
  "IGcVxXe9DvbSmSSgSygtiD4kfA|png|hero|strategic-planning-detail-hero"

  # Service cards (home)
  "JrOfhF8BfFDRoWLDcHh4fiWf98|png|services|strategic-planning-1"
  "PZajiFKur0sQkqDF8jP6Yvqqxk|png|services|strategic-planning-2"
  "2NXwFttVQ4ZZ6IyaLKVIGXuwA|png|services|strategic-planning-3"
  "PEbHLWaYPrqEgzwblChIaP2YFg|jpg|services|strategic-offsite"
  "enjEK9hquCL44pQm1RLmswXlCIE|jpg|services|culture-evolution"
  "0L5tEHp8sNioQ2iRxtP6RcZIEW8|jpg|services|leadership-programs"
  "S5ipT0GFPQlF9HTSt79lLTAZ2Q|png|services|executive-coaching"
  "WVjqZUBIRfttZMQiJ8xI0PrNOGs|jpg|services|family-business"

  # Client logos (home strip)
  "78wexQZnOmOhWKSewWCYQMm6c|jpg|logos-clients|home-client-1"
  "rkdJPZha71QsCIx94t3XA7FpdWY|png|logos-clients|home-client-2"
  "4SWHpM6OuiMYyg3xOArzIPnNs|png|logos-clients|home-client-3"
  "xr7Qk5Hm7lOdzcdAkAvRkiCQ|png|logos-clients|home-client-4"
  "sSjK1Y69HNGFzPYWkPa69U1ZPl0|png|logos-clients|home-client-5"

  # Partner logos (why-us)
  "RGHNG521vdY1ziGJW1szIEsokM|png|logos-partners|partner-1"
  "TNi5XVCIwmh1qwR48Ec4BBbDs|png|logos-partners|partner-2"
  "TUk37nolbXzghpHGYw5vKHWJqA|png|logos-partners|partner-3"
  "53m5ij2V0UV7aIIaciVkakGYNAI|png|logos-partners|partner-4"
  "4U686mrcOZCS2fb7ir4reX1xc|png|logos-partners|partner-5"
  "crjVj1k1XrXtoqjsRxDIGsofGc|png|logos-partners|partner-6"

  # Leadership team portraits
  "0bzrNpTCuCmzPm8t9vVhjc7yBo|png|team|amenoffis-acosta"
  "L8ZXBXemE5UNSMHoufcE24TXjHI|png|team|rosa-villa"
  "hRUSUGZ3xAYccRnkgl2HRYApHS4|png|team|gabriel-mijares"
  "IIqDRYppJ0NSdXAx9uDbZikHA|png|team|victor-zorrilla"
  "AXytjTLh90TbiTcd19egap6k6Q|png|team|juan-benitez"

  # Why-us editorial visuals
  "U3FIhc2e4J2i5DxkVUuF40GPoE|png|editorial|why-us-branding"
  "bTHIIHsHsyhDVSG4MKOIm26Q|png|editorial|why-us-webdev-1"
  "Y4v9lXk9joXQ2ceX7pXa5MW4tU|png|editorial|why-us-webdev-2"
  "bYgdwjbzXNu9zQIExzaQBJr08eM|png|editorial|why-us-video-1"
  "iXQnSHRdp3DJE0310JFg24DHZ0|png|editorial|why-us-video-2"

  # Map
  "CFFj0RkiqKIbQ4a00pcJXnxSfY|png|map|footprint-world-map"

  # Service detail page info graphics
  "ZdbzA6wYwTbVNfpPyd0FD1PJZk|png|service-info|strategic-planning-info"
)

echo "Downloading ${#IMAGES[@]} catalogued images to $OUTDIR ..."

for entry in "${IMAGES[@]}"; do
  IFS='|' read -r id ext category desc <<< "$entry"
  catdir="$OUTDIR/$category"
  mkdir -p "$catdir"
  out="$catdir/${desc}.${ext}"
  if [[ -f "$out" ]]; then
    echo "  skip (exists): $out"
    continue
  fi
  url="$CDN/$id.$ext"
  printf "  fetching: %-50s → %s\n" "$id.$ext" "$out"
  curl -sSL "$url" -o "$out"
done

echo ""
echo "Done with catalogued images."
echo ""
echo "Now crawling the 5 service detail pages that weren't fully extracted..."
echo "(Strategic Planning was already extracted above.)"

REMAINING_PAGES=(
  "https://lumisis.framer.website/solutions/luna-studio-rebrand"
  "https://lumisis.framer.website/solutions/bloom-wellness-brand-identity"
  "https://lumisis.framer.website/solutions/ember-coffee-co-e-commerce"
  "https://lumisis.framer.website/solutions/northwood-architecture-portfolio"
  "https://lumisis.framer.website/solutions/jet-ai-platform-website"
)

EXTRA_DIR="$OUTDIR/service-details-extra"
mkdir -p "$EXTRA_DIR"
TRANSCRIPTS_DIR="./page-transcripts"
mkdir -p "$TRANSCRIPTS_DIR"

for url in "${REMAINING_PAGES[@]}"; do
  slug=$(basename "$url")
  echo ""
  echo "  Crawling $slug ..."

  # Save the raw HTML for the rebuild reference
  curl -sSL "$url" -o "$TRANSCRIPTS_DIR/${slug}.html"

  # Extract framerusercontent image URLs from the HTML
  grep -oE 'https://framerusercontent\.com/images/[A-Za-z0-9._-]+\.(png|jpg|jpeg|webp|svg)' \
    "$TRANSCRIPTS_DIR/${slug}.html" \
    | sort -u \
    | while read -r imgurl; do
        filename=$(basename "$imgurl")
        out="$EXTRA_DIR/${slug}--${filename}"
        if [[ -f "$out" ]]; then
          echo "    skip (exists): $out"
          continue
        fi
        echo "    fetching: $filename"
        curl -sSL "$imgurl" -o "$out"
      done
done

echo ""
echo "Complete."
echo ""
echo "Assets saved to:    $OUTDIR/"
echo "Page transcripts:   $TRANSCRIPTS_DIR/"
echo ""
echo "Next: review the extra service detail images and merge any that should"
echo "live alongside the main service cards. Then move this whole folder into"
echo "the new Astro project as /_extraction/ for Claude Code to reference."
