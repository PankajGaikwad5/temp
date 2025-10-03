'use client';

import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ThreeModel({
  modelPath = '/bracelet.glb',
  baseAngle = 0,
  radius = 4,
  bounceAmplitude = 0.001,
  bounceSpeed = 0.001,
  phaseOffset = 0,
  scale = 0.4,
  onClick = null, // ✅ click handler
}) {
  const group = useRef();
  const { scene } = useGLTF(modelPath);

  const model = scene.clone(true);
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material && child.material.metalness !== undefined) {
        child.material.metalness = Math.min(
          1,
          (child.material.metalness ?? 0.8) + 0.1
        );
        child.material.roughness = Math.max(
          0,
          (child.material.roughness ?? 0.3) - 0.05
        );
      }
    }
  });

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime() * bounceSpeed + phaseOffset;

    const x = Math.sin(baseAngle) * radius;
    const z = Math.cos(baseAngle) * radius;
    group.current.position.set(x, Math.sin(t) * bounceAmplitude, z);
    group.current.rotation.y = Math.sin(t * 0.25) * 0.08;
    group.current.rotation.x = Math.cos(t * 0.22) * 0.04;

    group.current.lookAt(new THREE.Vector3(0, 0, 0));
  });

  return (
    <group ref={group} scale={scale}>
      <primitive
        object={model}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
        }}
      />
    </group>
  );
}

// useGLTF.preload('/optimized/bracelet.glb');
// useGLTF.preload('/optimized/ring2.glb');
// useGLTF.preload('/optimized/ring.glb');
