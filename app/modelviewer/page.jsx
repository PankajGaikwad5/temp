'use client';

import { Canvas } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Float,
  useGLTF,
} from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function DraggableModel({ modelPath }) {
  const groupRef = useRef();
  const { scene } = useGLTF(modelPath);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  // faster + smoother feel
  const ROTATION_SPEED = 0.005; // sensitivity
  const FRICTION = 0.95; // inertia slowdown

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !groupRef.current) return;
    e.stopPropagation();

    const deltaX = e.clientX - lastPos.x;
    const deltaY = e.clientY - lastPos.y;

    const rotY = deltaX * ROTATION_SPEED * 2; // double the sensitivity
    const rotX = deltaY * ROTATION_SPEED * 2;

    groupRef.current.rotation.y += rotY;
    groupRef.current.rotation.x += rotX;

    setVelocity({ x: rotX, y: rotY }); // store momentum
    setLastPos({ x: e.clientX, y: e.clientY });

    const { x, y, z } = groupRef.current.rotation;
    console.log({
      x: THREE.MathUtils.radToDeg(x).toFixed(1),
      y: THREE.MathUtils.radToDeg(y).toFixed(1),
      z: THREE.MathUtils.radToDeg(z).toFixed(1),
    });
  };

  // smooth inertia after drag release
  useEffect(() => {
    let frame;
    const animate = () => {
      if (groupRef.current && !isDragging) {
        groupRef.current.rotation.x += velocity.x;
        groupRef.current.rotation.y += velocity.y;
        setVelocity({
          x: velocity.x * FRICTION,
          y: velocity.y * FRICTION,
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isDragging, velocity]);

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

export default function ModelViewer({
  hdr = '/final.hdr',
  model = '/optimized/bracelet.glb',
}) {
  return (
    <div className='w-full h-[80vh] cursor-grab active:cursor-grabbing'>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment files={hdr} />
        <Float>
          <DraggableModel modelPath={model} />
        </Float>
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />
      </Canvas>
    </div>
  );
}
