'use client';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
  OrbitControls,
} from '@react-three/drei';
// import BraceletModel from './BraceletModel';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BraceletScene from '../../components/three/BraceletScene';
import ScrollSection from '../../components/ScrollSection';
import Image from 'next/image';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function BraceletModel({
  modelPath = '/pendant.glb', // path to your .glb file
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

  // useFrame((_, delta) => {
  //   if (groupRef.current) {
  //     // Floating animation
  //     floatOffset.current += delta * 2;
  //     groupRef.current.position.y =
  //       position[1] + Math.sin(floatOffset.current) * 0.2;

  //     // Subtle rotation animation
  //     groupRef.current.rotation.y += delta * 0.1;
  //   }
  // });

  return <group ref={groupRef} position={position} scale={0.8} />;
}

export default function Page() {
  return (
    <div className='min-h-screen h-screen w-full bg-[#eeeeee] relative'>
      <div className={`w-full h-full `}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <PerspectiveCamera
            makeDefault
            position={[0, 0, 8]}
            fov={45}
            near={0.1}
            far={1000}
          />

          {/* Lighting setup */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Environment for reflections */}
          <Environment files={'./final.hdr'} />
          {/* <Environment files={'./studio_small_05_4k.hdr'} /> */}
          {/* <Environment files={'./startup.hdr'} /> */}
          <OrbitControls />

          {/* The bracelet model */}
          <BraceletModel />

          {/* Ground shadow */}
          <ContactShadows
            position={[0, -3, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
        </Canvas>
      </div>
    </div>
  );
}
