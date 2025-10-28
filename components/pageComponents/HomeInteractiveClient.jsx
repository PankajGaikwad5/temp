'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import ModelCarouselScene from '@/components/ModelCarouselScene';
import FloatingAstronauts from '@/components/FloatingModel';
import Image from 'next/image';
import { Poppins, Montserrat } from 'next/font/google';
import { Canvas } from '@react-three/fiber';
import Link from 'next/link';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600'] });

export default function HomeInteractiveClient() {
  const navLinks = [
    { href: '/products/bracelets', label: 'Bracelets' },
    { href: '/products/rings', label: 'Rings' },
    { href: '/products/pendants', label: 'Pendants' },
    { href: '/products', label: 'Collection' },
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/about-us', label: 'About' },
    { href: '/contact-us', label: 'Contact Us' },
  ];

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

  const goPrev = () =>
    setSelectedIndex((s) => (s - 1 + models.length) % models.length);
  const goNext = () => setSelectedIndex((s) => (s + 1) % models.length);
  const goTo = (i) => setSelectedIndex(i);

  return (
    <section className='relative w-full h-screen'>
      {/* Header */}
      <header
        className='fixed top-0 left-0 w-full z-50 bg-transparent px-6 sm:px-8 py-4 flex md:justify-between items-start'
        ref={navRef}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        {/* Logo and Nav */}
        <Image
          src='/logo4.png'
          width={300}
          height={300}
          alt='The Vault Logo'
          className='w-[100px] sm:w-[200px] md:w-[200px] 2xl:w-[300px] h-auto lg:ml-40 mr-20 md:mr-0'
        />

        {/* Desktop Nav */}
        <nav
          className={`${montserrat.className} hidden md:flex gap-5 3xl:gap-8 text-sm uppercase 3xl:text-lg text-gray-600 pt-6 z-50`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='hover:text-[#5a4631] transition'
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu */}
        <div className='md:hidden'>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className='p-2 rounded-md hover:bg-gray-100 transition'
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              key='mobile-menu'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-t border-[#eee] flex flex-col items-center gap-6 py-6 md:hidden shadow-lg'
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className='text-[#2a1d12] text-lg font-medium hover:text-[#c5a572] transition duration-300'
                  onClick={() => setMobileNavOpen(false)}
                  whileHover={{ scale: 1.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3D Canvas */}
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
          scale={isMobile ? 0.5 : 0.95}
        />
        <FloatingAstronauts
          astronautModelPath='optimizedyoda.glb'
          count={50}
          scale={isMobile ? 0.03 : 0.05}
          radius={isMobile ? 4 : 10}
        />
      </Canvas>

      {/* Info Card */}
      <div
        className='absolute bottom-36 md:bottom-8 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-10 z-20 max-w-[90%] md:max-w-lg 3xl:max-w-4xl'
        ref={infoRef}
      >
        <Link href={models[selectedIndex].link}>
          <div className='bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-5 sm:px-8 sm:py-6 shadow-xl'>
            <h2
              className={`${montserrat.className} text-xl sm:text-3xl font-semibold text-[#5a4631] mb-1`}
            >
              {models[selectedIndex].name}
            </h2>
            <h3
              className={`${poppins.className} text-xs sm:text-md font-medium text-[#7c6a4b] mb-1`}
            >
              {models[selectedIndex].subtitle}
            </h3>
            <p className={`${poppins.className} text-xs text-gray-700`}>
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
        <div className='bg-white/95 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg flex items-center gap-3'>
          <button
            onClick={goPrev}
            aria-label='previous'
            className='p-2 hover:bg-gray-100 rounded-full transition'
          >
            ‹
          </button>
          <div className='flex gap-2'>
            {models.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-3 h-3 rounded-full ${
                  i === selectedIndex ? 'scale-125 bg-[#5a4631]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            aria-label='next'
            className='p-2 hover:bg-gray-100 rounded-full transition'
          >
            ›
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
  );
}
