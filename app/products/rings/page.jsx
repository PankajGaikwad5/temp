'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';

import { Inter, Cormorant_Garamond } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const category = {
  name: 'Rings',
  description: 'Discover timeless elegance crafted by master artisans.',
};

const products = [
  {
    id: '2',
    title: 'ring 1',
    model: '/rings/optimized1.glb',
    group: 'rings',
    img: [
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
    ],
  },
  {
    id: '3',
    title: 'ring 2',
    model: '/rings/optimized2.glb',
    group: 'rings',
    img: [
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
    ],
  },
  {
    id: '4',
    title: 'ring 3',
    model: '/rings/optimized3.glb',
    group: 'rings',
    img: [
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
    ],
  },
  {
    id: '5',
    title: 'ring 4',
    model: '/rings/optimized4.glb',
    group: 'rings',
    img: [
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
    ],
  },
  {
    id: '6',
    title: 'ring 5',
    model: '/rings/optimized5.glb',
    group: 'rings',
    img: [
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
      {
        url: '/bg.png',
      },
      {
        url: '/ringbg.png',
      },
    ],
  },
];

export default function CategoryPage() {
  const [activeProduct, setActiveProduct] = useState(products[0]);

  return (
    <main className='min-h-screen w-full bg-[#fdfcf9] relative'>
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section
        className='relative w-full h-screen flex items-center justify-center bg-fixed bg-center bg-cover'
        style={{ backgroundImage: "url('../ringbg.png')" }}
      >
        {/* Glassmorphism Overlay */}
        <div className='absolute inset-0 bg-black/10 backdrop-blur-sm border border-white/20 shadow-inner' />

        {/* Content */}
        <div className='relative z-10 text-center max-w-3xl px-6'>
          <h1
            className={`${cormorant.className} text-6xl md:text-7xl font-bold tracking-[0.08em] bg-gradient-to-r from-[#c5ab57] via-[#bebebd] to-[#c9a636] bg-clip-text text-transparent animate-shimmer`}
          >
            {category.name}
          </h1>
          <div className='mt-2 h-[3px] w-28 mx-auto bg-gradient-to-r from-[#d4af37] to-[#c5a572] rounded-full' />
          <p
            className={`${inter.className} mt-8 text-lg md:text-xl text-gray-300 leading-relaxed`}
          >
            {category.description}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className='py-24 px-10'>
        <h2
          className={`${cormorant.className} text-4xl font-semibold text-center text-[#2a1d12] mb-16`}
        >
          Our Exclusive Collection
        </h2>

        <div className='max-w-7xl 2xl:max-w-none mx-auto px-6'>
          <div
            className='grid gap-5 justify-center'
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className='relative bg-white rounded-3xl shadow-md hover:shadow-xl 
                   transition-all cursor-pointer overflow-hidden border border-[#f2ebe2]
                   group'
                onClick={() => setActiveProduct(product)}
              >
                {/* 3D Model */}
                <div className='w-full aspect-square bg-gradient-to-b from-[#faf7f2] to-[#f1ede6] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300'>
                  <Canvas
                    camera={{ position: [0, 0, 4], fov: 35 }}
                    className='w-full h-full'
                  >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <OrbitControls enableRotate />
                    <Environment files='../final.hdr' />
                    <ModelRenderer modelPath={product.model} />
                  </Canvas>
                </div>

                {/* Product Info */}
                <div className='p-6 text-center'>
                  <h3
                    className={`${cormorant.className} text-xl capitalize font-semibold text-[#2a1d12]`}
                  >
                    {product.title}
                  </h3>
                  <p
                    className={`${inter.className} mt-2 text-sm text-gray-500`}
                  >
                    A timeless piece of ellegance
                  </p>
                  <a href={`/productdetail/${product.id}`}>
                    <button
                      className='mt-5 px-6 py-2 border border-[#d4af37] text-[#2a1d12] rounded-full text-sm font-medium 
                    hover:bg-[#d4af37] hover:text-white transition-all'
                    >
                      View Product
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-10 text-center text-sm text-gray-500 border-t border-[#eee] bg-[#fdfcf9]'>
        <p>
          &copy; {new Date().getFullYear()} The Vault by Karan Desai. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}

// Model Renderer
function ModelRenderer({ modelPath }) {
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

useGLTF.preload('/bracelet2.glb');
useGLTF.preload('/ring.glb');
useGLTF.preload('/pendant2.glb');
