'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

import { Inter, Cormorant_Garamond } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Buttons from '@/components/Buttons';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const category = {
  name: 'Pendants',
  description: 'Discover timeless elegance crafted by master artisans.',
};

const products = [
  {
    id: '7',
    title: 'pendant 1',
    model: '/newpendants/optimized1.glb',
    thumbnail: '/pngs/p1.png',
    group: 'pendants',
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
    id: '8',
    title: 'pendant 2',
    model: '/newpendants/optimized2.glb',
    thumbnail: '/pngs/p2.png',
    group: 'pendants',
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
    id: '9',
    title: 'pendant 3',
    model: '/newpendants/optimized3.glb',
    thumbnail: '/pngs/p3.png',
    group: 'pendants',
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
    id: '10',
    title: 'pendant 4',
    model: '/newpendants/optimized4.glb',
    thumbnail: '/pngs/p4.png',
    group: 'pendants',
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
    id: '11',
    title: 'pendant 5',
    model: '/newpendants/optimized5.glb',
    thumbnail: '/pngs/p5.png',
    group: 'pendants',
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
    id: '12',
    title: 'pendant 6',
    model: '/newpendants/optimized6.glb',
    thumbnail: '/pngs/p6.png',
    group: 'pendants',
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
    id: '13',
    title: 'pendant 7',
    model: '/newpendants/optimized7.glb',
    thumbnail: '/pngs/p7.png',
    group: 'pendants',
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
    id: '14',
    title: 'pendant 8',
    model: '/newpendants/optimized8.glb',
    thumbnail: '/pngs/p8.png',
    group: 'pendants',
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
  const [isMobile, setIsMobile] = useState(false);

  const bgImg = useRef(null);
  const heroText = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      bgImg.current,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power3.out', delay: 1 }
    );
    gsap.fromTo(
      heroText.current,
      { y: 200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: 'power3.out',
        delay: 1.5,
        stagger: 1,
      }
    );
    //  gsap.fromTo(
    //    navRef.current,
    //    { y: -200, opacity: 0 },
    //    { y: 0, opacity: 1, duration: 2, ease: 'power3.out', delay: 1.5 }
    //  );
  }, []);

  // detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className='min-h-screen w-full bg-[#fdfcf9] relative'>
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section
        className='relative w-full h-screen flex items-center justify-center bg-fixed bg-center bg-cover object-cover'
        // style={{ backgroundImage: "url('/pendantbg.webp')" }}
      >
        <img
          src='/pendantbg.webp'
          className='w-full h-full fixed bg-fixed bg-cover object-cover left-0 top-0 '
          alt=''
        />
        {/* Glassmorphism Overlay */}
        <div
          className='absolute inset-0 bg-black/10 backdrop-blur-sm border border-white/20 shadow-inner'
          ref={bgImg}
        />

        {/* Content */}
        <div
          className='relative z-10 text-center max-w-3xl px-6'
          ref={heroText}
        >
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
      <section className='py-24 px-10 bg-[#fdfcf9] relative'>
        <h2
          className={`${cormorant.className} text-4xl font-semibold text-center text-[#2a1d12] mb-16`}
        >
          Our Exclusive Collection
        </h2>

        <div className='max-w-7xl  mx-auto px-6'>
          <div
            className='grid gap-5 justify-center'
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className='relative bg-white rounded-3xl shadow-md hover:shadow-xl 
                   transition-all cursor-pointer overflow-hidden border border-[#f2ebe2]
                   group'
                onClick={() => setActiveProduct(product)}
              >
                {/* 3D Model */}
                <div className='w-full aspect-square bg-gradient-to-b from-[#faf7f2] to-[#f1ede6] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300'>
                  {isMobile ? (
                    // Auto thumbnail (using product.model name as fallback src)
                    <Image
                      src={`${product.thumbnail}`}
                      alt={product.title}
                      width={400}
                      height={400}
                      className='object-contain'
                    />
                  ) : (
                    <Canvas
                      frameloop='demand'
                      camera={{ position: [0, 0, 4], fov: 90 }}
                      className='w-full h-full select-none'
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[10, 10, 5]} intensity={1} />
                      <OrbitControls
                        enableRotate
                        maxDistance={6}
                        minDistance={3}
                        zoomSpeed={2}
                      />
                      <Environment files='../final.hdr' />
                      <ModelRenderer modelPath={product.model} />
                    </Canvas>
                  )}
                </div>

                {/* Product Info */}
                <div className='px-4 py-2 flex flex-col '>
                  <a href={`/productdetail/${product.id}`}>
                    <h3
                      className={`${cormorant.className} text-2xl font-bold text-[#2a1d12] capitalize`}
                    >
                      {product.title}
                    </h3>
                    <p
                      className={`${inter.className}  md:text-lg text-sm text-gray-500`}
                    >
                      Crafted with elegance and precision.
                    </p>
                    {/* <Buttons product={product} index={index} /> */}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=' relative py-10 text-center text-sm text-gray-500 border-t border-[#eee] bg-[#fdfcf9]'>
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
  model.scale.set(1, 1, 1);

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

// useGLTF.preload('/bracelet2.glb');
// useGLTF.preload('/ring.glb');
// useGLTF.preload('/pendant2.glb');
