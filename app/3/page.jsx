'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// A single carousel item
function JewelryModel({ url, position, isActive }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      // Gentle idle rotation
      ref.current.rotation.y += 0.003;

      // Scale up the active model
      ref.current.scale.lerp(
        new THREE.Vector3(
          isActive ? 0.6 : 0.4,
          isActive ? 0.6 : 0.4,
          isActive ? 0.6 : 0.4
        ),
        0.1
      );
    }
  });

  return <primitive object={scene} ref={ref} position={position} />;
}

export default function JewelryCarousel() {
  const models = [
    { url: '/bracelet.glb', name: 'Bracelet' },
    { url: '/pendant.glb', name: 'Pendant' },
    { url: '/ring.glb', name: 'Ring' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Arrange models in a circle
  const radius = 4;

  return (
    <div className='relative h-screen w-full bg-black text-white'>
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0.8, 8], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <Environment files={'./final.hdr'} />

        {models.map((m, i) => {
          const angle = (i - activeIndex) * ((2 * Math.PI) / models.length);
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          return (
            <JewelryModel
              key={i}
              url={m.url}
              position={[x, 0, z]}
              isActive={i === activeIndex}
            />
          );
        })}
      </Canvas>

      {/* Carousel Controls */}
      <div className='absolute bottom-10 w-full flex justify-center gap-6'>
        {models.map((m, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`px-4 py-2 rounded-full border transition ${
              activeIndex === i
                ? 'bg-white text-black'
                : 'border-white text-white'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>
    </div>
  );
}
