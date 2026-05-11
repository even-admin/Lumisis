"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"

const URL_THREE = "https://esm.sh/three@0.157?bundle"
const URL_ORBIT =
  "https://esm.sh/three@0.157/examples/jsm/controls/OrbitControls?bundle"
const URL_TOPO = "https://esm.sh/topojson-client@3?bundle"
const URL_CSS2D =
  "https://esm.sh/three@0.157/examples/jsm/renderers/CSS2DRenderer?bundle"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let THREE: any
const MAX_DPR = 2
const FPS_CAP = 50
const MAX_FILL_POINTS = 120000

export interface Pin {
  lon: number
  lat: number
  name?: string
  address?: string
  phone?: string
}

interface GlobeConfig {
  autoRotateSpeed: number
  pointSize: number
  tileDeg: number
  zoom: boolean
  pointColor: string
  labelColor: string
  pinDotColor: string
  pinPanelBgColor: string
  pinPanelBgOpacity: number
  pinPanelBorderColor: string
  backOpacity: number
  fillColor: string
  fillOpacity: number
  showLabels: boolean
  pinSize: number
  haloScale: number
  labelFontSize: number
}

const DEFAULTS: GlobeConfig = {
  autoRotateSpeed: 0.03,
  pointSize: 0.006,
  tileDeg: 1.0,
  zoom: false,
  pointColor: "#0098DB",
  labelColor: "#E7F8FF",
  pinDotColor: "#0098DB",
  pinPanelBgColor: "#0C2A33",
  pinPanelBgOpacity: 0.75,
  pinPanelBorderColor: "#0098DB",
  backOpacity: 0.06,
  fillColor: "#0098DB",
  fillOpacity: 0.6,
  showLabels: true,
  pinSize: 0.012,
  haloScale: 10,
  labelFontSize: 12,
}

export interface GlobeProps extends Partial<GlobeConfig> {
  pins: Pin[]
  className?: string
}

type Ring = Float32Array
type Polygon = Ring[]
const layerCache = new Map<number, { edge: Float32Array; fill: Float32Array }>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let DOT_TEX: any, HALO_TEX: any
let LAND_POLYS: Polygon[] | null = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let LAND_GEO_POLYS: any[] | null = null

function Preloader({ progress }: { progress: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        zIndex: 10,
        fontSize: 10,
      }}
    >
      <div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,.2)",
            borderTopColor: "#fff",
            animation: "globe-spin .8s linear infinite",
          }}
        />
        <div style={{ marginTop: 8, textAlign: "center" }}>
          {Math.round(progress)}%
        </div>
      </div>
      <style>{`@keyframes globe-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export function Globe(props: GlobeProps) {
  const cfg = { ...DEFAULTS, ...props } as GlobeConfig & { pins: Pin[] }
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const runningRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    let disposed = false
    let cleanup: (() => void) | undefined

    const run = async () => {
      setLoading(true)
      setProgress(0)
      const container = containerRef.current
      if (!container) return
      while (container.firstChild) container.removeChild(container.firstChild)

      const width = container.clientWidth || 800
      const height = container.clientHeight || 800

      setProgress(10)
      if (!THREE) THREE = await import(/* @vite-ignore */ URL_THREE)
      const { OrbitControls } = await import(/* @vite-ignore */ URL_ORBIT)
      setProgress(20)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100)
      camera.position.set(0, 0, 3)

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "low-power",
        premultipliedAlpha: true,
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
      renderer.setSize(width, height)
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.enablePan = false
      controls.enableZoom = !!cfg.zoom

      const globeGroup = new THREE.Group()
      scene.add(globeGroup)

      if (!DOT_TEX) DOT_TEX = makeCircleDotTexture(64)
      if (!HALO_TEX) HALO_TEX = makeHaloTexture()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pinGroups: any[] = []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pinSpheres: any[] = []

      cfg.pins.forEach((p) => {
        const g = addPin(
          globeGroup,
          p,
          HALO_TEX,
          null,
          cfg.labelColor,
          cfg.pinDotColor,
          cfg.pinPanelBgColor,
          cfg.pinPanelBgOpacity,
          cfg.pinPanelBorderColor,
          cfg.labelFontSize,
          cfg.pinSize,
          cfg.haloScale,
        )
        pinGroups.push(g)
        pinSpheres.push(g.children[0])
      })

      setProgress(35)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let { polys, geoPolys } = await getLand().catch(
        () => ({ polys: null, geoPolys: null }) as { polys: Polygon[] | null; geoPolys: unknown[] | null },
      )
      if (!polys || !polys.length || !geoPolys)
        throw new Error("No land polygons")

      const filtered = filterNonPolarPolys(polys, geoPolys)
      polys = filtered.polys
      geoPolys = filtered.geoPolys

      const edgeMat = makePointsMat(
        cfg.pointColor,
        cfg.pointSize,
        cfg.backOpacity,
        DOT_TEX,
      )
      const fillMat = makePointsMat(
        cfg.fillColor,
        Math.max(0.75 * cfg.pointSize, 0.003),
        cfg.backOpacity,
        DOT_TEX,
        cfg.fillOpacity,
      )

      let edgePos: Float32Array, fillPos: Float32Array
      const cacheKey = cfg.tileDeg
      const cached = layerCache.get(cacheKey)
      if (cached) {
        edgePos = cached.edge
        fillPos = cached.fill
        setProgress(65)
      } else {
        try {
          setProgress(40)
          const edge = await buildEdgesInWorker(
            polys,
            Math.max(0.2, cfg.tileDeg),
          )
          setProgress(70)
          const fill = await buildFillTileInWorker(geoPolys, cfg.tileDeg)
          edgePos = edge
          fillPos = limitPoints(fill, MAX_FILL_POINTS)
          layerCache.set(cacheKey, { edge: edgePos, fill: fillPos })
          setProgress(100)
        } catch {
          const { edge } = buildEdgesSync(polys, Math.max(0.2, cfg.tileDeg))
          edgePos = edge
          fillPos = new Float32Array(0)
          setProgress(100)
        }
      }

      const edgeGeo = new THREE.BufferGeometry()
      edgeGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(edgePos, 3),
      )
      const edgePts = new THREE.Points(edgeGeo, edgeMat)
      globeGroup.add(edgePts)

      const fillGeo = new THREE.BufferGeometry()
      fillGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(fillPos, 3),
      )
      const fillPts = new THREE.Points(fillGeo, fillMat)
      globeGroup.add(fillPts)

      // CSS2D labels (rendered in local document, not window.top)
      const css2d = await import(/* @vite-ignore */ URL_CSS2D)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { CSS2DRenderer, CSS2DObject } = css2d as any

      const labelRenderer = new CSS2DRenderer()
      labelRenderer.setSize(width, height)
      Object.assign(labelRenderer.domElement.style, {
        position: "absolute",
        top: "0",
        left: "0",
        pointerEvents: "none",
      })
      container.appendChild(labelRenderer.domElement)

      const hasLabels = cfg.pins.some(
        (p: Pin) => p.name || p.address || p.phone,
      )
      if (hasLabels) {
        pinGroups.forEach((g) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pin: Pin = (g as any).__pin
          if (!(pin.name || pin.address || pin.phone)) return

          const el = document.createElement("div")
          const bg = hexToRgba(cfg.pinPanelBgColor, cfg.pinPanelBgOpacity)

          el.style.cssText =
            `max-width:280px;` +
            `white-space:normal;overflow-wrap:anywhere;word-break:break-word;` +
            `padding:12px;border-radius:8px;background:${bg};backdrop-filter:blur(6px);` +
            `border:1px solid ${cfg.pinPanelBorderColor};color:${cfg.labelColor};` +
            `pointer-events:none;font-family:'Montserrat Variable',Montserrat,system-ui,sans-serif;font-size:${cfg.labelFontSize}px;line-height:1.35;`

          const nl2br = (s: string) => s.replace(/\n/g, "<br/>")
          const nameHTML = pin.name ? `<b>${pin.name}</b><br/>` : ""
          const addrHTML = pin.address ? `${nl2br(pin.address)}<br/>` : ""
          const phoneHTML = pin.phone ?? ""
          el.innerHTML = `${nameHTML}${addrHTML}${phoneHTML}`

          const labelObj = new CSS2DObject(el)
          labelObj.position.set(0, 0.08, 0)
          labelObj.visible = !!cfg.showLabels
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(g as any).__labelObj = labelObj
          g.add(labelObj)
        })
      }

      // Click to reveal label when showLabels=false
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      function setMouseNDC(ev: MouseEvent) {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1
      }
      function hideAllLabels() {
        pinGroups.forEach((g) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const l = (g as any).__labelObj
          if (l) l.visible = false
        })
      }
      const onClick = (ev: MouseEvent) => {
        if (!hasLabels || cfg.showLabels) return
        setMouseNDC(ev)
        raycaster.setFromCamera(mouse, camera)
        const hits = raycaster.intersectObjects(pinSpheres, true)
        if (hits.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const group = hits[0].object.parent as any
          const label = group?.__labelObj
          if (label) {
            hideAllLabels()
            label.visible = true
          }
        } else {
          hideAllLabels()
        }
      }
      renderer.domElement.addEventListener("click", onClick)

      // Cursor
      let isDragging = false
      let isHoveringPin = false
      const applyCursor = () => {
        renderer.domElement.style.cursor = isHoveringPin
          ? "pointer"
          : isDragging
            ? "grabbing"
            : "grab"
      }
      const onDragStart = () => {
        isDragging = true
        applyCursor()
      }
      const onDragEnd = () => {
        isDragging = false
        applyCursor()
      }
      controls.addEventListener("start", onDragStart)
      controls.addEventListener("end", onDragEnd)
      const onDown = () => {
        isDragging = true
        applyCursor()
      }
      const onUp = () => {
        isDragging = false
        applyCursor()
      }
      const onLeave = () => {
        isDragging = false
        applyCursor()
      }
      renderer.domElement.addEventListener("mousedown", onDown)
      renderer.domElement.addEventListener("mouseup", onUp)
      renderer.domElement.addEventListener("mouseleave", onLeave)
      renderer.domElement.addEventListener("touchstart", onDown, {
        passive: true,
      })
      renderer.domElement.addEventListener("touchend", onUp, { passive: true })

      function onMouseMove(ev: MouseEvent) {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(mouse, camera)
        const hits = raycaster.intersectObjects(pinSpheres, true)
        isHoveringPin = hits.length > 0
        applyCursor()
      }
      renderer.domElement.addEventListener("mousemove", onMouseMove)
      applyCursor()

      setLoading(false)

      // Render loop
      const clock = new THREE.Clock()
      const FRAME = 1 / FPS_CAP
      let acc = FRAME

      const autoSpeed = prefersReducedMotion ? 0 : cfg.autoRotateSpeed

      const renderOnce = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;[edgePts.material, fillPts.material].forEach((mat: any) => {
          const shader = mat?.userData?.shader
          if (shader) {
            shader.uniforms.uCamPos.value.copy(camera.position)
            shader.uniforms.uBackOpacity.value = cfg.backOpacity
          }
        })
        controls.update()
        renderer.render(scene, camera)
        labelRenderer.render(scene, camera)
      }

      const loop = () => {
        if (disposed || !runningRef.current) return
        const dt = clock.getDelta()
        acc += dt
        if (autoSpeed > 0) globeGroup.rotation.y += autoSpeed * dt
        if (!document.hidden && acc >= FRAME) {
          renderOnce()
          acc = 0
        }
        rafRef.current = requestAnimationFrame(loop)
      }

      const start = () => {
        if (runningRef.current) return
        runningRef.current = true
        acc = FRAME
        loop()
      }
      const stop = () => {
        runningRef.current = false
        cancelAnimationFrame(rafRef.current)
      }

      const onVis = () => (document.hidden ? stop() : start())
      document.addEventListener("visibilitychange", onVis)
      const io = new IntersectionObserver(
        (entries) => {
          const vis = entries[0]?.isIntersecting
          vis ? start() : stop()
        },
        { root: null, threshold: 0 },
      )
      io.observe(container)

      renderOnce()
      start()

      const onResizeCanvas = () => {
        const w = container.clientWidth || 800
        const h = container.clientHeight || 800
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
        renderer.setSize(w, h)
        labelRenderer.setSize(w, h)
        acc = FRAME
        renderOnce()
      }
      window.addEventListener("resize", onResizeCanvas)

      cleanup = () => {
        disposed = true
        stop()
        window.removeEventListener("resize", onResizeCanvas)
        document.removeEventListener("visibilitychange", onVis)
        io.disconnect()
        try {
          renderer.domElement.removeEventListener("click", onClick)
          renderer.domElement.removeEventListener("mousemove", onMouseMove)
          renderer.domElement.removeEventListener("mousedown", onDown)
          renderer.domElement.removeEventListener("mouseup", onUp)
          renderer.domElement.removeEventListener("mouseleave", onLeave)
        } catch {}
        try {
          controls.removeEventListener("start", onDragStart)
          controls.removeEventListener("end", onDragEnd)
        } catch {}
        controls.dispose()
        disposeScene(scene)
        renderer.dispose()
        if (renderer.domElement.parentNode)
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        if (labelRenderer.domElement.parentNode)
          labelRenderer.domElement.parentNode.removeChild(
            labelRenderer.domElement,
          )
      }
    }

    run().catch(() => setLoading(false))
    return () => {
      disposed = true
      try {
        cleanup?.()
      } catch {}
    }
  }, [JSON.stringify(cfg.pins)])

  return (
    <div
      className={props.className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {loading && <Preloader progress={progress} />}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      />
    </div>
  )
}

// ================= Geo =================
async function getLand(): Promise<{ polys: Polygon[]; geoPolys: unknown[] }> {
  if (LAND_POLYS && LAND_GEO_POLYS)
    return { polys: LAND_POLYS, geoPolys: LAND_GEO_POLYS }
  const urls = [
    "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json",
    "https://unpkg.com/world-atlas@2/land-110m.json",
  ]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let topo: any = null
  for (const u of urls) {
    try {
      const r = await fetch(u, { cache: "force-cache" })
      if (r.ok) {
        topo = await r.json()
        break
      }
    } catch {}
  }
  if (!topo) throw new Error("land-110m.json unavailable")
  const { feature } = await import(/* @vite-ignore */ URL_TOPO)
  const land = feature(topo, topo.objects.land)

  const polys: Polygon[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoPolys: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(land.features || []).forEach((f: any) => {
    const g = f.geometry
    if (!g) return
    if (g.type === "Polygon") {
      polys.push(
        g.coordinates.map((ring: number[][], idx: number) => toRing(ring, idx)),
      )
      geoPolys.push({ type: "Polygon", coordinates: g.coordinates })
    } else if (g.type === "MultiPolygon") {
      g.coordinates.forEach((poly: number[][][]) => {
        polys.push(
          poly.map((ring: number[][], idx: number) => toRing(ring, idx)),
        )
        geoPolys.push({ type: "Polygon", coordinates: poly })
      })
    }
  })
  LAND_POLYS = polys
  LAND_GEO_POLYS = geoPolys
  return { polys, geoPolys }
}

function toRing(ring: number[][], idx: number): Ring {
  if (idx > 0) {
    const out = new Float32Array((ring.length + 1) * 2)
    let k = 0
    for (let i = 0; i < ring.length; i++) {
      out[k++] = ring[i][0]
      out[k++] = ring[i][1]
    }
    const last = ring[ring.length - 1]
    out[k++] = last[0]
    out[k++] = last[1]
    return out.subarray(0, k)
  }
  const L = ring.length,
    target = 3000,
    step = L > target ? Math.floor(L / target) : 1
  const out = new Float32Array(((Math.ceil(L / step) + 1) | 0) * 2)
  let k = 0
  for (let i = 0; i < L; i += step) {
    out[k++] = ring[i][0]
    out[k++] = ring[i][1]
  }
  const last = ring[L - 1]
  out[k++] = last[0]
  out[k++] = last[1]
  return out.subarray(0, k)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterNonPolarPolys(polys: Polygon[], geoPolys: any[]) {
  const outP: Polygon[] = [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outG: any[] = []
  for (let i = 0; i < polys.length; i++) {
    const outer = polys[i][0]
    if (!outer || outer.length < 4) continue
    const bbox = boundsOfRing(outer)
    const w = bbox.maxLon - bbox.minLon
    const avgLat = (bbox.minLat + bbox.maxLat) / 2
    if (w > 300 && Math.abs(avgLat) > 60) continue
    outP.push(polys[i])
    outG.push(geoPolys[i])
  }
  return { polys: outP, geoPolys: outG }
}

// ================= Workers =================
function buildEdgesInWorker(
  polys: Polygon[],
  densityDeg: number,
): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const payload = polys.map((poly) =>
      poly.map((ring) => new Float32Array(ring)),
    )
    const src = `
      function wrapLon(lon){ return ((lon + 540) % 360) - 180; }
      function sampleEdgeFlat(ring, maxDegStep){
        var out = [];
        for (var i=0;i<ring.length-2;i+=2){
          var lon1 = ring[i], lat1 = ring[i+1];
          var lon2 = ring[i+2], lat2 = ring[i+3];
          var dLon = lon2 - lon1, lon2n = lon2;
          if (Math.abs(dLon)>180){ lon2n += dLon>0?-360:360; dLon = lon2n - lon1; }
          var dLat = lat2 - lat1;
          var maxSpan = Math.max(Math.abs(dLon), Math.abs(dLat));
          var steps = Math.max(1, Math.ceil(maxSpan / maxDegStep));
          for (var s=0;s<=steps;s++){
            var t = s/steps;
            var lon = lon1 + dLon*t;
            var lat = lat1 + dLat*t;
            out.push(wrapLon(lon), lat);
          }
        }
        return new Float32Array(out);
      }
      function lonLatToVec3(lon,lat,r){
        if (r === void 0) r = 1;
        var phi = (90 - lat) * Math.PI/180;
        var theta = (lon + 180) * Math.PI/180;
        return [-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
      }
      onmessage = function(e){
        var densityDeg = e.data.densityDeg, polysIn = e.data.polysIn;
        var edgeOut = [];
        for (var p=0;p<polysIn.length;p++){
          var poly = polysIn[p];
          for (var r=0;r<poly.length;r++){
            var sampled = sampleEdgeFlat(poly[r], Math.max(0.2, densityDeg));
            for (var i=0;i<sampled.length;i+=2){
              var v = lonLatToVec3(sampled[i], sampled[i+1], 1);
              edgeOut.push(v[0],v[1],v[2]);
            }
          }
        }
        var arr = new Float32Array(edgeOut);
        postMessage({ ok:true, edge:arr }, [arr.buffer]);
      };
    `
    const blob = new Blob([src], { type: "application/javascript" })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    worker.onmessage = (e: MessageEvent) => {
      URL.revokeObjectURL(url)
      worker.terminate()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = e.data as any
      if (msg && msg.ok) resolve(msg.edge as Float32Array)
      else reject(new Error("worker failed"))
    }
    worker.onerror = (err) => {
      URL.revokeObjectURL(url)
      worker.terminate()
      reject(err)
    }
    worker.postMessage({ densityDeg, polysIn: payload })
  })
}

function buildFillTileInWorker(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geoPolys: any[],
  tileDeg: number,
): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const payload = JSON.parse(JSON.stringify(geoPolys))
    const src = `
var PI=Math.PI;
function wrap180(lon){ return ((lon+540)%360)-180; }
function vec3(lon,lat){
  var phi=(90-lat)*PI/180, th=(lon+180)*PI/180;
  return [-Math.sin(phi)*Math.cos(th), Math.cos(phi), Math.sin(phi)*Math.sin(th)];
}
function unwrapRing(ring, refLon){
  var out=new Array(ring.length), prev=null;
  for(var i=0;i<ring.length;i++){
    var L=ring[i][0], A=ring[i][1];
    var d=L-refLon;
    if(d>180) L-=360; else if(d<-180) L+=360;
    if(prev){
      var step=L-prev[0];
      if(step>180) L-=360; else if(step<-180) L+=360;
    }
    out[i]=[L,A]; prev=out[i];
  }
  return out;
}
function pointInRing(pt, ring){
  var x=pt[0], y=pt[1], inside=false, n=ring.length;
  for(var i=0,j=n-1;i<n;j=i++){
    var xi=ring[i][0], yi=ring[i][1];
    var xj=ring[j][0], yj=ring[j][1];
    var denom=yj-yi; if(denom===0) continue;
    var inter=((yi>y)!==(yj>y)) && (x < (xj-xi)*(y-yi)/denom + xi);
    if(inter) inside=!inside;
  }
  return inside;
}
function containsUnwrapped(poly, refLon, lon, lat){
  var rings=poly.coordinates; if(!rings||!rings.length) return false;
  var r0=unwrapRing(rings[0], refLon);
  var pt=[lon,lat];
  if(!pointInRing(pt, r0)) return false;
  for(var k=1;k<rings.length;k++){
    var rk=unwrapRing(rings[k], refLon);
    if(pointInRing(pt, rk)) return false;
  }
  return true;
}
function bbox(r){
  var minLon=1e9,maxLon=-1e9,minLat=90,maxLat=-90;
  for(var i=0;i<r.length;i++){
    var L=r[i][0], A=r[i][1];
    if(L<minLon)minLon=L; if(L>maxLon)maxLon=L;
    if(A<minLat)minLat=A; if(A>maxLat)maxLat=A;
  }
  return {minLon,maxLon,minLat,maxLat};
}
onmessage=function(e){
  var geos=e.data.geos, step=Math.max(0.2, Math.min(6.0, e.data.tileDeg||1.0));
  var out=[];
  for(var p=0;p<geos.length;p++){
    var r0 = unwrapRing(geos[p].coordinates[0], 0);
    var bb = bbox(r0);
    var refLon = (bb.minLon+bb.maxLon)/2;
    r0 = unwrapRing(geos[p].coordinates[0], refLon);
    bb = bbox(r0);
    var latStart = Math.floor((bb.minLat-1)/step)*step;
    var latEnd   = Math.ceil((bb.maxLat+1)/step)*step;
    for(var lat=latStart; lat<=latEnd; lat+=step){
      var odd = Math.round(Math.abs(lat/step))%2;
      var lonStart = Math.floor((bb.minLon-1)/step)*step + (odd? step*0.5 : 0);
      var lonEnd   = Math.ceil((bb.maxLon+1)/step)*step;
      for(var lon=lonStart; lon<=lonEnd; lon+=step){
        var llLon = lon, llLat = Math.max(-90, Math.min(90, lat));
        if(containsUnwrapped(geos[p], refLon, llLon, llLat)){
          var v = vec3(wrap180(llLon), llLat);
          out.push(v[0],v[1],v[2]);
        }
      }
    }
  }
  var arr=new Float32Array(out);
  postMessage({ok:true, fill:arr}, [arr.buffer]);
};
`
    const blob = new Blob([src], { type: "application/javascript" })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    worker.onmessage = (e: MessageEvent) => {
      URL.revokeObjectURL(url)
      worker.terminate()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = e.data as any
      if (msg && msg.ok) resolve(msg.fill as Float32Array)
      else reject(new Error("worker failed"))
    }
    worker.onerror = (err) => {
      URL.revokeObjectURL(url)
      worker.terminate()
      reject(err)
    }
    worker.postMessage({ geos: payload, tileDeg })
  })
}

// ================= Helpers =================
function boundsOfRing(ring: Ring) {
  let minLon = 180,
    maxLon = -180,
    minLat = 90,
    maxLat = -90
  for (let i = 0; i < ring.length; i += 2) {
    const x = ring[i],
      y = ring[i + 1]
    if (x < minLon) minLon = x
    if (x > maxLon) maxLon = x
    if (y < minLat) minLat = y
    if (y > maxLat) maxLat = y
  }
  return { minLon, maxLon, minLat, maxLat }
}

function lonLatToVec3(lon: number, lat: number, r = 1) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon + 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

function addPin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  group: any,
  pin: Pin,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tex: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _CSS2DObject: any | null,
  _labelColor: string,
  pinDotColor: string,
  _panelBgColor: string,
  _panelBgOpacity: number,
  _panelBorderColor: string,
  _labelFontSize: number,
  pinSize: number,
  haloScale: number,
) {
  const pos = lonLatToVec3(pin.lon, pin.lat, 1)
  const g = new THREE.Group()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(g as any).__pin = pin
  g.position.copy(pos)

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(pinSize, 16, 16),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(pinDotColor) }),
  )
  g.add(sphere)

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      color: new THREE.Color(pinDotColor),
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  const haloSize = pinSize * haloScale
  halo.scale.set(haloSize, haloSize, haloSize)
  g.add(halo)

  group.add(g)
  return g
}

function makeHaloTexture(size = 128) {
  const c = document.createElement("canvas")
  c.width = c.height = size
  const x = c.getContext("2d")!
  const g = x.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  g.addColorStop(0, "rgba(255,255,255,0.25)")
  g.addColorStop(0.35, "rgba(255,255,255,0.1)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  x.fillStyle = g
  x.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}

function makeCircleDotTexture(size = 64) {
  const c = document.createElement("canvas")
  c.width = c.height = size
  const x = c.getContext("2d")!
  x.clearRect(0, 0, size, size)
  const r = size / 2
  const g = x.createRadialGradient(r, r, r * 0.82, r, r, r)
  g.addColorStop(0, "rgba(255,255,255,1)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  x.fillStyle = g
  x.beginPath()
  x.arc(r, r, r - 0.5, 0, Math.PI * 2)
  x.closePath()
  x.fill()
  const tex = new THREE.CanvasTexture(c)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 1
  tex.generateMipmaps = false
  return tex
}

function hexToRgba(input: string, a = 1) {
  try {
    if (/^rgba?\(/i.test(input))
      return input.replace(/rgba?\(([^)]+)\)/i, (_: string, body: string) => {
        const p = body.split(",").map((s) => parseFloat(s.trim()))
        const [r, g, b] = p
        return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`
      })
    const m = input.replace("#", "")
    const s =
      m.length === 3
        ? m
            .split("")
            .map((x) => x + x)
            .join("")
        : m
    const n = parseInt(s, 16)
    const r = (n >> 16) & 255,
      g = (n >> 8) & 255,
      b = n & 255
    return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`
  } catch {
    return `rgba(255,255,255,${a})`
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function disposeScene(scene: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene.traverse((o: any) => {
    if (o.geometry) o.geometry.dispose()
    if (o.material) {
      if (Array.isArray(o.material))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        o.material.forEach((m: any) => m.dispose())
      else o.material.dispose()
    }
  })
}

function makePointsMat(
  color: string,
  size: number,
  backOpacity: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dotTexture: any,
  overrideOpacity?: number,
) {
  const material = new THREE.PointsMaterial({
    color: new THREE.Color(color),
    size,
    sizeAttenuation: true,
    depthWrite: false,
    transparent: true,
    map: dotTexture,
    alphaTest: 0.0,
    opacity: overrideOpacity ?? 1,
  })
  material.toneMapped = false
  material.precision = "mediump"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  material.onBeforeCompile = (shader: any) => {
    shader.uniforms.uCamPos = { value: new THREE.Vector3() }
    shader.uniforms.uBackOpacity = { value: backOpacity }

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\n varying vec3 vWorldPos;\n uniform vec3 uCamPos;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n vWorldPos = (modelMatrix * vec4(transformed,1.0)).xyz;",
      )
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
         float ndv = dot(normalize(uCamPos - vWorldPos), normalize(vWorldPos));
         gl_PointSize *= mix(0.6, 1.0, smoothstep(0.0, 0.25, ndv));`,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\n varying vec3 vWorldPos; uniform vec3 uCamPos; uniform float uBackOpacity;",
      )
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
         float ndHem; {
           vec3 viewDir = normalize(uCamPos - vWorldPos);
           vec3 normalDir = normalize(vWorldPos);
           ndHem = dot(viewDir, normalDir);
         }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
         diffuseColor.a *= mix(uBackOpacity, 1.0, smoothstep(0.0, 0.25, ndHem));`,
      )
    material.userData.shader = shader
  }

  return material
}

function limitPoints(src: Float32Array, cap: number) {
  const n = src.length / 3
  if (n <= cap) return src
  const idxs = new Uint32Array(n)
  for (let i = 0; i < n; i++) idxs[i] = i
  for (let i = n - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    const t = idxs[i]
    idxs[i] = idxs[j]
    idxs[j] = t
  }
  const out = new Float32Array(cap * 3)
  for (let k = 0; k < cap; k++) {
    const i = idxs[k] * 3
    out[k * 3 + 0] = src[i + 0]
    out[k * 3 + 1] = src[i + 1]
    out[k * 3 + 2] = src[i + 2]
  }
  return out
}

function buildEdgesSync(polys: Polygon[], densityDeg: number) {
  const edgeOut: number[] = []
  for (const poly of polys) {
    for (const ring of poly) {
      const sampled = sampleEdgeFlat(ring, Math.max(0.2, densityDeg))
      for (let i = 0; i < sampled.length; i += 2) {
        const v = lonLatToVec3Sync(sampled[i], sampled[i + 1])
        edgeOut.push(v[0], v[1], v[2])
      }
    }
  }
  return { edge: new Float32Array(edgeOut) }

  function sampleEdgeFlat(ring: Float32Array, maxDegStep: number) {
    const out: number[] = []
    for (let i = 0; i < ring.length - 2; i += 2) {
      const lon1 = ring[i],
        lat1 = ring[i + 1]
      let lon2 = ring[i + 2]
      const lat2 = ring[i + 3]
      let dLon = lon2 - lon1
      if (Math.abs(dLon) > 180) {
        lon2 += dLon > 0 ? -360 : 360
        dLon = lon2 - lon1
      }
      const dLat = lat2 - lat1
      const maxSpan = Math.max(Math.abs(dLon), Math.abs(dLat))
      const steps = Math.max(1, Math.ceil(maxSpan / maxDegStep))
      for (let s = 0; s <= steps; s++) {
        const t = s / steps
        const lon = lon1 + dLon * t
        const lat = lat1 + dLat * t
        out.push(((lon + 540) % 360) - 180, lat)
      }
    }
    return new Float32Array(out)
  }

  function lonLatToVec3Sync(lon: number, lat: number) {
    const phi = ((90 - lat) * Math.PI) / 180
    return [
      -Math.sin(phi) * Math.cos(((lon + 180) * Math.PI) / 180),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(((lon + 180) * Math.PI) / 180),
    ]
  }
}
