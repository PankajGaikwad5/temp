'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  ScrollControls,
  useScroll,
  Environment,
} from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Model({ url, range }) {
  const { scene } = useGLTF(url);
  const ref = useRef();
  const scroll = useScroll();

  useFrame(() => {
    if (!ref.current) return;

    // Normalized visibility 0 → 1 for this model
    const t = THREE.MathUtils.clamp(
      (scroll.offset - range[0]) / (range[1] - range[0]),
      0,
      1
    );

    // Smoothly interpolate scale (fade in/out)
    // ref.current.scale.lerp(new THREE.Vector3(t, t, t), 0.1);

    // Add gentle rotation only if visible
    if (t > 0.01) {
      ref.current.rotation.y += 0.01;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />

      {/* Bracelet: visible from scroll 0 → 0.33 */}
      <Model url='/bracelet.glb' range={[0, 0.33]} />

      {/* Pendant: visible from 0.33 → 0.66 */}
      <Model url='/pendant.glb' range={[0.33, 0.66]} />

      {/* Ring: visible from 0.66 → 1 */}
      <Model url='/ring.glb' range={[0.66, 1]} />
    </>
  );
}

export default function HomePage() {
  return (
    <div className='w-screen h-screen'>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* 3 scroll "pages" for 3 models */}
        <ScrollControls pages={3} damping={6}>
          <Environment files={'./final.hdr'} />
          <Scene />
          <OrbitControls enableZoom={false} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
