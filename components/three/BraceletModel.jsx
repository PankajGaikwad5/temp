'use client';

import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function BraceletModel({
  modelPath = '/optimized/bracelet.glb',
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  color, // New prop
}) {
  const groupRef = useRef(null);
  const { scene } = useGLTF(modelPath);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!scene || !groupRef.current) return;

    // Clear previous children
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }

    const modelClone = scene.clone();

    // Apply color if provided
    if (color) {
      modelClone.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color);
          child.material.needsUpdate = true;
        }
      });
    }

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(modelClone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    // Desired target size in units
    const targetSize = 3;
    const calculatedScale = targetSize / maxDim;

    setScale(calculatedScale);

    groupRef.current.add(modelClone);
  }, [scene, color]); // Re-run if color changes

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      rotation={[
        THREE.MathUtils.degToRad(rotation[0]),
        THREE.MathUtils.degToRad(rotation[1]),
        THREE.MathUtils.degToRad(rotation[2]),
      ]}
    />
  );
}
