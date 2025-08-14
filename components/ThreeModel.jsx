'use client';

import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Places one model on a circle at baseAngle with subtle bounce + micro-rotation.
 * The parent group (in ModelCarouselScene) rotates; we only manage local float here.
 */
export default function ThreeModel({
  modelPath = '/bracelet.glb',
  baseAngle = 0, // radians around the XZ circle
  radius = 4,
  bounceAmplitude = 0.001,
  bounceSpeed = 0.001,
  phaseOffset = 0,
  scale = 0.4,
}) {
  const group = useRef();
  const { scene } = useGLTF(modelPath);

  // Clone once
  const model = scene.clone(true);
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      // Optional: improve metal/gloss
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

    // Keep the item at its circular placement in local space.
    const x = Math.sin(baseAngle) * radius;
    const z = Math.cos(baseAngle) * radius;
    group.current.position.set(x, 0, z);

    // Subtle floating bounce
    group.current.position.y = Math.sin(t) * bounceAmplitude;

    // Slight idle spin to reinforce 3D feel (very subtle)
    group.current.rotation.y = Math.sin(t * 0.25) * 0.08;
    group.current.rotation.x = Math.cos(t * 0.22) * 0.04;

    // Face the camera direction on average
    // (We rely on parent rotation for which is "front"; here we nudge local facing)
    const look = new THREE.Vector3(0, 0, 0);
    group.current.lookAt(look);
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

// Preload optional
useGLTF.preload('/bracelet.glb');
useGLTF.preload('/ring2.glb');
useGLTF.preload('/ring.glb');
