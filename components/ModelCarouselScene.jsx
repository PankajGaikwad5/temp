'use client';

import { useFrame } from '@react-three/fiber';
import {
  Environment,
  PerspectiveCamera,
  ContactShadows,
} from '@react-three/drei';
import { useRef, useEffect, useMemo, useState } from 'react';
import ThreeModel from './ThreeModel';

// Math helpers
const TAU = Math.PI * 2;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
// Choose the 2π-equivalent of targetBase that is closest to `current`
function nearestEquivalentAngle(current, targetBase) {
  const k = Math.round((current - targetBase) / TAU);
  return targetBase + k * TAU;
}

export default function ModelCarouselScene({
  models = [],
  onFrontChange = () => {},
  radius = 1,
  bounceAmplitude = 0.001,
  bounceSpeed = 0.001,
  autoAdvanceInterval = 5000, // snaps every 5s by default
  snapDuration = 6, // higher = snappier (damping lambda)
  pauseAfterInteractMs = 3000, // pause autoplay for a bit after user action
}) {
  const groupRef = useRef();
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const targetAngleRef = useRef(null); // when snapping (auto or manual), holds target angle
  const lastInteractAtRef = useRef(0);
  const wheelSnapTimerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  // 3 models around a circle
  const baseAngles = useMemo(
    () => [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3],
    []
  );

  // Which is closest to front (angle ~ 0 after group rotation)
  const detectFrontIndex = (groupRotY) => {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < baseAngles.length; i++) {
      const dist = Math.abs(wrap(baseAngles[i] + groupRotY));
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  };

  // Helper: snap current rotation to nearest model position
  const snapToNearest = () => {
    if (!groupRef.current) return;
    const y = groupRef.current.rotation.y;

    let bestTarget = null;
    let bestDist = Infinity;

    for (let i = 0; i < baseAngles.length; i++) {
      const targetBase = -baseAngles[i]; // angle to bring model i to front
      const candidate = nearestEquivalentAngle(y, targetBase);
      const dist = Math.abs(wrap(candidate - y));
      if (dist < bestDist) {
        bestDist = dist;
        bestTarget = candidate;
      }
    }

    if (bestTarget !== null) {
      targetAngleRef.current = bestTarget;
    }
  };

  // Autoplay: every N ms, snap to the NEXT model (no continuous drift)
  useEffect(() => {
    const id = setInterval(() => {
      const now = performance.now();
      if (now - lastInteractAtRef.current < pauseAfterInteractMs) return;
      if (!groupRef.current || draggingRef.current || models.length === 0)
        return;

      const y = groupRef.current.rotation.y;
      const front = detectFrontIndex(y);
      const nextIndex = (front + 1) % models.length;

      const targetBase = -baseAngles[nextIndex];
      const target = nearestEquivalentAngle(y, targetBase);
      targetAngleRef.current = target;
    }, autoAdvanceInterval);

    return () => clearInterval(id);
  }, [autoAdvanceInterval, baseAngles, models.length, pauseAfterInteractMs]);

  // Pointer controls: free drag; on release → snap to nearest
  useEffect(() => {
    const onDown = (e) => {
      draggingRef.current = true;
      lastXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
      lastInteractAtRef.current = performance.now();
      targetAngleRef.current = null; // cancel any ongoing snap while dragging
    };

    const onMove = (e) => {
      if (!draggingRef.current || !groupRef.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = x - lastXRef.current;
      lastXRef.current = x;
      groupRef.current.rotation.y += deltaX * 0.005; // free spin, no limits
    };

    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      lastInteractAtRef.current = performance.now();
      // ✅ Snap to nearest after manual interaction ends
      snapToNearest();
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
  }, [baseAngles]);

  // Optional: wheel (scroll) rotates and then snaps after a short debounce
  useEffect(() => {
    const onWheel = (e) => {
      if (!groupRef.current) return;
      // Rotate proportionally to wheel delta
      groupRef.current.rotation.y += e.deltaY * 0.002;
      lastInteractAtRef.current = performance.now();
      targetAngleRef.current = null; // cancel any ongoing snap while user scrolls

      // Debounce → snap shortly after scrolling stops
      if (wheelSnapTimerRef.current) clearTimeout(wheelSnapTimerRef.current);
      wheelSnapTimerRef.current = setTimeout(() => {
        snapToNearest();
      }, 180);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (wheelSnapTimerRef.current) clearTimeout(wheelSnapTimerRef.current);
    };
  }, []);

  // Animate snapping & update "front" text
  useFrame((_, dt) => {
    if (!groupRef.current) return;

    // If we have a snap target (auto or manual), damp toward it
    if (typeof targetAngleRef.current === 'number') {
      const y = groupRef.current.rotation.y;
      const target = targetAngleRef.current;
      groupRef.current.rotation.y = damp(y, target, snapDuration, dt);

      // close enough — finish snap
      if (Math.abs(wrap(groupRef.current.rotation.y - target)) < 0.001) {
        groupRef.current.rotation.y = target;
        targetAngleRef.current = null;
      }
    }

    // Update which model is front (affects overlay text)
    const idx = detectFrontIndex(groupRef.current.rotation.y);
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
      onFrontChange(idx);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 6]} intensity={0.95} castShadow />
      <Environment files='/final.hdr' />

      <group ref={groupRef}>
        {models.map((m, i) => (
          <ThreeModel
            key={i}
            modelPath={m.path}
            baseAngle={baseAngles[i]}
            radius={radius}
            bounceAmplitude={bounceAmplitude}
            bounceSpeed={bounceSpeed}
            phaseOffset={i * 1.33}
          />
        ))}
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
