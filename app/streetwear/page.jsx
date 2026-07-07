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
    <div className={`streetwear-shop ${spaceGrotesk.variable} ${montserrat.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .streetwear-shop {
          --noir: #0a0a0b;
          --coal: #121214;
          --gold: #c9a64e;
          --gold-soft: #e7cf8f;
          --ash: #888890;
          --border: rgba(255, 255, 255, 0.05);
          background: radial-gradient(circle at center, #121214 0%, #080809 100%);
          color: #ffffff;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          font-family: var(--font-space-grotesk), sans-serif;
          position: relative;
        }

        /* Top Header Navbar */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 40px 6vw;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
        }

        .logo-group {
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }

        .brand-name {
          font-family: var(--font-montserrat), sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #ffffff;
          line-height: 1.2;
        }

        .brand-sub {
          font-size: 9px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .nav-links {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .nav-link {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ash);
          text-decoration: none;
          transition: color 0.3s;
        }

        .nav-link:hover, .nav-link.active {
          color: #ffffff;
        }

        /* 3D WebGL Canvas container */
        .interactive-stage {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        /* UI Content overlay */
        .content-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          display: flex;
          align-items: center;
          padding: 0 6vw;
        }

        /* Minimalist Specs Column */
        .product-details {
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          max-width: 340px;
        }

        .product-category {
          font-size: 10px;
          letter-spacing: 0.25em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .product-name {
          font-size: 38px;
          font-weight: 500;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 16px;
          color: #ffffff;
        }

        .product-description {
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--ash);
          margin-bottom: 24px;
        }

        .product-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #ffffff;
          margin-bottom: 30px;
        }

        .product-meta .price {
          font-weight: 700;
        }

        .product-meta .divider {
          color: rgba(255, 255, 255, 0.15);
        }

        .product-meta .spec {
          color: var(--ash);
        }

        .bag-btn {
          align-self: flex-start;
          background: #ffffff;
          color: #000000;
          border: none;
          padding: 14px 28px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s, color 0.3s;
        }

        .bag-btn:hover {
          background: var(--gold);
          color: #000000;
        }

        /* Horizontal floating dock platform wrapper */
        .bottom-dock-wrapper {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          pointer-events: auto;
          display: flex;
          justify-content: center;
          width: auto;
        }

        /* Glassmorphic platform dock */
        .bottom-dock {
          background: rgba(15, 15, 17, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 24px;
          padding: 12px 24px;
          display: flex;
          gap: 16px;
          align-items: flex-end;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }

        .dock-item {
          width: 85px;
          height: 85px;
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dock-item::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 50%;
          height: 3px;
          background: var(--gold);
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .dock-item.active {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(201, 166, 78, 0.3);
          transform: scale(1.05);
        }

        .dock-item.active::before {
          opacity: 1;
        }

        .dock-img-container {
          width: 100%;
          height: 100%;
          padding: 10px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dock-item:hover .dock-img-container {
          transform: translateY(-8px) scale(1.08);
        }

        .dock-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
        }

        /* Mobile layout styling */
        @media (max-width: 820px) {
          .navbar {
            padding: 30px 6vw;
          }
          .content-overlay {
            justify-content: flex-start;
            align-items: flex-start;
            padding: 12vh 6vw;
          }
          .product-details {
            max-width: none;
            width: 100%;
          }
          .product-name {
            font-size: 30px;
          }
          .bottom-dock-wrapper {
            bottom: 30px;
            width: 90vw;
          }
          .bottom-dock {
            padding: 8px 12px;
            gap: 8px;
            width: 100%;
            overflow-x: auto;
            justify-content: space-between;
          }
          .dock-item {
            width: 65px;
            height: 65px;
            flex-shrink: 0;
          }
        }
      ` }} />

      {/* Top Header Navbar */}
      <header className="navbar">
        <Link href="/" className="logo-group">
          <span className="brand-name">THE VAULT</span>
          <span className="brand-sub">by karan desai</span>
        </Link>
        <nav className="nav-links">
          <Link href="/" className="nav-link">SPLIT VIEW</Link>
          <Link href="/home" className="nav-link">STATEMENT</Link>
          <Link href="/streetwear" className="nav-link active">STREETWEAR</Link>
        </nav>
      </header>

      {/* 3D WebGL Scene */}
      <div className="interactive-stage">
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
      <div className="content-overlay">
        <div className="product-details" ref={textGroupRef}>
          <span className="product-category">{activeProduct.tag}</span>
          <h2 className="product-name">{activeProduct.title}</h2>
          <p className="product-description">{activeProduct.desc}</p>
          
          <div className="product-meta">
            <span className="price">{activeProduct.price}</span>
            <span className="divider">—</span>
            <span className="spec">{activeProduct.karat} ({activeProduct.weight})</span>
          </div>

          <button className="bag-btn" onClick={() => alert(`${activeProduct.title} added to bag.`)}>
            Add to Bag
          </button>
        </div>
      </div>

      {/* Bottom Floating Glass Dock Platform (Visual thumbnail row) */}
      <div className="bottom-dock-wrapper">
        <div className="bottom-dock">
          {products.map((p, idx) => (
            <div
              className={`dock-item ${idx === activeIndex ? 'active' : ''}`}
              key={p.id}
              onClick={() => setActiveIndex(idx)}
            >
              <div className="dock-img-container">
                <img src={p.image} className="dock-img" alt={p.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
