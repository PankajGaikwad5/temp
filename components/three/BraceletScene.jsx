'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
  OrbitControls,
  Float,
} from '@react-three/drei';
import BraceletModel from './BraceletModel';

export default function BraceletScene({
  rotation = [0, 0, 0],
  className = '',
  interactive = false,
  enableZoom = true,
  hdr = '/final.hdr',
  model = '/optimized/bracelet.glb',
  color,
}) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
        className='bg-cover'
        style={!interactive && { backgroundImage: "url('../modelbg.png')" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onWheel={(e) => e.stopPropagation()}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 8]}
          fov={45}
          near={0.1}
          far={1000}
        />
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        {/* Environment */}
        <Environment files={hdr} />
        {/* Model */}\
        <Float>
          <BraceletModel
            modelPath={model}
            rotation={rotation}
            color={color}
            // color={'#dea193'}
          />
        </Float>
        {/* Ground shadow */}
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
        {/* OrbitControls for interactive instances */}
        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={enableZoom}
            minDistance={3}
            maxDistance={20}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
          />
        )}
      </Canvas>
    </div>
  );
}
