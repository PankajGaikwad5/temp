'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { useGLTF, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

extend({ PointsMaterial: THREE.PointsMaterial });

// helper: sample surface points from model
function useModelParticles(url, particleCount = 8000) {
  const { scene } = useGLTF(url);
  const mesh = scene.children.find((c) => c.isMesh);
  const sampler = useMemo(
    () =>
      new (require('three/examples/jsm/math/MeshSurfaceSampler.js').MeshSurfaceSampler)(
        mesh
      ).build(),
    [mesh]
  );

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const temp = new THREE.Vector3();
    for (let i = 0; i < particleCount; i++) {
      sampler.sample(temp);
      pos.set([temp.x, temp.y, temp.z], i * 3);
    }
    return pos;
  }, [sampler, particleCount]);

  return positions;
}

// particle cloud
function ParticleCloud({ positions, refObj }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={refObj} geometry={geometry}>
      <pointsMaterial color={'#d4af37'} size={0.02} transparent opacity={1} />
    </points>
  );
}

export default function Scene() {
  const scroll = useScroll();
  const bracelet = useModelParticles('/bracelet.glb');
  const pendant = useModelParticles('/pendant.glb');
  const ring = useModelParticles('/ring.glb');

  const models = [bracelet, pendant, ring];
  const [index, setIndex] = useState(0);
  const pointsRef = useRef();

  // store active positions
  const currentPositions = useRef(bracelet);

  // morph helper
  const morphTo = (toPositions) => {
    const geometry = pointsRef.current.geometry;
    const from = geometry.attributes.position.array;
    const temp = from.slice();

    gsap.to(temp, {
      endArray: toPositions,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        for (let i = 0; i < from.length; i++) {
          geometry.attributes.position.array[i] = THREE.MathUtils.lerp(
            currentPositions.current[i] || 0,
            toPositions[i] || 0,
            this.progress()
          );
        }
        geometry.attributes.position.needsUpdate = true;
      },
      onComplete: () => {
        currentPositions.current = toPositions;
      },
    });
  };

  // trigger on scroll
  useFrame(() => {
    const p = scroll.offset; // 0 -> 1
    if (p < 0.33 && index !== 0) {
      setIndex(0);
      morphTo(models[0]);
    } else if (p >= 0.33 && p < 0.66 && index !== 1) {
      setIndex(1);
      morphTo(models[1]);
    } else if (p >= 0.66 && index !== 2) {
      setIndex(2);
      morphTo(models[2]);
    }
  });

  return <ParticleCloud positions={models[0]} refObj={pointsRef} />;
}
