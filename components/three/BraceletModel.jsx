'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function BraceletModel({
  modelPath = '/model.glb', // path to your .glb file
  rotation,
  position = [0, 0, 0],
}) {
  const groupRef = useRef(null);
  const floatOffset = useRef(0);
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    if (groupRef.current && scene) {
      // Clear any existing children
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }

      // Clone and add model to group
      const modelClone = scene.clone();
      groupRef.current.add(modelClone);
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Floating animation
      floatOffset.current += delta * 2;
      groupRef.current.position.y =
        position[1] + Math.sin(floatOffset.current) * 0.2;

      // Subtle rotation animation
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[
        THREE.MathUtils.degToRad(rotation[0]),
        THREE.MathUtils.degToRad(rotation[1]),
        THREE.MathUtils.degToRad(rotation[2]),
      ]}
    />
  );
}
