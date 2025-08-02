'use client';

import { Canvas } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
} from '@react-three/drei';
import BraceletModel from './BraceletModel';

export default function BraceletScene({ rotation, className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 8]}
          fov={45}
          near={0.1}
          far={1000}
        />

        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment for reflections */}
        <Environment files={'./studio_small_09_4k.hdr'} />
        {/* <Environment files={'./startup.hdr'} /> */}

        {/* The bracelet model */}
        <BraceletModel rotation={rotation} />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
      </Canvas>
    </div>
  );
}
