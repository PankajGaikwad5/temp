'use client';

import { useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import BraceletScene from '@/components/three/BraceletScene';
import ScrollSection from '@/components/ScrollSection';
import Image from 'next/image';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import Navbar from '@/components/Navbar';
import SizeGuide from '@/components/SizeGuide';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export default function ProductDetailClient({ product }) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const rotationX = useTransform(scrollYProgress, [0, 0.7], [-29, 33]);
  const rotationY = useTransform(scrollYProgress, [0, 0.7], [35, -32]);
  const rotationZ = useTransform(scrollYProgress, [0, 0.7], [-18, 19]);

  const [rotation, setRotation] = useState([-29, 35, -18]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // use product images
  const galleryImages = product.img.map((i) => i.url);
  const modelPath = product.model;

  // update rotation from scroll
  useEffect(() => {
    const unsubscribeX = rotationX.onChange((latest) => {
      setRotation((prev) => [latest, prev[1], prev[2]]);
    });
    const unsubscribeY = rotationY.onChange((latest) => {
      setRotation((prev) => [prev[0], latest, prev[2]]);
    });
    const unsubscribeZ = rotationZ.onChange((latest) => {
      setRotation((prev) => [prev[0], prev[1], latest]);
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
      unsubscribeZ();
    };
  }, [rotationX, rotationY, rotationZ]);

  // Close fullscreen on Escape
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  // Close image modal / navigate with arrows
  useEffect(() => {
    if (!imageModalOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setImageModalOpen(false);
      if (e.key === 'ArrowRight')
        setCurrentImage((prev) => (prev + 1) % galleryImages.length);
      if (e.key === 'ArrowLeft')
        setCurrentImage(
          (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
        );
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [imageModalOpen, galleryImages.length]);

  return (
    <div className='min-h-screen bg-[#eeeeee] relative'>
      {/* Header */}
      <Navbar />

      {/* Logo */}
      <div className='w-full flex justify-center items-center pt-6'>
        <Image src='/logo.png' width={180} height={180} alt='logo' priority />
      </div>

      {/* Fixed 3D Scene */}
      {!isFullscreen && (
        <div className='fixed inset-0 z-10 pointer-events-none'>
          <BraceletScene rotation={rotation} model={modelPath} />
        </div>
      )}

      {/* Scrollable Content */}
      <div className='relative z-20 pointer-events-auto'>
        {/* Hero Section */}
        <section className='min-h-screen flex items-center justify-between px-8 lg:px-16'>
          <ScrollSection className='w-1/3 max-w-md' delay={0}>
            <div className='p-8 rounded-2xl'>
              <h1 className='text-4xl lg:text-6xl font-bold text-[#722F37] mb-6 leading-tight'>
                Elegant
                <span className='block'>Luxury</span>
              </h1>
            </div>
          </ScrollSection>
          <div className='w-1/3'></div>
          <ScrollSection className='w-1/3 max-w-md' delay={0.2}>
            <div className='p-8 rounded-2xl'>
              <p className='text-lg text-[#722F37] leading-relaxed'>
                18k gold plating with hand-set gemstones, each piece tells a
                story of timeless elegance and sophisticated design.
              </p>
            </div>
          </ScrollSection>
        </section>

        {/* Transition Section */}
        <section className='min-h-screen flex items-center justify-center px-8 lg:px-16'>
          <ScrollSection className='text-center max-w-4xl' delay={0}>
            <div className='p-12 rounded-3xl'>
              <h2 className='text-5xl lg:text-7xl font-bold text-[#722F37] mb-8 leading-tight'>
                Exquisite
                <br />
                Craftsmanship
              </h2>
              <p className='text-xl text-[#722F37] leading-relaxed max-w-2xl mx-auto'>
                Every curve, every detail, meticulously designed to capture
                light and attention. This isn't just jewelry—it's wearable art.
              </p>
            </div>
          </ScrollSection>
        </section>

        {/* Features Section */}
        <section className='min-h-screen flex items-center justify-between px-8 lg:px-16'>
          <ScrollSection className='w-1/3 max-w-md' delay={0}>
            <div className='p-8 rounded-2xl'>
              <h3 className='text-3xl font-bold text-[#722F37] mb-6'>
                Sustainable
                <br />
                Luxury
              </h3>
              <p className='text-lg text-[#722F37] leading-relaxed mb-6'>
                Ethically sourced materials and responsible manufacturing
                processes ensure beauty without compromise.
              </p>
              <ul className='space-y-3 text-[#722F37]'>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-green-400 rounded-full mr-3'></span>
                  Conflict-free gemstones
                </li>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-green-400 rounded-full mr-3'></span>
                  Recycled precious metals
                </li>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-green-400 rounded-full mr-3'></span>
                  Carbon-neutral shipping
                </li>
              </ul>
            </div>
          </ScrollSection>

          <div className='w-1/3'></div>

          <ScrollSection className='w-1/3 max-w-md' delay={0.2}>
            <div className='p-8 rounded-2xl'>
              <h3 className='text-3xl font-bold text-[#722F37] mb-6'>
                Lifetime
                <br />
                Guarantee
              </h3>
              <p className='text-lg text-[#722F37] leading-relaxed mb-6'>
                We stand behind our craftsmanship with comprehensive lifetime
                warranty and expert maintenance services.
              </p>
              <div className='space-y-4'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-400'>Warranty Coverage</span>
                  <span className='text-[#722F37] font-semibold'>Lifetime</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-400'>Free Cleaning</span>
                  <span className='text-[#722F37] font-semibold'>Annual</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-400'>Repair Service</span>
                  <span className='text-[#722F37] font-semibold'>
                    Complimentary
                  </span>
                </div>
              </div>
            </div>
          </ScrollSection>
        </section>

        {/* Product Gallery Section */}
        <section className='px-8 lg:px-16 py-16 bg-white'>
          <h2 className='text-4xl font-bold text-[#722F37] mb-8 text-center'>
            Product Gallery
          </h2>
          <div className='grid md:grid-cols-2 gap-6 max-w-6xl mx-auto'>
            {/* Large 3D Viewer */}
            <div className='bg-[#f9f9f9] rounded-2xl shadow-md p-4 flex flex-col justify-center'>
              <div className='relative aspect-square rounded-xl overflow-hidden'>
                <BraceletScene
                  rotation={[0, 0, 0]}
                  interactive={true}
                  className='pointer-events-auto w-full h-full'
                />
                <button
                  onClick={() => setIsFullscreen(true)}
                  className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-[#722F37] shadow hover:bg-white'
                >
                  Fullscreen
                </button>
              </div>
              <p className='mt-3 text-sm text-[#722F37]/80 text-center'>
                Drag to rotate • Scroll to zoom
              </p>
            </div>

            {/* 2x2 Images */}
            <div className='grid grid-cols-2 grid-rows-2 gap-4'>
              {galleryImages.map((src, idx) => (
                <div
                  key={idx}
                  className='bg-[#f9f9f9] rounded-2xl shadow-md p-4 cursor-pointer'
                  onClick={() => {
                    setCurrentImage(idx);
                    setImageModalOpen(true);
                  }}
                >
                  <div className='relative aspect-square rounded-xl overflow-hidden'>
                    <Image
                      src={src}
                      alt={`product ${idx + 1}`}
                      fill
                      className='object-cover transition-transform duration-300 hover:scale-105'
                      sizes='(max-width: 768px) 100vw, 50vw'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-center mt-8'>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className='bg-[#722F37] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#581f26] transition'
            >
              Find Your Size
            </button>
          </div>

          {/* Size Guide Modal */}
          {sizeGuideOpen && (
            <div className='fixed inset-0 z-[300] bg-black/70 flex items-center justify-center'>
              <div className='bg-white w-[90%] md:w-[60%] max-h-[80%] overflow-auto rounded-3xl p-8 relative'>
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  className='absolute top-4 right-4 text-gray-600 text-2xl font-bold hover:text-gray-800'
                >
                  ×
                </button>

                <SizeGuide product={product} />
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className='py-10 text-center text-sm text-gray-500 border-t border-[#eee] bg-[#fdfcf9]'>
          <p>
            &copy; {new Date().getFullYear()} The Vault by Karan Desai. All
            rights reserved.
          </p>
        </footer>
      </div>

      {/* Image Modal */}
      {imageModalOpen && (
        <div className='fixed inset-0 z-[200] bg-black/90 flex items-center justify-center'>
          <button
            onClick={() => setImageModalOpen(false)}
            aria-label='Close image viewer'
            className='absolute top-6 right-6 z-[210] bg-white/10 text-white rounded-full p-3 hover:bg-white/20'
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>×</span>
          </button>

          <button
            onClick={() =>
              setCurrentImage(
                (prev) =>
                  (prev - 1 + galleryImages.length) % galleryImages.length
              )
            }
            className='absolute left-4 md:left-12 text-white text-3xl font-bold z-[210] p-2'
          >
            ‹
          </button>

          <button
            onClick={() =>
              setCurrentImage((prev) => (prev + 1) % galleryImages.length)
            }
            className='absolute right-4 md:right-12 text-white text-3xl font-bold z-[210] p-2'
          >
            ›
          </button>

          <div className='relative w-[90%] md:w-[60%] h-[70%]'>
            <Image
              src={galleryImages[currentImage]}
              alt='product modal view'
              fill
              className='object-contain'
              sizes='100vw'
            />
          </div>
        </div>
      )}

      {/* Fullscreen 3D Viewer */}
      {isFullscreen && (
        <div
          className='fixed inset-0 z-[100] bg-black/95 flex items-center justify-center'
          role='dialog'
          aria-modal='true'
        >
          <button
            onClick={() => setIsFullscreen(false)}
            aria-label='Close fullscreen viewer'
            className='absolute top-6 right-6 z-[110] bg-white/10 text-white rounded-full p-3 hover:bg-white/20 focus:outline-none'
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>×</span>
          </button>

          <div className='w-full h-full'>
            <BraceletScene
              rotation={[0, 0, 0]}
              interactive={true}
              className='pointer-events-auto w-full h-full'
            />
          </div>
        </div>
      )}
    </div>
  );
}
