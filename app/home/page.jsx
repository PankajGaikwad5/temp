'use client';

import ModelCarouselScene from '@/components/ModelCarouselScene';
import OverlayInfo from '@/components/OverlayInfo';
import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import Image from 'next/image';
import { Poppins, Montserrat } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600'] });

export default function HomePage() {
  const models = useMemo(
    () => [
      {
        name: 'Bracelets',
        subtitle: 'Elegance on your wrist',
        description:
          'Crafted with precision and passion, our bracelets are timeless pieces that define your elegance.',
        path: '/bracelet.glb',
      },
      {
        name: 'Rings',
        subtitle: 'A circle of sophistication',
        description:
          'From subtle bands to bold statements, our rings celebrate every story and style.',
        path: '/ring.glb',
      },
      {
        name: 'Pendants',
        subtitle: 'Where detail meets desire',
        description:
          'Pendants that speak your soul—delicate, unique, and perfectly you.',
        path: '/pendant.glb',
      },
    ],
    []
  );

  const [frontIndex, setFrontIndex] = useState(0);

  return (
    <main className='relative min-h-screen w-full bg-gradient-to-b from-[#f7f5f2] to-[#e9e6e0] overflow-hidden text-gray-900'>
      {/* Header */}
      <header className='fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-lg border-b border-white/30 px-8 py-5 flex items-center justify-between'>
        <div className='flex items-center gap-5'>
          <Image src='/logo4.png' alt='The Vault Logo' width={70} height={70} />
          <h1
            className={`${poppins.className} text-2xl font-bold tracking-wide text-[#5a4631]`}
          >
            The Vault{' '}
            <span className='font-light text-gray-700'>by Karan Desai</span>
          </h1>
        </div>
        <nav
          className={`${montserrat.className} hidden md:flex gap-12 text-sm text-gray-600 tracking-wide`}
        >
          <a href='#bracelets' className='hover:text-[#5a4631] transition'>
            Bracelets
          </a>
          <a href='#rings' className='hover:text-[#5a4631] transition'>
            Rings
          </a>
          <a href='#pendants' className='hover:text-[#5a4631] transition'>
            Pendants
          </a>
        </nav>
      </header>
      <div className='h-[88px]' /> {/* header spacer */}
      {/* Fullscreen 3D Carousel */}
      <section className='relative w-full h-[calc(100vh-88px)] '>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <ModelCarouselScene
            models={models}
            onFrontChange={setFrontIndex}
            autoAdvanceInterval={5000}
            bounceAmplitude={0.15}
            bounceSpeed={1.3}
            radius={5}
          />
        </Canvas>

        {/* Overlay Info - bottom-left, subtle but readable */}
        <div className='absolute bottom-10 left-10 bg-white/90 backdrop-blur-md rounded-lg px-8 py-6 max-w-lg shadow-lg'>
          <h2
            className={`${montserrat.className} text-3xl font-semibold text-[#5a4631] mb-1`}
          >
            {models[frontIndex].name}
          </h2>
          <h3
            className={`${poppins.className} text-md font-medium text-[#7c6a4b] mb-4`}
          >
            {models[frontIndex].subtitle}
          </h3>
          <p className={`${poppins.className} text-sm text-gray-700`}>
            {models[frontIndex].description}
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className='py-8 text-center absolute bottom-0 left-0 flex justify-center items-center w-full text-gray-600 text-sm select-none'>
        &copy; {new Date().getFullYear()} The Vault by Karan Desai. All rights
        reserved.
      </footer>
    </main>
  );
}
