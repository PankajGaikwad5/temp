'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import ModelCarouselScene from '@/components/ModelCarouselScene';
import FloatingAstronauts from '@/components/FloatingModel';
import Image from 'next/image';
import { Poppins, Montserrat } from 'next/font/google';
import { Canvas } from '@react-three/fiber';
import Link from 'next/link';
import gsap from 'gsap';

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
        path: '/optimized/bracelet.glb',
        link: '/productdetail/1',
      },
      {
        name: 'Rings',
        subtitle: 'A circle of sophistication',
        description:
          'From subtle bands to bold statements, our rings celebrate every story and style.',
        path: '/optimized/ring.glb',
        link: '/products/rings',
      },
      {
        name: 'Pendants',
        subtitle: 'Where detail meets desire',
        description:
          'Pendants that speak your soul—delicate, unique, and perfectly you.',
        path: '/op.glb',
        link: '/products/pendants',
      },
    ],
    []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lastInteractionRef = useRef(Date.now());
  const infoRef = useRef(null);
  const controlRef = useRef(null);
  const navRef = useRef(null);

  const AUTO_PLAY_DELAY = 3000;
  const AUTO_PLAY_INTERVAL = 5000;

  useEffect(() => {
    gsap.fromTo(
      infoRef.current,
      { x: -200, opacity: 0 },
      { x: 0, opacity: 1, duration: 2, ease: 'power3.out', delay: 1 }
    );
    gsap.fromTo(
      controlRef.current,
      { y: 200, opacity: 0 },
      { y: 0, opacity: 1, duration: 2, ease: 'power3.out', delay: 1.5 }
    );
    gsap.fromTo(
      navRef.current,
      { y: -200, opacity: 0 },
      { y: 0, opacity: 1, duration: 2, ease: 'power3.out', delay: 1.5 }
    );

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      if (now - lastInteractionRef.current < AUTO_PLAY_DELAY) return;
      setSelectedIndex((s) => (s + 1) % models.length);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(id);
  }, [models.length]);

  const handleFrontChange = (idx) => {
    lastInteractionRef.current = Date.now();
    setSelectedIndex(idx);
  };

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
      <header
        className='fixed top-0 left-0 w-full z-50 bg-transparent px-6 sm:px-8 py-4 flex md:justify-between  items-start'
        ref={navRef}
      >
        {/* Left hidden logo text */}
        <div className='flex opacity-0 items-center gap-4 '>
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

        {/* Center big logo */}
        <Image
          src='/logo4.png'
          width={300}
          height={300}
          alt='big logo'
          className='w-[100px] sm:w-[200px] md:w-[200px] 2xl:w-[300px] h-auto lg:ml-40 mr-20 md:mr-0'
        />

        {/* Desktop nav */}
        <nav
          className={`${montserrat.className} hidden md:flex gap-5 3xl:gap-8 text-sm uppercase 3xl:text-lg text-gray-600 pt-6`}
        >
          <a
            href='/products/bracelets'
            className='hover:text-[#5a4631] transition'
          >
            Bracelets
          </a>
          <a href='/products/rings' className='hover:text-[#5a4631] transition'>
            Rings
          </a>
          <a
            href='/products/pendants'
            className='hover:text-[#5a4631] transition'
          >
            Pendants
          </a>

          <a href='/products' className='hover:text-[#5a4631] transition'>
            Collection
          </a>
          <a href='/about-us' className='hover:text-[#5a4631] transition'>
            About
          </a>
          <a href='/contact-us' className='hover:text-[#5a4631] transition'>
            Contact Us
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className='md:hidden flex flex-col gap-1.5 focus:outline-none'
        >
          <span className='block w-6 h-0.5 bg-[#5a4631]'></span>
          <span className='block w-6 h-0.5 bg-[#5a4631]'></span>
          <span className='block w-6 h-0.5 bg-[#5a4631]'></span>
        </button>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className='fixed inset-0 bg-black/40 z-50'>
            <div className='absolute top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg flex flex-col p-6'>
              <button
                onClick={() => setMobileNavOpen(false)}
                className='self-end mb-6 text-gray-600 hover:text-[#5a4631]'
              >
                ✕
              </button>
              <nav
                className={`${montserrat.className} flex flex-col gap-6 text-lg text-gray-700`}
              >
                <a
                  href='/products/bracelets'
                  onClick={() => setMobileNavOpen(false)}
                >
                  Bracelets
                </a>
                <a
                  href='/products/rings'
                  onClick={() => setMobileNavOpen(false)}
                >
                  Rings
                </a>
                <a
                  href='/products/pendants'
                  onClick={() => setMobileNavOpen(false)}
                >
                  Pendants
                </a>
                <a
                  href='/products/catalogue'
                  className='hover:text-[#5a4631] transition'
                >
                  Catalogue
                </a>
                <a href='/products' className='hover:text-[#5a4631] transition'>
                  Collection
                </a>
                <a
                  href='/products/about-us'
                  className='hover:text-[#5a4631] transition'
                >
                  About
                </a>
                <a
                  href='/products/contact-us'
                  className='hover:text-[#5a4631] transition'
                >
                  Contact Us
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* 3D Canvas */}
      <section className='relative w-full h-screen'>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ModelCarouselScene
            models={models}
            onFrontChange={handleFrontChange}
            selectedIndex={selectedIndex}
            autoAdvanceInterval={5000}
            bounceAmplitude={0.15}
            bounceSpeed={1.3}
            radius={isMobile ? 3 : 5}
            scale={isMobile ? 0.5 : 1}
          />
          <FloatingAstronauts
            astronautModelPath='optimizedyoda.glb'
            count={50}
            scale={isMobile ? 0.03 : 0.05}
            radius={isMobile ? 4 : 10}
          />
        </Canvas>

        {/* Info card */}
        <div
          className='absolute bottom-8 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-10 z-20 max-w-[90%] min-w-[90%] md:min-w-min md:max-w-lg 3xl:max-w-4xl'
          ref={infoRef}
        >
          <Link href={`${models[selectedIndex].link}`}>
            <div className='bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-5 sm:px-8 sm:py-6 3xl:py-10 shadow-xl'>
              <h2
                className={`${montserrat.className} text-xl sm:text-3xl 3xl:text-4xl font-semibold text-[#5a4631] mb-1 md:mb-2 3xl:mb-3`}
              >
                {models[selectedIndex].name}
              </h2>
              <h3
                className={`${poppins.className} text-xs sm:text-md 3xl:text-xl font-medium text-[#7c6a4b] mb-1 md:mb-3 3xl:mb-4`}
              >
                {models[selectedIndex].subtitle}
              </h3>
              <p
                className={`${poppins.className} text-xs 3xl:text-xl text-gray-700`}
              >
                {models[selectedIndex].description}
              </p>
            </div>
          </Link>
        </div>

        {/* Controls */}
        <div
          className='hidden md:flex right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-10 bottom-8 z-50 absolute flex-col items-center sm:items-end gap-4'
          ref={controlRef}
        >
          <div className='bg-white/95 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg flex items-center gap-2 sm:gap-3'>
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
                      ? 'scale-125 bg-[#5a4631]'
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
            className='bg-[#5a4631] text-white rounded-full px-5 py-2 text-sm font-medium shadow-md hover:opacity-95 transition'
          >
            Shop {models[selectedIndex].name}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className='fixed bottom-0 py-2 text-center text-xs md:text-sm text-gray-500 flex justify-center items-center w-full'>
        <p>
          &copy; {new Date().getFullYear()} The Vault by Karan Desai. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}
