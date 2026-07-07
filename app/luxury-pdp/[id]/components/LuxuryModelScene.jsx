'use client';
import { useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function ZoomSync({ scale }) {
  const camera = useThree((s) => s.camera);
  const { invalidate } = useThree();
  const targetDist = useRef(5.5 / scale);

  useEffect(() => {
    targetDist.current = 5.5 / scale;
    invalidate();
  }, [scale, invalidate]);

  useFrame(() => {
    const cur = camera.position.length();
    const diff = targetDist.current - cur;
    if (Math.abs(diff) > 0.001) {
      camera.position.setLength(cur + diff * 0.07);
      invalidate(); // keep requesting frames until lerp settles
    }
  });

  return null;
}

function JewelModel({ modelPath, color }) {
  const { scene } = useGLTF(modelPath);
  const prevColor = useRef(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    clone.scale.setScalar(3.6 / size);
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone(); // own copy for color tinting
        child.material.metalness = Math.min(1, (child.material.metalness ?? 0.8) + 0.15);
        child.material.roughness = Math.max(0.05, (child.material.roughness ?? 0.3) - 0.1);
        child.castShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    return () => {
      model.traverse((child) => {
        if (!child.isMesh) return;
        // Only dispose cloned materials — geometries are shared refs from the
        // useGLTF cache and must not be disposed here.
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => m?.dispose());
      });
    };
  }, [model]);

  useEffect(() => {
    if (!color || color === prevColor.current) return;
    prevColor.current = color;
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color);
        // color goes through uniforms — needsUpdate would force a shader recompile
      }
    });
  }, [model, color]);

  return <primitive object={model} />;
}

export default function LuxuryModelScene({ modelPath, color, zoom = 1 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows
      frameloop="demand"
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }}
    >
      <color attach="background" args={['#F5F2ED']} />

      <ambientLight intensity={1.2} color="#fff8f0" />
      <directionalLight position={[6, 10, 6]}  intensity={2.0} color="#fff0dc" castShadow />
      <directionalLight position={[-5, 3, -4]} intensity={0.4} color="#dce8ff" />
      <pointLight       position={[0, -4, 5]}  intensity={0.3} color="#ffd080" />

      <Environment files="/final.hdr" />
      <ZoomSync scale={zoom} />

      <Suspense fallback={null}>
        <JewelModel modelPath={modelPath} color={color} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3} maxDistance={14}
        autoRotate autoRotateSpeed={0.5}
        dampingFactor={0.07} enableDamping
        minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI / 1.8}
        makeDefault
      />
    </Canvas>
  );
}

useGLTF.preload('/optimized/bracelet.glb');
