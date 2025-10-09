'use client';

import { useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import BraceletScene from '@/components/three/BraceletScene';
import ScrollSection from '@/components/ScrollSection';
import Image from 'next/image';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import Navbar from '@/components/Navbar';
import SizeGuide from '@/components/SizeGuide';
import { data } from '@/components/data';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, OrbitControls } from '@react-three/drei';
import { ModelRenderer } from '@/components/ModelRenderer';
import MonsterCardsViewer from '@/components/MonsterCardsViewer';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export default function ProductDetailClient({ product }) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const [selectedColor, setSelectedColor] = useState('#FFCE80');

  const colorOptions = [
    { name: 'Original', value: '#FFCE80' },
    { name: 'White Gold', value: '#F8FFF8' },
    { name: 'Rose Gold', value: '#FFB397' },
    { name: 'Platinum', value: '#e5e4e2' },
    { name: 'Silver', value: '#e2e5e6' },
  ];

  const [activeProduct, setActiveProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const rotationX = useTransform(scrollYProgress, [0, 1], [-29, 80]); // X rotates more
  const rotationY = useTransform(scrollYProgress, [0, 1], [35, -70]); // Y rotates more
  const rotationZ = useTransform(scrollYProgress, [0, 1], [-18, 50]); // Z rotates more

  const [rotation, setRotation] = useState([-29, 35, -18]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const [newdata, setNewdata] = useState([]);

  const [cardsOpen, setCardsOpen] = useState(false);
  // const newdata = data
  //   .filter((item) => item.id !== product.id)
  //   .sort(() => Math.random() - 0.5)
  //   .slice(0, 4);

  // use product images
  const galleryImages = product.img.map((i) => i.url);
  const modelPath = product.model;

  useEffect(() => {
    const filteredArray = data
      .filter((item) => item.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setNewdata(filteredArray);
  }, []);

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
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);
  useEffect(() => {
    if (!cardsOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setCardsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cardsOpen]);
  useEffect(() => {
    if (!sizeGuideOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setSizeGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [sizeGuideOpen]);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='min-h-screen bg-[#eeeeee] relative'>
      {/* Header */}
      <Navbar />

      {/* Fixed 3D Scene */}
      {!isFullscreen && (
        <div className='fixed inset-0 z-10 pointer-events-none'>
          <BraceletScene
            rotation={rotation}
            model={modelPath}
            color={selectedColor}
          />
        </div>
      )}

      {/* Scrollable Content */}
      <div className='relative z-20 pointer-events-auto pt-24 md:pt-0'>
        {/* Hero Section */}
        <section className='min-h-screen flex flex-col md:flex-row items-center justify-between px-4 md:px-8 lg:px-16'>
          <ScrollSection
            className='w-full md:w-1/3 max-w-md mb-8 md:mb-0'
            delay={0}
          >
            <div className='p-6 md:p-8 rounded-2xl text-center md:text-left'>
              <h1 className='text-3xl md:text-4xl lg:text-6xl font-bold text-[#722F37] mb-4 md:mb-6 leading-tight'>
                Elegant
                <span className='block'>Luxury</span>
              </h1>
            </div>
          </ScrollSection>
          <div className='w-full md:w-1/3'></div>
          <ScrollSection className='w-full md:w-1/3 max-w-md' delay={0.2}>
            <div className='p-6 md:p-8 rounded-2xl text-center md:text-left'>
              <p className='text-base md:text-lg text-[#722F37] leading-relaxed'>
                18k gold plating with hand-set gemstones, each piece tells a
                story of timeless elegance and sophisticated design.
              </p>
            </div>
          </ScrollSection>
        </section>

        {/* Transition Section */}
        <section className='min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16'>
          <ScrollSection className='text-center max-w-4xl' delay={0}>
            <div className='p-8 md:p-12 rounded-3xl'>
              <h2 className='text-3xl md:text-5xl lg:text-7xl font-bold text-[#722F37] mb-6 md:mb-8 leading-tight'>
                Exquisite
                <br />
                Craftsmanship
              </h2>
              <p className='text-lg md:text-xl text-[#722F37] leading-relaxed max-w-2xl mx-auto'>
                Every curve, every detail, meticulously designed to capture
                light and attention. This isn't just jewelry—it's wearable art.
              </p>
            </div>
          </ScrollSection>
        </section>

        {/* Features Section */}
        <section className='min-h-screen flex flex-col md:flex-row items-center justify-between px-4 md:px-8 lg:px-16 space-y-8 md:space-y-0'>
          <ScrollSection className='w-full md:w-1/3 max-w-md' delay={0}>
            <div className='p-6 md:p-8 rounded-2xl text-center md:text-left'>
              <h3 className='text-2xl md:text-3xl font-bold text-[#722F37] mb-4 md:mb-6'>
                Sustainable
                <br />
                Luxury
              </h3>
              <p className='text-base md:text-lg text-[#722F37] leading-relaxed mb-4 md:mb-6'>
                Ethically sourced materials and responsible manufacturing
                processes ensure beauty without compromise.
              </p>
              <ul className='space-y-2 md:space-y-3 text-[#722F37]'>
                <li className='flex items-center justify-center md:justify-start'>
                  <span className='w-2 h-2 bg-green-400 rounded-full mr-3'></span>
                  Conflict-free gemstones
                </li>
                <li className='flex items-center justify-center md:justify-start'>
                  <span className='w-2 h-2 bg-green-400 rounded-full mr-3'></span>
                  Recycled precious metals
                </li>
                <li className='flex items-center justify-center md:justify-start'>
                  <span className='w-2 h-2 bg-green-400 rounded-full mr-3'></span>
                  Carbon-neutral shipping
                </li>
              </ul>
            </div>
          </ScrollSection>

          <div className='hidden md:block w-1/3'></div>

          <ScrollSection className='w-full md:w-1/3 max-w-md' delay={0.2}>
            <div className='p-6 md:p-8 rounded-2xl text-center md:text-left'>
              <h3 className='text-2xl md:text-3xl font-bold text-[#722F37] mb-4 md:mb-6'>
                Lifetime
                <br />
                Guarantee
              </h3>
              <p className='text-base md:text-lg text-[#722F37] leading-relaxed mb-4 md:mb-6'>
                We stand behind our craftsmanship with comprehensive lifetime
                warranty and expert maintenance services.
              </p>
              <div className='space-y-3 md:space-y-4'>
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
        <section className='px-4 md:px-8 lg:px-16 py-12 md:py-16 bg-white'>
          <h2 className='text-3xl md:text-4xl font-bold text-[#722F37] mb-6 md:mb-8 text-center'>
            Product Gallery
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto'>
            {/* Large 3D Viewer */}
            <div className='bg-[#ebe9e4] rounded-2xl shadow-md p-3 md:p-4 flex flex-col justify-center'>
              <div className='relative aspect-square rounded-xl overflow-hidden'>
                <BraceletScene
                  rotation={[0, 0, 0]}
                  interactive={true}
                  model={modelPath}
                  color={selectedColor}
                  className='pointer-events-auto w-full h-full'
                />
                <button
                  onClick={() => setIsFullscreen(true)}
                  className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs md:text-sm font-semibold text-[#722F37] shadow hover:bg-white'
                >
                  Fullscreen
                </button>
              </div>
              {/* Color Option Buttons */}
              <div className='flex flex-wrap justify-center gap-3 mt-4'>
                {colorOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => setSelectedColor(opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition
                    ${
                      selectedColor === opt.value
                        ? 'bg-[#722F37] text-white'
                        : 'bg-white border border-[#722F37] text-[#722F37] hover:bg-[#f8f4f4]'
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
              <p className='mt-3 text-xs md:text-sm text-[#722F37]/80 text-center'>
                Drag to rotate • Scroll to zoom
              </p>
            </div>

            {/* 2x2 Images */}
            <div className='grid grid-cols-2 grid-rows-2 gap-3 md:gap-4'>
              {galleryImages.map((src, idx) => (
                <div
                  key={idx}
                  className='bg-[#f9f9f9] rounded-2xl shadow-md p-3 md:p-4 cursor-pointer'
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
                      sizes='(max-width: 768px) 50vw, 25vw'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-center mt-6 md:mt-8 gap-4'>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className='bg-[#722F37] text-white px-5 md:px-6 py-2 md:py-3 rounded-full font-semibold hover:bg-[#581f26] transition text-sm md:text-base'
            >
              Find Your Size
            </button>
            <button
              onClick={() => setCardsOpen(true)}
              className='bg-[#722F37] text-white px-5 md:px-6 py-2 md:py-3 rounded-full font-semibold hover:bg-[#581f26] transition text-sm md:text-base'
            >
              Know your Monster
            </button>
          </div>

          {/* Size Guide Modal */}
          {sizeGuideOpen && (
            <div className='fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-4'>
              <div className='bg-white w-full max-w-4xl max-h-[90vh] md:w-[90%] md:max-h-[80%] overflow-auto rounded-3xl p-6 md:p-8 relative'>
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  className='absolute top-4 right-4 text-gray-600 text-xl md:text-2xl font-bold hover:text-gray-800'
                >
                  ×
                </button>

                <SizeGuide product={product} />
              </div>
            </div>
          )}
        </section>

        {/* You may also like section */}
        <section className={`w-full  bg-white  gap-4 py-10 relative px-6`}>
          <h2 className=' md:text-4xl font-bold text-[#722F37] mb-6 md:mb-8 text-center'>
            You might also like
          </h2>
          <div className='max-w-7xl mx-auto'>
            <div
              className='grid gap-4 2xl:gap-6
                 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]'
            >
              {newdata.map((product) => (
                <div
                  key={product.id}
                  className='relative bg-white rounded-2xl shadow-md hover:shadow-xl 
             transition-all cursor-pointer overflow-hidden border border-[#f2ebe2]
             group'
                  onClick={() => setActiveProduct(product)}
                >
                  {/* If mobile → show static image, else show 3D model */}
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
                        camera={{ position: [0, 0, 4], fov: 35 }}
                        className='w-full h-full select-none'
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <ambientLight intensity={0.6} />
                        <directionalLight
                          position={[10, 10, 5]}
                          intensity={1}
                        />
                        <OrbitControls
                          enableRotate
                          maxDistance={6}
                          minDistance={2}
                          zoomSpeed={2}
                        />
                        <Environment files='../final.hdr' />
                        <ModelRenderer modelPath={product.model} />
                      </Canvas>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className='p-5 text-center'>
                    <h3
                      className={`${cormorant.className} text-2xl font-semibold text-[#2a1d12] capitalize`}
                    >
                      {product.title}
                    </h3>
                    <p
                      className={`${inter.className} mt-1 md:text-lg text-sm text-gray-500`}
                    >
                      Crafted with elegance and precision.
                    </p>
                    <a href={`/productdetail/${product.id}`}>
                      <button
                        className='mt-4 px-5 py-2 border border-[#d4af37] text-[#2a1d12] rounded-full text-sm md:text-lg font-medium 
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
        <footer className='py-8 md:py-10 text-center text-xs md:text-sm text-gray-500 border-t border-[#eee] bg-[#fdfcf9]'>
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
            className='absolute top-4 md:top-6 right-4 md:right-6 z-[210] bg-white/10 text-white rounded-full p-2 md:p-3 hover:bg-white/20'
          >
            <span
              style={{ fontSize: 18, lineHeight: 1 }}
              className='md:text-[22px]'
            >
              ×
            </span>
          </button>

          <button
            onClick={() =>
              setCurrentImage(
                (prev) =>
                  (prev - 1 + galleryImages.length) % galleryImages.length
              )
            }
            className='absolute left-2 md:left-4 lg:left-12 text-white text-2xl md:text-3xl font-bold z-[210] p-2'
          >
            ‹
          </button>

          <button
            onClick={() =>
              setCurrentImage((prev) => (prev + 1) % galleryImages.length)
            }
            className='absolute right-2 md:right-4 lg:right-12 text-white text-2xl md:text-3xl font-bold z-[210] p-2'
          >
            ›
          </button>

          <div className='relative w-[95%] md:w-[90%] lg:w-[60%] h-[70%]'>
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

      <MonsterCardsViewer
        cards={product.cards}
        open={cardsOpen}
        onClose={() => setCardsOpen(false)}
      />

      {/* Fullscreen 3D Viewer */}
      {isFullscreen && (
        <div
          className='fixed inset-0 z-[100] bg-transparent flex items-center justify-center backdrop-blur-2xl flex-col'
          role='dialog'
          aria-modal='true'
        >
          <button
            onClick={() => setIsFullscreen(false)}
            aria-label='Close fullscreen viewer'
            className='absolute top-4 md:top-6 right-4 md:right-6 z-[110] bg-black/10 text-black rounded-full p-2 md:p-3 hover:bg-black/20 focus:outline-none'
          >
            <span
              style={{ fontSize: 16, lineHeight: 1 }}
              className='md:text-[18px]'
            >
              ×
            </span>
          </button>

          <div className='w-full h-full'>
            <BraceletScene
              rotation={[0, 0, 0]}
              interactive={true}
              model={modelPath}
              className='pointer-events-auto w-full h-full'
            />
          </div>
          {/* Color Option Buttons */}
          <div className='flex flex-wrap justify-center gap-3 mt-4 relative bottom-16 md:bottom-10'>
            {colorOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={() => setSelectedColor(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                    ${
                      selectedColor === opt.value
                        ? 'bg-[#722F37] text-white'
                        : 'bg-white border border-[#722F37] text-[#722F37] hover:bg-[#f8f4f4]'
                    }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
