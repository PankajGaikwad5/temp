'use client';

import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  MeshTransmissionMaterial,
  Environment,
} from '@react-three/drei';
import { Suspense } from 'react';

export default function GlassModelPage() {
  return (
    <div className='w-screen h-screen bg-black'>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshTransmissionMaterial
              transmission={1}
              roughness={0.05}
              thickness={0.6}
              ior={1.5}
              backside
            />
          </mesh>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 2, 2]} intensity={3} />

          <Environment preset='sunset' />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
