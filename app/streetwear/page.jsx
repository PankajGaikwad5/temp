'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  PerspectiveCamera,
  ContactShadows,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import Link from 'next/link';
import { Space_Grotesk, Montserrat } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
});

// ----------------------------------------------------
// 3D Model Renderer with size normalization & gold adjustments
// ----------------------------------------------------
function ModelRenderer({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          // Deep metallic reflection for high-fashion gold jewelry
          child.material.metalness = 1.0;
          child.material.roughness = 0.15;
          child.material.envMapIntensity = 1.5;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [model]);

  // Center model and compute normalization scale factor
  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    return 2.4 / size; // Scale factor matching visual spacing
  }, [model]);

  return <primitive object={model} scale={scale} />;
}

// ----------------------------------------------------
// Active model rotating wrapper (large center)
// ----------------------------------------------------
function ActiveModelWrapper({ modelPath }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.12;
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.08;
    }
  });

  return (
    <group ref={ref}>
      <ModelRenderer modelPath={modelPath} />
    </group>
  );
}

// ----------------------------------------------------
// Main Streetwear Component
// ----------------------------------------------------
export default function StreetwearPage() {
  const products = [
    {
      id: 'p3',
      title: 'Heavy Link Chain',
      price: '$1,450',
      tag: 'STYLE // CH-3',
      modelPath: '/newpendants/optimized3.glb',
      image: '/pngs/p3.png',
      desc: 'Brutalist link structure holding a solid gold struck medallion. Designed for heavy daily layers.',
      karat: '18K Yellow Gold',
      weight: '42g',
    },
    {
      id: 'r4',
      title: 'Industrial Band',
      price: '$920',
      tag: 'STYLE // R-4',
      modelPath: '/rings/optimized4.glb',
      image: '/pngs/r4.png',
      desc: 'Thick-walled industrial gold band featuring modular grooved lines. Matte raw finish.',
      karat: '18K Matte Gold',
      weight: '18g',
    },
    {
      id: 'b1',
      title: 'Vault Classic Cuff',
      price: '$2,100',
      tag: 'STYLE // B-1',
      modelPath: '/optimized/bracelet.glb',
      image: '/pngs/b1.png',
      desc: 'Solid flat-form cuff bracelet with clean industrial angles. Minimalist premium styling.',
      karat: '14K Hardened Gold',
      weight: '55g',
    },
    {
      id: 'p5',
      title: 'Facet Medallion',
      price: '$1,680',
      tag: 'STYLE // CH-5',
      modelPath: '/newpendants/optimized5.glb',
      image: '/pngs/p5.png',
      desc: 'Precision facet-cut gold pendant catching light at every angle on high-gauge microbox links.',
      karat: '18K Solid Gold',
      weight: '34g',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const textGroupRef = useRef(null);

  // Smooth GSAP slide/fade text transition on product change
  useEffect(() => {
    if (textGroupRef.current) {
      gsap.fromTo(
        textGroupRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [activeIndex]);

  const activeProduct = products[activeIndex];

  return (
    <div className={`relative h-screen w-screen overflow-hidden text-white font-[var(--font-space-grotesk)] bg-[radial-gradient(circle_at_center,#121214_0%,#080809_100%)] ${spaceGrotesk.variable} ${montserrat.variable}`}>
      {/* Top Header Navbar */}
      <header className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-[6vw] py-[40px] max-[820px]:py-[30px]">
        <Link href="/" className="flex flex-col no-underline">
          <span className="font-[var(--font-montserrat)] font-bold text-[15px] tracking-[0.28em] uppercase text-white leading-[1.2]">THE VAULT</span>
          <span className="text-[9px] tracking-[0.4em] uppercase text-[#c9a64e]">by karan desai</span>
        </Link>
        <nav className="flex gap-[30px] items-center">
          <Link href="/" className="text-[10px] tracking-[0.2em] uppercase text-[#888890] no-underline transition-colors duration-300 hover:text-white">SPLIT VIEW</Link>
          <Link href="/home" className="text-[10px] tracking-[0.2em] uppercase text-[#888890] no-underline transition-colors duration-300 hover:text-white">STATEMENT</Link>
          <Link href="/streetwear" className="text-[10px] tracking-[0.2em] uppercase text-white no-underline transition-colors duration-300 hover:text-white">STREETWEAR</Link>
        </nav>
      </header>

      {/* 3D WebGL Scene */}
      <div className="absolute inset-0 z-[1]">
        <Canvas shadows gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
          
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow />
          <directionalLight position={[-5, 4, -5]} intensity={0.4} />
          
          <Environment files="/final.hdr" />
          
          <OrbitControls 
            enableDamping={true}
            enableZoom={true}
            maxDistance={8}
            minDistance={3.5}
            enablePan={false}
          />
          
          {/* Active product model floating naturally in dark void */}
          <ActiveModelWrapper modelPath={activeProduct.modelPath} />

          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.35}
            scale={6}
            blur={2.4}
            far={4}
          />
        </Canvas>
      </div>

      {/* UI Details Column (Floating Transparent overlay) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center px-[6vw] max-[820px]:justify-start max-[820px]:items-start max-[820px]:pt-[12vh]">
        <div className="pointer-events-auto flex flex-col max-w-[340px] max-[820px]:max-w-none max-[820px]:w-full" ref={textGroupRef}>
          <span className="text-[10px] tracking-[0.25em] text-[#c9a64e] uppercase mb-[8px]">{activeProduct.tag}</span>
          <h2 className="text-[38px] font-medium tracking-[-0.02em] uppercase leading-[1.1] mb-[16px] text-white max-[820px]:text-[30px]">{activeProduct.title}</h2>
          <p className="text-[13.5px] leading-[1.6] text-[#888890] mb-[24px]">{activeProduct.desc}</p>
          
          <div className="flex items-center gap-[12px] text-[12px] text-white mb-[30px]">
            <span className="font-bold">{activeProduct.price}</span>
            <span className="text-white/15">—</span>
            <span className="text-[#888890]">{activeProduct.karat} ({activeProduct.weight})</span>
          </div>

          <button className="self-start bg-white text-black border-none px-[28px] py-[14px] text-[11px] font-medium tracking-[0.2em] uppercase cursor-pointer transition-[background,color] duration-300 hover:bg-[#c9a64e] hover:text-black" onClick={() => alert(`${activeProduct.title} added to bag.`)}>
            Add to Bag
          </button>
        </div>
      </div>

      {/* Bottom Floating Glass Dock Platform (Visual thumbnail row) */}
      <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 z-[100] pointer-events-auto flex justify-center w-auto max-[820px]:bottom-[30px] max-[820px]:w-[90vw]">
        <div className="bg-[#0f0f11]/65 backdrop-blur-[20px] border border-white/[0.04] rounded-[24px] px-[24px] py-[12px] flex gap-[16px] items-end shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] max-[820px]:px-[12px] max-[820px]:py-[8px] max-[820px]:gap-[8px] max-[820px]:w-full max-[820px]:overflow-x-auto max-[820px]:justify-between">
          {products.map((p, idx) => (
            <div
              className={`group relative rounded-[16px] cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-1/2 before:h-[3px] before:bg-[#c9a64e] before:rounded-[2px] before:transition-opacity before:duration-300 max-[820px]:shrink-0 w-[85px] h-[85px] max-[820px]:w-[65px] max-[820px]:h-[65px] ${
                idx === activeIndex
                  ? 'bg-white/5 border border-[#c9a64e]/30 scale-[1.05] before:opacity-100'
                  : 'bg-white/[0.02] border border-white/[0.03] scale-100 before:opacity-0 hover:border-white/10'
              }`}
              key={p.id}
              onClick={() => setActiveIndex(idx)}
            >
              <div className="w-full h-full p-[10px] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[8px] group-hover:scale-[1.08]">
                <img src={p.image} className="w-full h-full object-contain filter-[drop-shadow(0_6px_12px_rgba(0,0,0,0.4))]" alt={p.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
