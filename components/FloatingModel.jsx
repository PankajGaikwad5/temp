'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Individual floating astronaut with unique behavior
function FloatingAstronaut({ modelPath, scale = 0.05, radius = 15 }) {
  const meshRef = useRef();
  const { scene } = useGLTF(modelPath);
  const clonedScene = useMemo(() => scene?.clone(), [scene]);

  // Each astronaut gets completely unique random parameters
  const params = useMemo(
    () => ({
      startPos: [
        (Math.random() - 0.5) * radius * 1.5,
        (Math.random() - 0.5) * radius * 1.5,
        (Math.random() - 0.5) * radius * 1.5,
      ],
      // Super slow drift velocities (realistic space movement)
      driftVel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008, // much slower
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.0025
      ),
      // Different rotation behaviors for each
      rotType: Math.floor(Math.random() * 4), // 4 different rotation patterns
      rotSpeed: 0.0005 + Math.random() * 0.009, // very slow rotation
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

      // Unique floating patterns
      floatPattern: Math.floor(Math.random() * 3), // 3 different float styles
      floatSpeed: 0.1 + Math.random() * 0.03,
      floatAmplitude: 0.05 + Math.random() * 0.015,
      phaseOffset: Math.random() * Math.PI * 2,

      // Occasional "propulsion" bursts (like using jetpack)
      lastBurst: 0,
      // burstInterval: 5000 + Math.random() * 10000, // random 5-15 seconds
      burstStrength: 0.01 + Math.random() * 0.02,
    }),
    [radius] // ✅ radius is now reactive
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.elapsedTime * 1000; // convert to ms
    const slowT = clock.elapsedTime;

    // Very slow linear drift (main movement)
    meshRef.current.position.x =
      params.startPos[0] + params.driftVel.x * slowT * 50;
    meshRef.current.position.y =
      params.startPos[1] + params.driftVel.y * slowT * 50;
    meshRef.current.position.z =
      params.startPos[2] + params.driftVel.z * slowT * 50;

    // Add unique floating patterns for each astronaut
    if (params.floatPattern === 0) {
      // Gentle sine wave drift
      meshRef.current.position.y +=
        Math.sin(slowT * params.floatSpeed + params.phaseOffset) *
        params.floatAmplitude;
    } else if (params.floatPattern === 1) {
      // Figure-8 pattern
      meshRef.current.position.x +=
        Math.sin(slowT * params.floatSpeed * 2 + params.phaseOffset) *
        params.floatAmplitude;
      meshRef.current.position.y +=
        Math.sin(slowT * params.floatSpeed + params.phaseOffset) *
        params.floatAmplitude *
        0.5;
    } else {
      // Spiral drift
      meshRef.current.position.x +=
        Math.cos(slowT * params.floatSpeed + params.phaseOffset) *
        params.floatAmplitude;
      meshRef.current.position.z +=
        Math.sin(slowT * params.floatSpeed + params.phaseOffset) *
        params.floatAmplitude *
        0.7;
    }

    // Occasional "jetpack burst" - sudden direction change
    // if (t - params.lastBurst > params.burstInterval) {
    //   params.driftVel.add(
    //     new THREE.Vector3(
    //       (Math.random() - 0.5) * params.burstStrength,
    //       (Math.random() - 0.5) * params.burstStrength,
    //       (Math.random() - 0.5) * params.burstStrength
    //     )
    //   );
    //   params.lastBurst = t;
    //   params.burstInterval = 5000 + Math.random() * 10000; // reset interval
    // }

    // Different rotation behaviors for each astronaut
    if (params.rotType === 0) {
      // Single axis slow spin
      meshRef.current.rotateOnAxis(params.rotAxis1, params.rotSpeed);
    } else if (params.rotType === 1) {
      // Dual axis tumble
      meshRef.current.rotateOnAxis(params.rotAxis1, params.rotSpeed);
      meshRef.current.rotateOnAxis(params.rotAxis2, params.rotSpeed * 0.7);
    } else if (params.rotType === 2) {
      // Oscillating rotation
      const rotAmount =
        Math.sin(slowT * 0.5 + params.phaseOffset) * params.rotSpeed * 2;
      meshRef.current.rotateOnAxis(params.rotAxis1, rotAmount);
    } else {
      // Complex tumble
      meshRef.current.rotation.x += Math.sin(slowT * 0.3) * params.rotSpeed;
      meshRef.current.rotation.y +=
        Math.cos(slowT * 0.2) * params.rotSpeed * 1.2;
      meshRef.current.rotation.z +=
        Math.sin(slowT * 0.4) * params.rotSpeed * 0.8;
    }

    // Soft boundary bounce (not wrap)
    const bounds = radius;
    if (Math.abs(meshRef.current.position.x) > bounds) {
      params.driftVel.x *= -0.3; // gentle bounce
    }
    if (Math.abs(meshRef.current.position.y) > bounds) {
      params.driftVel.y *= -0.3;
    }
    if (Math.abs(meshRef.current.position.z) > bounds) {
      params.driftVel.z *= -0.3;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      scale={scale}
      position={params.startPos}
    />
  );
}

export default function FloatingAstronauts({
  astronautModelPath = '/optimizedyoda.glb',
  count = 5,
  scale = 0.05,
  radius = 15, // ✅ New prop with default value
}) {
  return (
    <group name='floating-astronauts'>
      {Array.from({ length: count }, (_, i) => (
        <FloatingAstronaut
          key={i}
          modelPath={astronautModelPath}
          scale={scale + (Math.random() - 0.5) * 0.03} // more size variation
          radius={radius} // ✅ Pass radius down
        />
      ))}
    </group>
  );
}
