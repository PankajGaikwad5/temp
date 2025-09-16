'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  PerspectiveCamera,
  ContactShadows,
  OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import ThreeModel from './ThreeModel';
import { useRouter } from 'next/navigation';

// Helpers
const TAU = Math.PI * 2;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
function nearestEquivalentAngle(current, targetBase) {
  const k = Math.round((current - targetBase) / TAU);
  return targetBase + k * TAU;
}

function SceneInner({
  models,
  selectedIndex,
  onFrontChange,
  radius,
  bounceAmplitude,
  bounceSpeed,
  snapDuration,
  pauseAfterInteractMs,
  scale,
}) {
  const groupRef = useRef();
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const targetAngleRef = useRef(null);
  const lastInteractAtRef = useRef(0);
  const torusRefs = useRef([]);
  const router = useRouter();

  const { camera } = useThree();
  const [currentIndex, setCurrentIndex] = useState(selectedIndex ?? 0);

  // make baseAngles dynamic based on models length
  const baseAngles = useMemo(
    () => models.map((_, i) => (i * 2 * Math.PI) / models.length),
    [models.length]
  );

  // GSAP camera intro (preserved)
  useEffect(() => {
    gsap.fromTo(
      camera.position,
      { z: 30, y: 5 },
      { z: 8.5, y: 0.2, duration: 2.0, ease: 'power3.out' }
    );
  }, [camera]);

  // When parent updates selectedIndex, set target angle (parent is source of truth)
  useEffect(() => {
    if (selectedIndex === null || !groupRef.current) return;
    const y = groupRef.current.rotation.y;
    const targetBase =
      -baseAngles[Math.max(0, Math.min(selectedIndex, models.length - 1))];
    // choose nearest equivalent so rotation is smooth and continuous
    const target = nearestEquivalentAngle(y, targetBase);
    targetAngleRef.current = target;
    lastInteractAtRef.current = performance.now();
    // update internal currentIndex immediately to avoid flicker in UI
    setCurrentIndex(selectedIndex);
    // notify parent (if needed)
    if (onFrontChange) onFrontChange(selectedIndex);
  }, [selectedIndex, baseAngles, models.length, onFrontChange]);

  // Pointer drag handlers (user can drag to rotate)
  useEffect(() => {
    const onDown = (e) => {
      draggingRef.current = true;
      lastXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
      lastInteractAtRef.current = performance.now();
      targetAngleRef.current = null; // cancel auto snap while dragging
    };
    const onMove = (e) => {
      if (!draggingRef.current || !groupRef.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = x - lastXRef.current;
      lastXRef.current = x;
      // rotate group according to pointer delta
      groupRef.current.rotation.y += deltaX * 0.005;
    };
    const onUp = () => {
      if (!draggingRef.current || !groupRef.current) {
        draggingRef.current = false;
        return;
      }
      draggingRef.current = false;
      lastInteractAtRef.current = performance.now();

      // Snap to nearest base angle
      const y = groupRef.current.rotation.y;
      let bestTarget = null;
      let bestDist = Infinity;
      let bestIdx = 0;
      for (let i = 0; i < baseAngles.length; i++) {
        const targetBase = -baseAngles[i];
        const candidate = nearestEquivalentAngle(y, targetBase);
        const dist = Math.abs(wrap(candidate - y));
        if (dist < bestDist) {
          bestDist = dist;
          bestTarget = candidate;
          bestIdx = i;
        }
      }
      if (bestTarget !== null) {
        targetAngleRef.current = bestTarget;
        // update parent with snapped index
        setCurrentIndex(bestIdx);
        if (onFrontChange) onFrontChange(bestIdx);
      }
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [baseAngles, onFrontChange]);

  // Autoplay inside scene is disabled — parent handles autoplay. (We only respect pauseAfterInteractMs for anything local)
  // Animation loop: snapping and small torus rotation
  useFrame((_, dt) => {
    if (!groupRef.current) return;

    // Snapping animation if targetAngleRef is set
    if (typeof targetAngleRef.current === 'number') {
      const y = groupRef.current.rotation.y;
      const target = targetAngleRef.current;
      groupRef.current.rotation.y = damp(y, target, snapDuration, dt);
      // finish snapping if close enough
      if (Math.abs(wrap(groupRef.current.rotation.y - target)) < 0.001) {
        groupRef.current.rotation.y = target;
        targetAngleRef.current = null;
      }
    }

    // rotate torus accents lightly if any (kept for future accents)
    if (torusRefs.current && torusRefs.current.length) {
      for (let i = 0; i < torusRefs.current.length; i++) {
        const t = torusRefs.current[i];
        if (t) {
          t.rotation.z += dt * 0.2 * (0.6 + i * 0.1);
        }
      }
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.2, 8]} fov={45} />
      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 6]} intensity={0.95} castShadow />
      <Environment files='/final.hdr' />

      <OrbitControls enableRotate={false} enablePan={false} maxDistance={20} />

      {/* group with models placed on a circle - now with scale support */}
      <group ref={groupRef} scale={scale}>
        {models.map((m, i) => {
          const x = Math.sin(baseAngles[i]) * radius;
          const z = Math.cos(baseAngles[i]) * radius;
          const isActive = i === currentIndex;
          return (
            <group key={i} position={[x, 0, z]}>
              <ThreeModel
                modelPath={m.path}
                baseAngle={baseAngles[i]}
                radius={0.2}
                bounceAmplitude={bounceAmplitude}
                bounceSpeed={bounceSpeed}
                phaseOffset={i * 1.33}
                isActive={isActive}
                onClick={() => {
                  // user clicked model -> navigate (keep parent controlling which is front)
                  if (m.link) router.push(m.link);
                }}
              />
            </group>
          );
        })}
      </group>

      <ContactShadows
        position={[0, -2.6, 0]}
        opacity={0.35}
        scale={12}
        blur={2}
        far={4}
      />
    </>
  );
}

export default function ModelCarouselScene({
  models = [],
  onFrontChange = () => {},
  selectedIndex = 0,
  radius = 1,
  bounceAmplitude = 0.001,
  bounceSpeed = 0.001,
  autoAdvanceInterval = 5000,
  snapDuration = 6,
  pauseAfterInteractMs = 3000,
  scale = 1,
}) {
  // Render the Canvas and inner scene
  return (
    <group>
      <SceneInner
        models={models}
        selectedIndex={selectedIndex}
        onFrontChange={onFrontChange}
        radius={radius}
        bounceAmplitude={bounceAmplitude}
        bounceSpeed={bounceSpeed}
        snapDuration={snapDuration}
        pauseAfterInteractMs={pauseAfterInteractMs}
        scale={scale}
      />
    </group>
  );
}
