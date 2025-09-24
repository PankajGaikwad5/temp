'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function FloatingAstronaut({ modelPath, scale = 0.05 }) {
  const meshRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Clone the scene
  const clonedScene = useMemo(() => {
    const s = scene.clone(true);

    // clone materials to avoid shared references
    s.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
      }
    });
    return s;
  }, [scene]);

  // Unique parameters
  const params = useMemo(
    () => ({
      startPos: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ],
      driftVel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.0025
      ),
      rotType: Math.floor(Math.random() * 4),
      rotSpeed: 0.0005 + Math.random() * 0.009,
      rotAxis1: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize(),
      rotAxis2: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize(),
      floatPattern: Math.floor(Math.random() * 3),
      floatSpeed: 0.1 + Math.random() * 0.03,
      floatAmplitude: 0.05 + Math.random() * 0.015,
      phaseOffset: Math.random() * Math.PI * 2,
      colorOffset: Math.random(), // unique hue offset
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    // Apply floating & rotation as before...
    meshRef.current.position.x = params.startPos[0];
    meshRef.current.position.y =
      params.startPos[1] +
      Math.sin(t * params.floatSpeed + params.phaseOffset) *
        params.floatAmplitude;
    meshRef.current.position.z = params.startPos[2];

    // simple rotation
    meshRef.current.rotation.y = t * 0.2;

    // Color changing effect
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const hue = (t * 0.1 + params.colorOffset) % 1; // each astronaut independent
        child.material.color.setHSL(hue, 0.7, 0.5);
      }
    });
  });

  return <primitive ref={meshRef} object={clonedScene} scale={scale} />;
}

export default function FloatingAstronauts({
  astronautModelPath = '/optimizedyoda.glb',
  count = 5,
  scale = 0.05,
}) {
  return (
    <group name='floating-astronauts'>
      {Array.from({ length: count }, (_, i) => (
        <FloatingAstronaut
          key={i}
          modelPath={astronautModelPath}
          scale={scale + (Math.random() - 0.5) * 0.03}
        />
      ))}
    </group>
  );
}
