'use client';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

export function ModelRenderer({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  const model = scene.clone(true);

  // normalize model size
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  model.position.sub(center); // center model
  const scaleFactor = 2.5 / size; // adjust "2.5" to make models larger/smaller
  model.scale.setScalar(scaleFactor);

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

  return <primitive object={model} />;
}
