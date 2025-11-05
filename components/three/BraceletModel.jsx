'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function BraceletModel({
  modelPath = '/optimized/bracelet.glb',
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  color,
  particleDelay = 1, // Delay in seconds before particles form the model
}) {
  const groupRef = useRef(null);
  const meshRef = useRef(null);
  const particlesRef = useRef(null);
  const timeRef = useRef(0);
  const animationCompleteRef = useRef(false);
  const { scene } = useGLTF(modelPath);
  const [scale, setScale] = useState(1);

  // Extract particles from model geometry
  const particleData = useMemo(() => {
    if (!scene) return null;

    const positions = [];
    const velocities = [];

    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const geometry = child.geometry;
        const positionAttr = geometry.attributes.position;

        if (positionAttr) {
          // Sample vertices from the mesh
          const stride = Math.max(1, Math.floor(positionAttr.count / 3000)); // Adjust density

          for (let i = 0; i < positionAttr.count; i += stride) {
            const vertex = new THREE.Vector3(
              positionAttr.getX(i),
              positionAttr.getY(i),
              positionAttr.getZ(i)
            );

            // Apply mesh transformations
            vertex.applyMatrix4(child.matrixWorld);

            positions.push(vertex.x, vertex.y, vertex.z);

            // Create velocity based on vertex position (radial explosion)
            const direction = vertex.clone().normalize();
            const randomFactor = 0.5 + Math.random() * 0.5;
            velocities.push(
              direction.x * randomFactor,
              direction.y * randomFactor,
              direction.z * randomFactor
            );
          }
        }
      }
    });

    const particleCount = positions.length / 3;
    const positionsArray = new Float32Array(positions);
    const originalPositions = new Float32Array(positions);
    const velocitiesArray = new Float32Array(velocities);

    return {
      positions: positionsArray,
      originalPositions: originalPositions,
      velocities: velocitiesArray,
      count: particleCount,
    };
  }, [scene]);

  // Setup model and particles
  useEffect(() => {
    if (!scene || !groupRef.current || !particleData) return;

    // Clear existing children
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }

    // Clone and setup model
    const modelClone = scene.clone();

    if (color) {
      modelClone.traverse((child) => {
        if (child.isMesh && child.material) {
          // Clone material to avoid affecting other instances
          const originalMaterial = child.material;
          child.material = originalMaterial.clone();
          child.material.color.set(color);
          child.material.needsUpdate = true;
        }
      });
    }

    // Calculate scale
    const box = new THREE.Box3().setFromObject(modelClone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 3;
    const calculatedScale = targetSize / maxDim;

    setScale(calculatedScale);

    // Start with model hidden
    modelClone.visible = false;
    meshRef.current = modelClone;
    groupRef.current.add(modelClone);

    // Create particle system from model vertices
    const particleGeometry = new THREE.BufferGeometry();

    // Initialize particles at scattered positions
    const scatteredPositions = new Float32Array(particleData.count * 3);
    for (let i = 0; i < particleData.count; i++) {
      scatteredPositions[i * 3] =
        particleData.originalPositions[i * 3] +
        particleData.velocities[i * 3] * 4;
      scatteredPositions[i * 3 + 1] =
        particleData.originalPositions[i * 3 + 1] +
        particleData.velocities[i * 3 + 1] * 4;
      scatteredPositions[i * 3 + 2] =
        particleData.originalPositions[i * 3 + 2] +
        particleData.velocities[i * 3 + 2] * 4;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(scatteredPositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: color || '#ffffff',
      size: 0.03,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    particlesRef.current = particleSystem;
    groupRef.current.add(particleSystem);

    // Reset animation state
    timeRef.current = 0;
    animationCompleteRef.current = false;

    return () => {
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [scene, color, particleData]);

  // Apply rotation
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.order = 'XYZ';
      groupRef.current.rotation.set(
        THREE.MathUtils.degToRad(rotation[0]),
        THREE.MathUtils.degToRad(rotation[1]),
        THREE.MathUtils.degToRad(rotation[2])
      );
    }
  }, [rotation]);

  // Animation frame
  useFrame((state, delta) => {
    if (!particlesRef.current || !meshRef.current || !particleData) return;
    if (animationCompleteRef.current) return; // Stop animation once complete

    timeRef.current += delta;

    const particleGeometry = particlesRef.current.geometry;
    const particleMaterial = particlesRef.current.material;
    const positionAttr = particleGeometry.attributes.position;

    // Easing function for smooth transitions
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    if (timeRef.current < particleDelay) {
      // Phase 1: Particles scattered, waiting
      particleMaterial.opacity = 1;
      meshRef.current.visible = false;
    } else if (timeRef.current < particleDelay + 1.5) {
      // Phase 2: Particles converge to form the model
      const formProgress = easeInOutCubic(
        (timeRef.current - particleDelay) / 1.5
      );

      particleMaterial.opacity = 1;
      meshRef.current.visible = false;

      // Move particles from scattered positions to original positions
      for (let i = 0; i < particleData.count; i++) {
        const scatteredX =
          particleData.originalPositions[i * 3] +
          particleData.velocities[i * 3] * 4;
        const scatteredY =
          particleData.originalPositions[i * 3 + 1] +
          particleData.velocities[i * 3 + 1] * 4;
        const scatteredZ =
          particleData.originalPositions[i * 3 + 2] +
          particleData.velocities[i * 3 + 2] * 4;

        positionAttr.array[i * 3] =
          scatteredX +
          (particleData.originalPositions[i * 3] - scatteredX) * formProgress;
        positionAttr.array[i * 3 + 1] =
          scatteredY +
          (particleData.originalPositions[i * 3 + 1] - scatteredY) *
            formProgress;
        positionAttr.array[i * 3 + 2] =
          scatteredZ +
          (particleData.originalPositions[i * 3 + 2] - scatteredZ) *
            formProgress;
      }
      positionAttr.needsUpdate = true;
    } else if (timeRef.current < particleDelay + 2) {
      // Phase 3: Particles solidify into mesh
      const solidifyProgress = easeInOutCubic(
        (timeRef.current - particleDelay - 1.5) / 0.5
      );

      // Keep particles at original positions
      for (let i = 0; i < particleData.count; i++) {
        positionAttr.array[i * 3] = particleData.originalPositions[i * 3];
        positionAttr.array[i * 3 + 1] =
          particleData.originalPositions[i * 3 + 1];
        positionAttr.array[i * 3 + 2] =
          particleData.originalPositions[i * 3 + 2];
      }
      positionAttr.needsUpdate = true;

      // Fade particles and bring in mesh
      particleMaterial.opacity = 1 - solidifyProgress;

      if (meshRef.current) {
        meshRef.current.visible = true;
        meshRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.opacity = solidifyProgress;
            child.material.transparent = solidifyProgress < 1;
          }
        });
      }
    } else {
      // Phase 4: Animation complete - show only mesh
      particleMaterial.opacity = 0;

      if (meshRef.current) {
        meshRef.current.visible = true;
        meshRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.opacity = 1;
            child.material.transparent = false;

            // 🔒 Ensure color stays fixed and prevents auto-updates
            if (color) {
              child.material.color.set(color);
            }

            // Disable color updates from scene/environment
            child.material.needsUpdate = true;
          }
        });
      }

      animationCompleteRef.current = true;
    }
  });

  return <group ref={groupRef} position={position} scale={scale} />;
}
