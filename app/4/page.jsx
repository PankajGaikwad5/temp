'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Force preload all models immediately
useGLTF.preload('/ring.glb');
useGLTF.preload('/bracelet.glb');
useGLTF.preload('/pendant.glb');

function Model({ url, isActive }) {
  const { scene } = useGLTF(url);
  const ref = useRef();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (scene && ref.current) {
      // Clear and clone
      ref.current.clear();
      const cloned = scene.clone();

      // Center and scale immediately
      const box = new THREE.Box3().setFromObject(cloned);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      cloned.position.sub(center);
      const scale = 1.2 / Math.max(size.x, size.y, size.z);
      cloned.scale.setScalar(scale);

      ref.current.add(cloned);
      setReady(true);
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (ref.current && ready) {
      ref.current.rotation.y += delta * 0.2;
      // Quick but smooth centering
      ref.current.position.y = THREE.MathUtils.lerp(
        ref.current.position.y,
        isActive ? 0.1 : 0,
        delta * 8
      );
    }
  });

  return <group ref={ref} visible={ready} />;
}

function CategoryPanel({ title, href, modelUrl, active, onHover }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        onHover();
        setHovering(true);
      }}
      onMouseLeave={() => setHovering(false)}
      className='relative h-[90vh] min-h-[500px] overflow-hidden border border-white/10 cursor-pointer'
      style={{
        flex: active ? 1.8 : 1,
        transition: 'flex 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.2, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach='background' args={['#000000']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <directionalLight position={[-3, 2, -1]} intensity={0.3} />

        <Suspense fallback={null}>
          <Environment files={'./final.hdr'} />
          <Model url={modelUrl} isActive={active} />

          {active && hovering && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              rotateSpeed={0.8}
              minDistance={2}
              maxDistance={6}
              enableDamping
              dampingFactor={0.05}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Overlay */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8'>
          <div
            className='flex items-end justify-between gap-4 p-4 rounded-lg'
            style={{
              background: active
                ? 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))'
                : 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className='pointer-events-auto'>
              <h3 className='text-xl md:text-2xl font-semibold mb-1'>
                {title}
              </h3>
              {/* <p className='text-white/70 text-sm'>
                Handcrafted • Premium Quality
              </p> */}
            </div>

            <a
              href={href}
              className={`pointer-events-auto px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                active
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'border border-white/50 text-white hover:bg-white hover:text-black'
              }`}
            >
              Explore
            </a>
          </div>
        </div>

        {/* Active glow */}
        {active && (
          <div
            className='absolute inset-0 opacity-20'
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [active, setActive] = useState(1);

  const panels = [
    { title: 'Rings', href: '/rings', modelUrl: '/ring.glb' },
    { title: 'Bracelets', href: '/bracelets', modelUrl: '/bracelet2.glb' },
    { title: 'Pendants', href: '/pendants', modelUrl: '/pendant.glb' },
  ];

  return (
    <main className='min-h-screen bg-black text-white'>
      {/* Header */}
      <header className='max-w-6xl mx-auto px-6 py-8 flex justify-between items-center'>
        <h1 className='text-2xl font-semibold tracking-wide'>Karan Desai</h1>
        <nav className='hidden md:flex gap-6 text-sm text-white/80'>
          {panels.map((panel) => (
            <a
              key={panel.title}
              href={panel.href}
              className='hover:text-white transition-colors'
            >
              {panel.title}
            </a>
          ))}
        </nav>
      </header>

      {/* Main showcase */}
      <section className='max-w-[1400px] mx-auto px-4'>
        <div className='flex gap-4 rounded-xl overflow-hidden'>
          {panels.map((panel, i) => (
            <CategoryPanel
              key={panel.title}
              title={panel.title}
              href={panel.href}
              modelUrl={panel.modelUrl}
              active={active === i}
              onHover={() => setActive(i)}
            />
          ))}
        </div>

        {/* Instructions */}
        <p className='text-center text-white/50 text-xs mt-4'>
          Hover to focus • Click and drag to rotate when focused
        </p>
      </section>
    </main>
  );
}
