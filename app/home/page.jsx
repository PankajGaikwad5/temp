'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import ModelCarouselScene from '@/components/ModelCarouselScene';
import FloatingAstronauts from '../../components/FloatingModel';
import Image from 'next/image';
import { Poppins, Montserrat } from 'next/font/google';
import { Canvas } from '@react-three/fiber';

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
        link: '/products/bracelets',
      },
      {
        name: 'Rings',
        subtitle: 'A circle of sophistication',
        description:
          'From subtle bands to bold statements, our rings celebrate every story and style.',
        path: '/ring.glb',
        link: '/products/rings',
      },
      {
        name: 'Pendants',
        subtitle: 'Where detail meets desire',
        description:
          'Pendants that speak your soul—delicate, unique, and perfectly you.',
        path: '/pendant.glb',
        link: '/products/pendants',
      },
    ],
    []
  );

  // selectedIndex is the single source of truth for which model is front
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lastInteractionRef = useRef(Date.now());

  // Autoplay config
  const AUTO_PLAY_DELAY = 3000; // ms after last interaction before autoplay resumes
  const AUTO_PLAY_INTERVAL = 5000; // ms between auto advances

  // Autoplay: parent drives selectedIndex
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      if (now - lastInteractionRef.current < AUTO_PLAY_DELAY) return;
      setSelectedIndex((s) => (s + 1) % models.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(id);
  }, [models.length]);

  // Called by ModelCarouselScene when user drags & snaps (keeps parent synced)
  const handleFrontChange = (idx) => {
    // update parent selection and record interaction to pause autoplay briefly
    lastInteractionRef.current = Date.now();
    setSelectedIndex(idx);
  };

  // Controls click handlers (Prev / Next / Dots)
  const goPrev = () => {
    lastInteractionRef.current = Date.now();
    setSelectedIndex((s) => (s - 1 + models.length) % models.length);
  };
  const goNext = () => {
    lastInteractionRef.current = Date.now();
    setSelectedIndex((s) => (s + 1) % models.length);
  };
  const goTo = (i) => {
    lastInteractionRef.current = Date.now();
    setSelectedIndex(i);
  };

  return (
    <main className='relative min-h-screen w-full bg-[#eeeeee] overflow-hidden text-gray-900'>
      {/* Header */}
      <header className='fixed top-4 left-0 w-full z-50 bg-transparent px-8 py-5 flex justify-between'>
        <div className='flex opacity-0 items-center gap-4'>
          <Image src='/logo4.png' alt='logo' width={64} height={64} />
          <div>
            <h1
              className={`${poppins.className} text-xl font-bold text-[#5a4631]`}
            >
              The Vault
            </h1>
            <div className='text-xs text-gray-600'>by Karan Desai</div>
          </div>
        </div>

        <Image src='./logo4.png' width={400} height={400} alt='big logo' />

        <nav
          className={`${montserrat.className} hidden md:flex gap-10 text-sm text-gray-600`}
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
      <div className='' /> {/* header spacer */}
      {/* 3D Canvas */}
      <section className='relative w-full h-screen '>
        {/* <ModelCarouselScene
          models={models}
          onFrontChange={handleFrontChange}
          selectedIndex={selectedIndex}
          autoAdvanceInterval={5000}
          bounceAmplitude={0.15}
          bounceSpeed={1.3}
          radius={5}
        />
        <Canvas className='w-full h-screen'>
          <FloatingAstronauts
            astronautModelPath='yoda.glb'
            count={100}
            scale={0.06}
          />
        </Canvas> */}
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          {' '}
          <ModelCarouselScene
            models={models}
            onFrontChange={handleFrontChange}
            selectedIndex={selectedIndex}
            autoAdvanceInterval={5000}
            bounceAmplitude={0.15}
            bounceSpeed={1.3}
            radius={5}
          />{' '}
          <FloatingAstronauts
            astronautModelPath='yoda.glb'
            count={100}
            scale={0.06}
          />{' '}
        </Canvas>
        {/* Optional floating models/atmosphere inside Canvas are handled in ModelCarouselScene */}
        {/* Info card (bottom-left) */}
        <div className='absolute bottom-10 left-10 z-50'>
          <div className='bg-white/95 backdrop-blur-sm rounded-3xl px-8 py-6 max-w-lg shadow-lg transform transition hover:-translate-y-1'>
            <h2
              className={`${montserrat.className} text-3xl font-semibold text-[#5a4631] mb-1`}
            >
              {models[selectedIndex].name}
            </h2>
            <h3
              className={`${poppins.className} text-md font-medium text-[#7c6a4b] mb-4`}
            >
              {models[selectedIndex].subtitle}
            </h3>
            <p className={`${poppins.className} text-sm text-gray-700`}>
              {models[selectedIndex].description}
            </p>
          </div>
        </div>

        {/* Controls (bottom-right) */}
        <div className='absolute right-10 bottom-10 z-50 flex flex-col items-end gap-3'>
          <div className='bg-white/95 rounded-2xl p-3 shadow-lg flex items-center gap-3'>
            <button
              aria-label='previous'
              onClick={goPrev}
              className='p-2 rounded-full hover:bg-gray-100 transition'
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#5a4631'
                strokeWidth='2'
              >
                <path
                  d='M15 18l-6-6 6-6'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>

            <div className='flex items-center gap-2'>
              {models.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-3 h-3 rounded-full transition-transform ${
                    i === selectedIndex
                      ? 'transform scale-110 bg-[#5a4631]'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`show ${i}`}
                />
              ))}
            </div>

            <button
              aria-label='next'
              onClick={goNext}
              className='p-2 rounded-full hover:bg-gray-100 transition'
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#5a4631'
                strokeWidth='2'
              >
                <path
                  d='M9 6l6 6-6 6'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>

          <a
            href={models[selectedIndex].link}
            className='bg-[#5a4631] text-white rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:opacity-95 transition'
          >
            Shop {models[selectedIndex].name}
          </a>
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
