'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function fitToView(obj, cam) {
  const box  = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3())
  obj.position.sub(box.getCenter(new THREE.Vector3()))
  const maxDim = Math.max(size.x, size.y, size.z)
  let z = (maxDim / 2 / Math.tan((cam.fov * Math.PI) / 360)) * 3.8
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
  if (vw < 640)  z *= 1.8
  else if (vw < 1024) z *= 1.35
  else if (vw < 1280) z *= 1.15
  cam.position.set(0, size.y * 0.1, z)
  cam.near = 0.01
  cam.far  = z * 20
  cam.updateProjectionMatrix()
}

function setShadows(obj) {
  obj.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true } })
}

function applyMaterialColor(obj, colorHex) {
  obj.traverse(c => {
    if (c.isMesh) {
      if (c.material) {
        c.material = c.material.clone()
        c.material.color.set(colorHex)
        c.material.metalness = 1.0
        c.material.roughness = 0.15
        c.material.envMapIntensity = 1.2
        c.material.needsUpdate = true
      }
    }
  })
}

export default function PDPViewer({ modelPath, materialColor }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const groupRef = useRef(null)
  const controlsRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace
    else renderer.outputEncoding = 3001
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
    renderer.shadowMap.enabled = true
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    sceneRef.current = scene
    
    const camera = new THREE.PerspectiveCamera(36, el.clientWidth / el.clientHeight, 0.01, 1000)
    camera.position.set(0, 0, 12)
    cameraRef.current = camera

    const pmrem = new THREE.PMREMGenerator(renderer)
    pmrem.compileEquirectangularShader()
    new RGBELoader().load('/final.hdr', hdr => {
      const envMap = pmrem.fromEquirectangular(hdr).texture
      scene.environment = envMap
      hdr.dispose()
      pmrem.dispose()
    })

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 0.5
    controls.maxDistance = 80
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.5
    controlsRef.current = controls

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.05 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -2.2
    ground.receiveShadow = true
    scene.add(ground)

    let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      controls.update()
      renderer.render(scene, camera)
    }
    loop()

    const onResize = () => {
      if (!el || !camera) return
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, []) // Setup once

  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return
    setLoading(true)

    const loader = new GLTFLoader()
    
    const loadModel = () => {
      loader.load(
        modelPath,
        gltf => {
          if (groupRef.current) {
            sceneRef.current.remove(groupRef.current)
          }
          
          const g = new THREE.Group()
          const c = gltf.scene.clone(true)
          setShadows(c)
          applyMaterialColor(c, materialColor)
          
          fitToView(c, cameraRef.current)
          g.add(c)
          
          groupRef.current = g
          sceneRef.current.add(g)
          
          // Reset controls target
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0)
          }
          
          setLoading(false)
        },
        undefined,
        err => {
          console.error("Failed to load model:", err)
          setLoading(false)
        }
      )
    }

    import('meshoptimizer').then(mod => {
      if (mod?.MeshoptDecoder) {
        if (mod.MeshoptDecoder.ready) {
          mod.MeshoptDecoder.ready.then(() => {
            loader.setMeshoptDecoder(mod.MeshoptDecoder)
            loadModel()
          })
        } else {
          loader.setMeshoptDecoder(mod.MeshoptDecoder)
          loadModel()
        }
      } else {
        loadModel()
      }
    }).catch(() => loadModel())

  }, [modelPath]) // Re-run when modelPath changes

  useEffect(() => {
    if (groupRef.current) {
      applyMaterialColor(groupRef.current, materialColor)
    }
  }, [materialColor])

  return (
    <div className="relative w-full h-full bg-[#f8f5f0]">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(248,245,240,.4) 70%, rgba(248,245,240,.88) 100%)' }} />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f8f5f0]/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#c9a96e] tracking-widest uppercase text-xs">Loading Vault</span>
          </div>
        </div>
      )}
    </div>
  )
}
