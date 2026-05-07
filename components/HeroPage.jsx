'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CATS = [
  { key: 'bracelets', file: '/optimized/bracelet.glb', overlay: 'Bracelets', counter: '01',
    eyebrow: 'Elegance on your wrist', title: ['Wrist', 'Sculptures'],
    desc: 'Crafted with precision and passion — each bracelet is a timeless piece that defines your elegance. Handmade in 18k gold.',
    cta: 'Shop Bracelets' },
  { key: 'rings', file: '/optimized/ring.glb', overlay: 'Rings', counter: '02',
    eyebrow: 'A perfect circle of devotion', title: ['Eternal', 'Rings'],
    desc: 'Symbols of commitment, artistry, and legacy. Each ring is a masterwork set in precious metal and stone.',
    cta: 'Shop Rings' },
  { key: 'pendants', file: '/optimized/pendant.glb', overlay: 'Pendants', counter: '03',
    eyebrow: 'Worn close to the heart', title: ['Heart', 'Pendants'],
    desc: 'Delicate pendants that tell a story. Suspended in gold, held forever — wear what matters most.',
    cta: 'Shop Pendants' },
]

// ─── THREE.JS HELPERS ─────────────────────────────────────────────────────────
function fitToView(obj, cam) {
  const box  = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3())
  obj.position.sub(box.getCenter(new THREE.Vector3()))
  const maxDim = Math.max(size.x, size.y, size.z)
  let z = (maxDim / 2 / Math.tan((cam.fov * Math.PI) / 360)) * 3.8
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
  if (vw < 640) z *= 1.8
  else if (vw < 1024) z *= 1.35
  else if (vw < 1280) z *= 1.15
  cam.position.set(0, size.y * 0.15, z)
  cam.near = z * 0.01; cam.far = z * 10
  cam.updateProjectionMatrix()
}

function applyGold(obj) {
  obj.traverse(c => {
    if (!c.isMesh) return
    c.castShadow = c.receiveShadow = true
    // Always replace with a fresh gold material — prevents shared-material
    // pollution between cached models and stops the HDR env map from
    // overriding our color after it loads asynchronously.
    const mats = [].concat(c.material)
    const newMats = mats.map(() => new THREE.MeshPhysicalMaterial({
      color: 0xd4aa6a,
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 1.4,
    }))
    c.material = Array.isArray(c.material) ? newMats : newMats[0]
  })
}

function setOpacity(g, v) {
  g.traverse(c => {
    if (c.isMesh) [].concat(c.material).forEach(m => { m.transparent = v < 1; m.opacity = v })
  })
}

function fadeGroup(g, from, to, ms) {
  return new Promise(res => {
    const t0 = performance.now()
    const tick = now => {
      const t = Math.min((now - t0) / ms, 1)
      const e = t < 0.5 ? 2*t*t : -1+(4-2*t)*t
      setOpacity(g, from + (to - from) * e)
      t < 1 ? requestAnimationFrame(tick) : res()
    }
    requestAnimationFrame(tick)
  })
}

function loadGLB(index, s, onProgress) {
  const key = CATS[index].key
  if (s.models[key]) return Promise.resolve(s.models[key])
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    if (s.decoder) loader.setMeshoptDecoder(s.decoder)
    loader.load(
      CATS[index].file,
      gltf => { fitToView(gltf.scene, s.camera); applyGold(gltf.scene); s.models[key] = gltf.scene; resolve(gltf.scene) },
      xhr  => { onProgress?.(xhr.total ? (xhr.loaded / xhr.total) * 92 : 50) },
      reject
    )
  })
}

function wrapModel(model, cam) {
  const g = new THREE.Group()
  const c = model.clone(true)
  fitToView(c, cam); applyGold(c); g.add(c)
  return g
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
function useThreeScene(containerRef, onProgress, onLoaded) {
  const r = useRef({})

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const s = r.current

    // KEY FIX: local variable, not a ref field.
    // React Strict Mode mounts→unmounts→remounts in dev.
    // A ref-based flag gets set true on first cleanup and stays true,
    // so the second run's async continuation bails immediately → stuck at 0%.
    let cancelled = false
    const safety  = setTimeout(() => { if (!cancelled) onLoaded() }, 8000)

    ;(async () => {
      // MeshoptDecoder — skip cleanly if package not installed
      try {
        const mod = await Promise.race([
          import('meshoptimizer'),
          new Promise((_, rej) => setTimeout(() => rej('timeout'), 3000)),
        ])
        if (!cancelled && mod?.MeshoptDecoder) {
          if (mod.MeshoptDecoder.ready) await mod.MeshoptDecoder.ready
          s.decoder = mod.MeshoptDecoder
        }
      } catch { /* not installed, fine */ }

      if (cancelled) return

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setSize(el.clientWidth, el.clientHeight)
      // r152 renamed outputEncoding → outputColorSpace
      if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace
      else renderer.outputEncoding = 3001
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.9
      renderer.shadowMap.enabled = true
      el.appendChild(renderer.domElement)

      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(36, el.clientWidth / el.clientHeight, 0.01, 1000)
      camera.position.set(0, 0.5, 12)
      Object.assign(s, { renderer, scene, camera, models: {}, activeGroup: null, floatTime: 0, transitioning: false, currentCat: 0 })

      // Lights
      scene.add(new THREE.AmbientLight(0xfff8f0, 1.3))
      const key = new THREE.DirectionalLight(0xfff3d0, 3.8)
      key.position.set(3, 6, 5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); scene.add(key)
      ;[[-4,2,3,0xe8eeff,1.3],[-2,3,-5,0xfff8e0,2.2]].forEach(([x,y,z,c,i]) => {
        const l = new THREE.DirectionalLight(c, i); l.position.set(x,y,z); scene.add(l)
      })
      const bounce = new THREE.PointLight(0xffd070, 1.6, 14); bounce.position.set(0,-3,2); scene.add(bounce)
      const topL   = new THREE.PointLight(0xfffcf0, 1.1, 10); topL.position.set(0,8,0);   scene.add(topL)


      // HDR environment map
      const pmrem = new THREE.PMREMGenerator(renderer)
      pmrem.compileEquirectangularShader()
      new RGBELoader().load('/final.hdr', hdr => {
        const envMap = pmrem.fromEquirectangular(hdr).texture
        scene.environment = envMap
        hdr.dispose(); pmrem.dispose()
        // Re-assert gold after HDR loads — env map can shift perceived color
        if (s.activeGroup) applyGold(s.activeGroup)
      })
      // Ground + glow ring
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(20,20), new THREE.ShadowMaterial({ opacity: 0.1 }))
      ground.rotation.x = -Math.PI/2; ground.position.y = -2.2; ground.receiveShadow = true; scene.add(ground)
      const glowRing = new THREE.Mesh(
        new THREE.RingGeometry(1, 1.55, 80),
        new THREE.MeshBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.07, side: THREE.DoubleSide })
      )
      glowRing.rotation.x = -Math.PI/2; glowRing.position.y = -2.19; scene.add(glowRing); s.glowRing = glowRing

      // Animation loop
      const clock = new THREE.Clock()
      const loop = () => {
        s.raf = requestAnimationFrame(loop)
        const dt = clock.getDelta()
        s.floatTime += dt
        if (s.activeGroup && !s.userInteracting?.()) {
          s.activeGroup.rotation.y += dt * 0.32
          s.activeGroup.position.y  = Math.sin(s.floatTime * 0.6) * 0.09
          s.activeGroup.rotation.z  = Math.sin(s.floatTime * 0.38) * 0.016
        }
        s.glowRing.material.opacity = 0.045 + Math.sin(s.floatTime * 1.15) * 0.03
        s.glowRing.rotation.z += dt * 0.06
        if (s.controls) s.controls.update()
        renderer.render(scene, camera)
      }
      loop()

      // OrbitControls — zoom + rotate, no pan
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enablePan = false
      controls.enableDamping = true
      controls.dampingFactor = 0.06
      controls.minDistance = 0.5
      controls.maxDistance = 50
      controls.autoRotate = false
      s.controls = controls
      // Pause model auto-spin while user is interacting
      let userInteracting = false
      controls.addEventListener('start', () => { userInteracting = true })
      controls.addEventListener('end',   () => { setTimeout(() => { userInteracting = false }, 800) })
      s.userInteracting = () => userInteracting

      // Resize
      const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight
        renderer.setSize(el.clientWidth, el.clientHeight)
        if (s.activeGroup) fitToView(s.activeGroup, camera)
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize); s.onResize = onResize

      // Load first model then dismiss loader
      try {
        const obj = await loadGLB(0, s, onProgress)
        if (!cancelled) { const g = wrapModel(obj, camera); s.activeGroup = g; scene.add(g) }
      } catch (e) { console.warn('GLB load failed — are .glb files in /public/?', e) }

      if (!cancelled) {
        clearTimeout(safety)
        onLoaded()
        setTimeout(() => loadGLB(1, s).catch(()=>{}), 800)
        setTimeout(() => loadGLB(2, s).catch(()=>{}), 1600)
      }
    })()

    return () => {
      cancelled = true
      clearTimeout(safety)
      cancelAnimationFrame(s.raf)
      window.removeEventListener('resize', s.onResize)
      s.renderer?.dispose()
      try { if (s.renderer?.domElement && el.contains(s.renderer.domElement)) el.removeChild(s.renderer.domElement) } catch {}
      s.controls?.dispose()
      s.renderer = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const switchTo = useCallback(async (index) => {
    const s = r.current
    if (s.transitioning || index === s.currentCat || !s.scene) return
    s.transitioning = true; s.currentCat = index

    if (s.activeGroup) { await fadeGroup(s.activeGroup, 1, 0, 360); s.scene.remove(s.activeGroup) }

    try {
      const obj = await loadGLB(index, s)
      const g = wrapModel(obj, s.camera)
      setOpacity(g, 0); s.scene.add(g); s.activeGroup = g
      await fadeGroup(g, 0, 1, 480)
    } catch (e) { console.warn(e) }

    s.transitioning = false
  }, [])

  return switchTo
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function HeroPage() {
  const containerRef  = useRef(null)
  const catIdxRef     = useRef(0)
  const [catIdx,      setCatIdx]      = useState(0)
  const [progress,    setProgress]    = useState(0)
  const [loaderDone,  setLoaderDone]  = useState(false)
  const [textVisible, setTextVisible] = useState(false)

  const handleLoaded = useCallback(() => {
    setProgress(100)
    setTimeout(() => { setLoaderDone(true); setTextVisible(true) }, 450)
  }, [])

  const switchTo = useThreeScene(containerRef, setProgress, handleLoaded)

  const switchCat = useCallback((index) => {
    if (index === catIdxRef.current) return
    catIdxRef.current = index
    setTextVisible(false)
    setCatIdx(index)
    switchTo(index)
    setTimeout(() => setTextVisible(true), 320)
  }, [switchTo])

  const cat = CATS[catIdx]

  return (
    <>
      {/* ── Loader ── */}
      <div className={`fixed inset-0 z-[200] bg-ivory flex flex-col items-center justify-center gap-6 transition-[opacity,visibility] duration-700 ${loaderDone ? 'opacity-0 invisible' : ''}`}>
        <span className="text-crimson tracking-[0.5em] uppercase text-[13px] font-semibold">The Vault</span>
        <span className="font-serif italic text-gold-dark text-[15px] -mt-3">by Karan Desai</span>
        <div className="w-36 h-px bg-ivory-dark relative overflow-hidden -mt-1">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-dark to-gold-light transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-ink-soft text-[10px] tracking-[0.2em] -mt-3">{Math.round(progress)}%</span>
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between h-[72px] xl:h-[84px] bg-ivory/70 backdrop-blur-lg border-b border-gold/20" style={{ padding: "0 clamp(32px, 4vw, 100px)" }} >
        <ul className="flex gap-8 list-none">
          {CATS.map((c, i) => (
            <li key={c.key}>
              <button onClick={() => switchCat(i)} className={`relative group text-[11px] xl:text-[12px] tracking-[0.16em] uppercase font-medium transition-colors ${i === catIdx ? 'text-gold-dark' : 'text-ink-mid hover:text-ink'}`}>
                {c.overlay}
                <span className={`absolute -bottom-0.5 left-0 h-px transition-[width] duration-300 ${i === catIdx ? 'w-full bg-gold-dark' : 'w-0 group-hover:w-full bg-gold'}`} />
              </button>
            </li>
          ))}
        </ul>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <span className="text-crimson tracking-[0.38em] uppercase font-semibold leading-tight" style={{ fontSize: "clamp(12px, 0.9vw, 16px)" }}>The&nbsp;&nbsp;Vault</span>
          <span className="font-serif italic text-ink-soft tracking-[0.2em] mt-0.5" style={{ fontSize: "clamp(9px, 0.7vw, 12px)" }}>by Karan Desai</span>
        </div>

        <div className="flex items-center gap-7">
          {['Collection','About','Contact'].map(l => (
            <a key={l} href="#" className="text-[11px] xl:text-[12px] tracking-[0.16em] uppercase font-medium text-ink-mid hover:text-ink transition-colors">{l}</a>
          ))}
          <a href="#" className="text-[10px] xl:text-[11px] tracking-[0.18em] uppercase font-semibold text-ivory bg-ink px-5 xl:px-6 py-2.5 xl:py-3 hover:bg-gold-dark transition-colors">Shop Now</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative w-screen h-screen min-h-[700px] overflow-hidden">

        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(248,245,240,.4) 70%, rgba(248,245,240,.88) 100%)' }} />

        {/* Counter — left */}
        <div className="absolute bottom-[5vh] right-[clamp(40px,4.5vw,120px)] z-10 flex flex-col items-end gap-1 opacity-[0.45] pointer-events-none">
          <span className="font-extralight text-ink leading-none tracking-[-0.04em]" style={{ fontSize: "clamp(48px, 5vw, 96px)" }}>
            {cat.counter}<span className="text-base font-normal text-ink-soft align-super tracking-[0.02em]">/03</span>
          </span>
          <div className="w-5 h-px bg-gold" />
          <span className="tracking-[0.3em] uppercase text-ink-soft font-medium" style={{ fontSize: "clamp(8px, 0.6vw, 11px)" }}>Collection</span>
        </div>

        {/* Category tabs — right */}
        <div className="absolute top-1/2 right-[clamp(40px,4.5vw,120px)] -translate-y-1/2 z-10 flex flex-col gap-1">
          {CATS.map((c, i) => (
            <button key={c.key} onClick={() => switchCat(i)} className="flex items-center flex-row-reverse gap-3 py-2.5 group">
              <span style={{ fontSize: "clamp(10px, 0.75vw, 13px)" }} className={`tracking-[0.22em] uppercase font-medium whitespace-nowrap transition-colors duration-300 ${i === catIdx ? 'text-gold-dark' : 'text-ink-soft group-hover:text-ink'}`}>
                {c.overlay}
              </span>
              <span className={`h-px transition-all duration-300 ${i === catIdx ? 'w-[52px] bg-gold' : 'w-7 bg-ink-soft group-hover:w-9'}`} />
              <span className={`text-[8px] text-gold tracking-[0.1em] transition-all duration-300 ${i === catIdx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'}`}>
                0{i+1}
              </span>
            </button>
          ))}
        </div>

        {/* Hero text — bottom left */}
        <div className={`absolute bottom-20 xl:bottom-24 left-[60px] xl:left-[80px] z-10 max-w-[440px] xl:max-w-[540px] hero-text ${textVisible ? 'visible' : ''}`}>
          <p className="flex items-center gap-3 tracking-[0.3em] uppercase text-gold font-medium mb-[1.2vw]" style={{ fontSize: "clamp(10px, 0.85vw, 14px)" }}>
            <span className="block w-6 h-px bg-gold flex-shrink-0" />
            {cat.eyebrow}
          </p>
          <h1 className="font-light text-ink mb-5 leading-[0.97] tracking-[-0.02em] text-[clamp(38px,5vw,96px)]">
            {cat.title[0]}
            <em className="font-serif font-light text-gold-dark text-[1.18em] tracking-[0.01em] block" style={{ fontStyle: 'italic' }}>
              {cat.title[1]}
            </em>
          </h1>
          <p className="leading-[1.8] text-ink-soft mb-[2vw]" style={{ fontSize: "clamp(13px, 1.05vw, 17px)", maxWidth: "clamp(280px, 24vw, 480px)" }}>{cat.desc}</p>
          <div className="flex items-center gap-7">
            <a href="#" className="tracking-[0.2em] uppercase font-semibold text-ivory bg-ink hover:bg-gold-dark transition-colors" style={{ fontSize: "clamp(10px, 0.8vw, 13px)", padding: "clamp(12px,1vw,18px) clamp(24px,2vw,42px)" }}>{cat.cta}</a>
            <a href="#" className="flex items-center gap-2.5 tracking-[0.2em] uppercase font-medium text-ink-mid hover:text-gold-dark transition-colors group" style={{ fontSize: "clamp(10px, 0.8vw, 13px)" }}>
              Explore
              <span className="relative inline-block w-5 h-px bg-current group-hover:w-8 transition-[width] duration-200">
                <span className="absolute right-0 -top-[3px] w-1.5 h-1.5 border-r border-t border-current rotate-45" />
              </span>
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-9 bg-gradient-to-b from-gold to-transparent animate-scroll-pulse" />
          <span className="text-[8px] tracking-[0.32em] uppercase text-ink-soft font-medium">Scroll</span>
        </div>
      </section>
    </>
  )
}