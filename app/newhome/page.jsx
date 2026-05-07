'use client';

import { Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Inter } from '@/lib/fonts';

const inter = Inter({ subsets: ['latin'], weight: ['900'] });

useGLTF.preload('/optimized/bracelet.glb');
useGLTF.preload('/optimized/ring.glb');
useGLTF.preload('/op.glb');

class CanvasBoundary extends Component {
  state = { dead: false };
  static getDerivedStateFromError() { return { dead: true }; }
  render() { return this.state.dead ? null : this.props.children; }
}

function Model({ path, scale }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={scale} />;
}

function ModelViewer({ path, scale, cameraZ, style }) {
  return (
    <div style={{ ...style, overflow: 'hidden' }}>
      <CanvasBoundary>
        <Canvas
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 0.1, cameraZ ?? 6], fov: 40 }}
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={2} />
          <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#ffe8a0" />
          <Suspense fallback={null}>
            <Environment files="/final.hdr" />
            <Model path={path} scale={scale ?? 1} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={2}
            maxDistance={8}
            minPolarAngle={Math.PI * 0.1}
            maxPolarAngle={Math.PI * 0.9}
            autoRotate
            autoRotateSpeed={1.2}
            enableDamping
            dampingFactor={0.06}
          />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}

export default function NewHomePage() {
  return (
    <main style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#ffffff',
    }}>
      {/* ── background logotype ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 0, pointerEvents: 'none',
      }}>
        <span className={inter.className} style={{
          fontSize: 'clamp(72px, 17vw, 240px)',
          fontWeight: 900,
          color: '#000000',
          letterSpacing: '-0.025em',
          lineHeight: 1,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>THE VAULT</span>
      </div>

      {/*
        ── V lines ──────────────────────────────────────────────────────────
        Left arm : (15%,0%) → (42%,100%)   slope: +27% across 100% down
        Right arm: (75%,0%) → (42%,100%)   slope: −33% across 100% down
        Meeting point (42%,100%) is off-centre.
      */}
      <svg aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 3, pointerEvents: 'none',
      }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="15" y1="0" x2="42" y2="100"
          stroke="#c9a84c" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <line x1="75" y1="0" x2="42" y2="100"
          stroke="#c9a84c" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      {/*
        ── Canvas sizing strategy ────────────────────────────────────────────
        Each canvas spans exactly its zone's bounding rectangle so the canvas
        centre lands inside the zone and OrbitControls orbits the model in the
        right area. Full height (top:0) means no horizontal canvas edge is ever
        visible — only the clip-path diagonal is the boundary.

        Clip-path coords are in the div's own percentage space:

        RING  div: left 0, width 42%, height 100%   (screen 0..42%)
          Left arm in div-x: y=0 → 15/42=35.71%, y=100 → 42/42=100%
          Zone = left of arm  →  polygon(0% 0%, 35.71% 0%, 100% 100%, 0% 100%)

        BRACELET  div: left 15%, width 60%, height 100%   (screen 15..75%)
          Left arm:  y=0 → (15-15)/60=0%,  y=100 → (42-15)/60=45%
          Right arm: y=0 → (75-15)/60=100%, y=100 → (42-15)/60=45%
          Zone = between arms  →  polygon(0% 0%, 100% 0%, 45% 100%)

        PENDANT  div: left 42%, width 58%, height 100%   (screen 42..100%)
          Right arm in div-x: y=0 → (75-42)/58=56.9%, y=100 → (42-42)/58=0%
          Zone = right of arm  →  polygon(56.9% 0%, 100% 0%, 100% 100%, 0% 100%)

        Canvas centres (= model screen centres):
          Ring     → (21%, 50%)   ring zone at y=50% is 0..28.5%    ✓
          Bracelet → (45%, 50%)   bracelet zone at y=50% is 28.5..66.5%  ✓
          Pendant  → (71%, 50%)   pendant zone at y=50% is 58.5..100%   ✓
      */}

      {/* ── ring ── */}
      <ModelViewer
        path="/optimized/ring.glb"
        scale={0.9}
        cameraZ={7}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '42%',
          height: '100%',
          zIndex: 2,
          clipPath: 'polygon(0% 0%, 35.71% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* ── bracelet ── */}
      <ModelViewer
        path="/optimized/bracelet.glb"
        scale={0.85}
        cameraZ={6}
        style={{
          position: 'absolute',
          left: '15%',
          top: 0,
          width: '60%',
          height: '100%',
          zIndex: 2,
          clipPath: 'polygon(0% 0%, 100% 0%, 45% 100%)',
        }}
      />

      {/* ── pendant ── */}
      <ModelViewer
        path="/op.glb"
        scale={0.9}
        cameraZ={7}
        style={{
          position: 'absolute',
          left: '42%',
          top: 0,
          width: '58%',
          height: '100%',
          zIndex: 2,
          clipPath: 'polygon(56.9% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
      />
    </main>
  );
}
