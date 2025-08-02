'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BraceletScene from '../../components/three/BraceletScene';
import ScrollSection from '../../components/ScrollSection';

export default function BraceletPage() {
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to rotation values
  const rotationX = useTransform(scrollYProgress, [0, 0.5], [-29, 33]);
  const rotationY = useTransform(scrollYProgress, [0, 0.5], [35, -32]);
  const rotationZ = useTransform(scrollYProgress, [0, 0.5], [-18, 19]);

  const [rotation, setRotation] = useState([-29, 35, -18]);

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

  return (
    <div className='min-h-screen bg-gradient-to-br bg-[#f0ead6]'>
      {/* Fixed 3D Scene */}
      <div className='fixed inset-0 z-10 pointer-events-none'>
        <BraceletScene rotation={rotation} />
      </div>

      {/* Scrollable Content */}
      <div className='relative z-20 pointer-events-auto'>
        {/* Hero Section */}
        <section className='min-h-screen flex items-center justify-between px-8 lg:px-16'>
          <ScrollSection className='w-1/3 max-w-md' delay={0}>
            <div className='  p-8 rounded-2xl '>
              <h1 className='text-4xl lg:text-6xl font-bold text-[#722F37] mb-6 leading-tight'>
                Elegant
                <span className='block '>Luxury</span>
              </h1>
              {/* <p className='text-lg text-[#722F37] leading-relaxed'>
                Crafted with precision and adorned with the finest materials,
                this bracelet represents the pinnacle of jewelry artistry.
              </p> */}
            </div>
          </ScrollSection>

          <div className='w-1/3'></div>

          <ScrollSection className='w-1/3 max-w-md' delay={0.2}>
            <div className='  p-8 rounded-2xl '>
              {/* <h2 className='text-3xl lg:text-4xl font-bold text-[#722F37] mb-6'>
                Premium
                <span className='block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500'>
                  Materials
                </span>
              </h2> */}
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
            <div className='  p-12 rounded-3xl '>
              <h2 className='text-5xl lg:text-7xl font-bold text-[#722F37] mb-8 leading-tight'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'>
                  Exquisite
                </span>
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
            <div className='  p-8 rounded-2xl '>
              <h3 className='text-3xl font-bold text-[#722F37] mb-6'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500'>
                  Sustainable
                </span>
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
            <div className='  p-8 rounded-2xl '>
              <h3 className='text-3xl font-bold text-[#722F37] mb-6'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500'>
                  Lifetime
                </span>
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

        {/* Call to Action Section */}
        <section className='min-h-screen flex items-center justify-center px-8 lg:px-16'>
          <ScrollSection className='text-center max-w-4xl' delay={0}>
            <div className='  p-12 rounded-3xl '>
              <h2 className='text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'>
                  Own
                </span>
                <br />
                <span className='text-4xl lg:text-5xl'>The Extraordinary</span>
              </h2>
              <p className='text-xl text-[#722F37] leading-relaxed mb-12 max-w-2xl mx-auto'>
                Limited edition. Hand-crafted. Uniquely yours. Each piece is
                individually numbered and comes with a certificate of
                authenticity.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25'
              >
                Reserve Yours Today
              </motion.button>
            </div>
          </ScrollSection>
        </section>

        {/* Footer spacing */}
        <div className='h-32'></div>
      </div>
    </div>
  );
}
