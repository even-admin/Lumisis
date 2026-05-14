"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"

/**
 * FootprintMap — a static, flat (equirectangular) world dot-map.
 *
 * Reuses the visual language of Globe.tsx (brand-blue coastline + interior
 * dots sampled from world-atlas land data, gold office pins) but renders a
 * single static frame to a 2D canvas — no Three.js, no animation, no
 * interaction. Same CDN data sources as the globe, so no new npm deps.
 */

export interface Pin {
  lon: number
  lat: number
}

interface FootprintMapProps {
  pins: Pin[]
  className?: string
}

// Same CDN sources the globe uses.
const LAND_URLS = [
  "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json",
  "https://unpkg.com/world-atlas@2/land-110m.json",
]
const URL_TOPO = "https://esm.sh/topojson-client@3?bundle"

// Equirectangular viewport — clip empty Antarctica for a clean "world view"
// (the globe drops the same polar mass in filterNonPolarPolys). LAT_TOP 84
// keeps the full northern landmass; the container's aspect-ratio (18/7 in
// global.css) matches 360/LAT_RANGE so the map fills with no letterbox.
const LAT_TOP = 84
const LAT_BOTTOM = -56
const LAT_RANGE = LAT_TOP - LAT_BOTTOM

const EDGE_STEP_DEG = 0.7 // coastline sampling density
const FILL_STEP_DEG = 1.5 // interior hex-grid density

// Module-scope cache — survives client-side (View Transition) navigations.
let CACHE: { edge: Float32Array; fill: Float32Array } | null = null

type Ring = number[][] // [lon, lat][]
type Poly = Ring[] // [outerRing, ...holes]

function wrapLon(lon: number): number {
  return ((lon + 540) % 360) - 180
}

// ── Land data (adapted from Globe.tsx getLand) ──
async function getLandPolys(): Promise<Poly[]> {
  let topo: unknown = null
  for (const u of LAND_URLS) {
    try {
      const r = await fetch(u, { cache: "force-cache" })
      if (r.ok) {
        topo = await r.json()
        break
      }
    } catch {
      /* try next mirror */
    }
  }
  if (!topo) throw new Error("land data unavailable")
  const mod = (await import(/* @vite-ignore */ URL_TOPO)) as {
    feature: (t: unknown, o: unknown) => { features?: Array<{ geometry?: { type: string; coordinates: unknown } }> }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const land = mod.feature(topo, (topo as any).objects.land)
  const polys: Poly[] = []
  ;(land.features || []).forEach((f) => {
    const g = f.geometry
    if (!g) return
    if (g.type === "Polygon") {
      polys.push(g.coordinates as Poly)
    } else if (g.type === "MultiPolygon") {
      ;(g.coordinates as Poly[]).forEach((p) => polys.push(p))
    }
  })
  return polys
}

// ── Coastline-edge dots (adapted from Globe.tsx sampleEdgeFlat) ──
function sampleEdge(polys: Poly[]): Float32Array {
  const out: number[] = []
  for (const poly of polys) {
    for (const ring of poly) {
      for (let i = 0; i < ring.length - 1; i++) {
        const lon1 = ring[i][0]
        const lat1 = ring[i][1]
        let lon2 = ring[i + 1][0]
        const lat2 = ring[i + 1][1]
        let dLon = lon2 - lon1
        if (Math.abs(dLon) > 180) {
          lon2 += dLon > 0 ? -360 : 360
          dLon = lon2 - lon1
        }
        const dLat = lat2 - lat1
        const span = Math.max(Math.abs(dLon), Math.abs(dLat))
        const steps = Math.max(1, Math.ceil(span / EDGE_STEP_DEG))
        for (let s = 0; s <= steps; s++) {
          const t = s / steps
          out.push(wrapLon(lon1 + dLon * t), lat1 + dLat * t)
        }
      }
    }
  }
  return new Float32Array(out)
}

// ── Interior-fill dots (adapted from Globe.tsx buildFillTileInWorker) ──
function unwrapRing(ring: Ring, refLon: number): Ring {
  const out: Ring = new Array(ring.length)
  let prev: number[] | null = null
  for (let i = 0; i < ring.length; i++) {
    let L = ring[i][0]
    const A = ring[i][1]
    const d = L - refLon
    if (d > 180) L -= 360
    else if (d < -180) L += 360
    if (prev) {
      const step = L - prev[0]
      if (step > 180) L -= 360
      else if (step < -180) L += 360
    }
    out[i] = [L, A]
    prev = out[i]
  }
  return out
}

function pointInRing(x: number, y: number, ring: Ring): boolean {
  let inside = false
  const n = ring.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = ring[i][0]
    const yi = ring[i][1]
    const xj = ring[j][0]
    const yj = ring[j][1]
    const denom = yj - yi
    if (denom === 0) continue
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / denom + xi) {
      inside = !inside
    }
  }
  return inside
}

function ringBbox(ring: Ring) {
  let minLon = 1e9
  let maxLon = -1e9
  let minLat = 90
  let maxLat = -90
  for (const [L, A] of ring) {
    if (L < minLon) minLon = L
    if (L > maxLon) maxLon = L
    if (A < minLat) minLat = A
    if (A > maxLat) maxLat = A
  }
  return { minLon, maxLon, minLat, maxLat }
}

function sampleFill(polys: Poly[]): Float32Array {
  const out: number[] = []
  for (const poly of polys) {
    const outer = poly[0]
    if (!outer || outer.length < 4) continue
    let bb = ringBbox(unwrapRing(outer, 0))
    const refLon = (bb.minLon + bb.maxLon) / 2
    const rings = poly.map((r) => unwrapRing(r, refLon))
    bb = ringBbox(rings[0])
    const latStart = Math.floor(bb.minLat / FILL_STEP_DEG) * FILL_STEP_DEG
    const latEnd = Math.ceil(bb.maxLat / FILL_STEP_DEG) * FILL_STEP_DEG
    for (let lat = latStart; lat <= latEnd; lat += FILL_STEP_DEG) {
      if (lat > LAT_TOP || lat < LAT_BOTTOM) continue
      const odd = Math.round(Math.abs(lat / FILL_STEP_DEG)) % 2
      const lonStart =
        Math.floor(bb.minLon / FILL_STEP_DEG) * FILL_STEP_DEG +
        (odd ? FILL_STEP_DEG * 0.5 : 0)
      const lonEnd = Math.ceil(bb.maxLon / FILL_STEP_DEG) * FILL_STEP_DEG
      for (let lon = lonStart; lon <= lonEnd; lon += FILL_STEP_DEG) {
        if (!pointInRing(lon, lat, rings[0])) continue
        let inHole = false
        for (let k = 1; k < rings.length; k++) {
          if (pointInRing(lon, lat, rings[k])) {
            inHole = true
            break
          }
        }
        if (!inHole) out.push(wrapLon(lon), lat)
      }
    }
  }
  return new Float32Array(out)
}

// ── Static canvas draw ──
function draw(
  canvas: HTMLCanvasElement,
  wrap: HTMLElement,
  edge: Float32Array,
  fill: Float32Array,
  pins: Pin[],
) {
  const w = wrap.clientWidth
  const h = wrap.clientHeight
  if (w === 0 || h === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  // Project into an inset, aspect-correct, centred rect (not edge-to-edge):
  // the padding keeps coastlines off the canvas edges, and fitting an explicit
  // 360/LAT_RANGE-aspect rect preserves the equirectangular proportions.
  const padX = w * 0.025
  const padY = h * 0.025
  const mapAspect = 360 / LAT_RANGE
  let rectW = w - padX * 2
  let rectH = rectW / mapAspect
  if (rectH > h - padY * 2) {
    rectH = h - padY * 2
    rectW = rectH * mapAspect
  }
  const rectX = (w - rectW) / 2
  const rectY = (h - rectH) / 2

  const px = (lon: number) => rectX + ((wrapLon(lon) + 180) / 360) * rectW
  const py = (lat: number) => rectY + ((LAT_TOP - lat) / LAT_RANGE) * rectH

  // Interior fill dots — fainter
  ctx.fillStyle = "rgba(0, 152, 219, 0.5)"
  const fr = Math.max(0.7, w / 1150)
  for (let i = 0; i < fill.length; i += 2) {
    const lat = fill[i + 1]
    if (lat > LAT_TOP || lat < LAT_BOTTOM) continue
    ctx.beginPath()
    ctx.arc(px(fill[i]), py(lat), fr, 0, Math.PI * 2)
    ctx.fill()
  }

  // Coastline edge dots — brighter, slightly larger
  ctx.fillStyle = "rgba(0, 152, 219, 0.95)"
  const er = Math.max(0.9, w / 940)
  for (let i = 0; i < edge.length; i += 2) {
    const lat = edge[i + 1]
    if (lat > LAT_TOP || lat < LAT_BOTTOM) continue
    ctx.beginPath()
    ctx.arc(px(edge[i]), py(lat), er, 0, Math.PI * 2)
    ctx.fill()
  }

  // Office pins — gold dot + soft halo (matches the globe's pinDotColor)
  const haloR = Math.max(9, w / 110)
  const dotR = Math.max(2.4, w / 380)
  for (const p of pins) {
    if (p.lat > LAT_TOP || p.lat < LAT_BOTTOM) continue
    const x = px(p.lon)
    const y = py(p.lat)
    const grad = ctx.createRadialGradient(x, y, 0, x, y, haloR)
    grad.addColorStop(0, "rgba(247, 180, 53, 0.5)")
    grad.addColorStop(1, "rgba(247, 180, 53, 0)")
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, haloR, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#F7B435"
    ctx.beginPath()
    ctx.arc(x, y, dotR, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function FootprintMap({ pins, className }: FootprintMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let disposed = false
    let edge: Float32Array | null = null
    let fill: Float32Array | null = null

    const render = () => {
      const canvas = canvasRef.current
      const wrap = wrapRef.current
      if (!canvas || !wrap || !edge || !fill) return
      draw(canvas, wrap, edge, fill, pins)
    }

    const run = async () => {
      try {
        if (CACHE) {
          edge = CACHE.edge
          fill = CACHE.fill
        } else {
          const polys = await getLandPolys()
          if (disposed) return
          edge = sampleEdge(polys)
          fill = sampleFill(polys)
          CACHE = { edge, fill }
        }
        if (disposed) return
        setLoading(false)
        requestAnimationFrame(render)
      } catch {
        if (!disposed) setLoading(false)
      }
    }
    run()

    let resizeRaf = 0
    const onResize = () => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(render)
    }
    window.addEventListener("resize", onResize)

    return () => {
      disposed = true
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(resizeRaf)
    }
  }, [JSON.stringify(pins)])

  return (
    <div
      ref={wrapRef}
      className={className}
      role="presentation"
      aria-hidden="true"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      {loading && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.04)",
          }}
        />
      )}
    </div>
  )
}
