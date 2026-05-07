'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Inter, Cormorant_Garamond } from '@/lib/fonts';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

// Particle system
function InteractiveParticles({ mousePos, formFocus }) {
  const particlesRef = useRef();
  const particleCount = 80;
  const positions = useRef(new Float32Array(particleCount * 3));
  const velocities = useRef(new Float32Array(particleCount * 3));
  const originalPositions = useRef(new Float32Array(particleCount * 3));

  useEffect(() => {
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions.current[i] = (Math.random() - 0.5) * 10;
      positions.current[i + 1] = (Math.random() - 0.5) * 6;
      positions.current[i + 2] = (Math.random() - 0.5) * 4;
      originalPositions.current[i] = positions.current[i];
      originalPositions.current[i + 1] = positions.current[i + 1];
      originalPositions.current[i + 2] = positions.current[i + 2];
    }
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.elapsedTime;
    const mouseX = (mousePos.x / window.innerWidth) * 2 - 1;
    const mouseY = -(mousePos.y / window.innerHeight) * 2 + 1;

    for (let i = 0; i < particleCount * 3; i += 3) {
      const dx = mouseX * 5 - positions.current[i];
      const dy = mouseY * 3 - positions.current[i + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      const force = formFocus ? 0.02 : 0.01;
      if (dist < 2) {
        velocities.current[i] += dx * force;
        velocities.current[i + 1] += dy * force;
      }

      velocities.current[i] +=
        (originalPositions.current[i] - positions.current[i]) * 0.005;
      velocities.current[i + 1] +=
        (originalPositions.current[i + 1] - positions.current[i + 1]) * 0.005;

      positions.current[i] += velocities.current[i];
      positions.current[i + 1] += velocities.current[i + 1];
      positions.current[i + 2] =
        originalPositions.current[i + 2] + Math.sin(time + i * 0.01) * 0.3;

      velocities.current[i] *= 0.95;
      velocities.current[i + 1] *= 0.95;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={particleCount}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={formFocus ? 0.15 : 0.1}
        color={formFocus ? '#d4af37' : '#c5a572'}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [formFocus, setFormFocus] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFocus = () => setFormFocus(true);
  const handleBlur = () => setFormFocus(false);

  return (
    <div className='bg-[#fefefe] text-gray-900 min-h-screen'>
      {/* Header */}
      <Navbar />

      {/* Hero */}
      <section className='relative h-screen overflow-hidden'>
        <div className='absolute inset-0'>
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.3} />
            <pointLight
              position={[10, 10, 10]}
              intensity={0.5}
              color='#d4af37'
            />
            <pointLight
              position={[-10, -10, 5]}
              intensity={0.3}
              color='#ffffff'
            />
            {/* <InteractiveParticles mousePos={mousePos} formFocus={formFocus} /> */}
          </Canvas>
        </div>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/80' />
        <div className='relative z-10 h-full flex items-center justify-center text-center px-8'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className={`${cormorant.className} text-6xl md:text-8xl font-bold leading-none mb-6`}
            >
              Contact
              <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f4d03f]'>
                The Vault
              </span>
            </motion.h1>
            <motion.div
              className='w-32 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-8'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.p
              className={`${inter.className} text-lg text-gray-700 max-w-2xl mx-auto`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Share your vision and we will bring it to life with exquisite
              craftsmanship. Move your mouse to see the magic unfold.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-8'>
          <div className='flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow'>
            <span className='text-2xl font-bold bg-gradient-to-br from-[#d4af37] to-[#f4d03f] text-transparent bg-clip-text mb-2'>
              📞
            </span>
            <h3 className={`${cormorant.className} text-xl font-semibold mb-2`}>
              Call
            </h3>
            <a
              href='tel:+919876543210'
              className='text-[#d4af37] font-medium hover:text-[#f4d03f]'
            >
              +91 7977112242
            </a>
          </div>
          <div className='flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow'>
            <span className='text-2xl font-bold bg-gradient-to-br from-[#d4af37] to-[#f4d03f] text-transparent bg-clip-text mb-2'>
              ✉️
            </span>
            <h3 className={`${cormorant.className} text-xl font-semibold mb-2`}>
              Email
            </h3>
            <a
              href='mailto:hello@thevault.com'
              className='text-[#d4af37] font-medium hover:text-[#f4d03f]'
            >
              hello@thevault.com
            </a>
          </div>
          <div className='flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow'>
            <span className='text-2xl font-bold bg-gradient-to-br from-[#d4af37] to-[#f4d03f] text-transparent bg-clip-text mb-2'>
              💬
            </span>
            <h3 className={`${cormorant.className} text-xl font-semibold mb-2`}>
              WhatsApp
            </h3>
            <a
              href='https://wa.me/919876543210'
              className='text-[#d4af37] font-medium hover:text-[#f4d03f]'
            >
              Message Now
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className='py-20'>
        <div className='max-w-4xl mx-auto px-8'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className='text-center mb-16'
          >
            <h2 className={`${cormorant.className} text-5xl font-bold mb-6`}>
              Request Your
              <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f4d03f]'>
                Custom Piece
              </span>
            </h2>
            <div className='w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto' />
          </motion.div>

          <motion.form
            className='space-y-8'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className='grid md:grid-cols-2 gap-8'>
              <div className='group'>
                <label
                  className={`${inter.className} block text-sm font-medium mb-3 uppercase tracking-widest text-gray-500 group-focus-within:text-[#d4af37] transition-colors`}
                >
                  Name
                </label>
                <input
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className='w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-300 focus:border-[#d4af37] outline-none text-lg transition-all duration-300 placeholder-gray-400'
                  placeholder='Your full name'
                />
              </div>
              <div className='group'>
                <label
                  className={`${inter.className} block text-sm font-medium mb-3 uppercase tracking-widest text-gray-500 group-focus-within:text-[#d4af37] transition-colors`}
                >
                  Email
                </label>
                <input
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className='w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-300 focus:border-[#d4af37] outline-none text-lg transition-all duration-300 placeholder-gray-400'
                  placeholder='your@email.com'
                />
              </div>
            </div>

            <div className='group'>
              <label
                className={`${inter.className} block text-sm font-medium mb-3 uppercase tracking-widest text-gray-500 group-focus-within:text-[#d4af37] transition-colors`}
              >
                Message
              </label>
              <textarea
                name='message'
                value={formData.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                rows={6}
                className='w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-300 focus:border-[#d4af37] outline-none text-lg resize-none transition-all duration-300 placeholder-gray-400'
                placeholder='Your message to us'
              />
            </div>

            <div className='text-center pt-8'>
              <motion.button
                type='submit'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${inter.className} relative px-12 py-4 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-gray-900 font-semibold tracking-widest uppercase rounded-lg overflow-hidden group`}
              >
                <span className='relative z-10'>Submit</span>
                <div className='absolute inset-0 bg-gradient-to-r from-[#f4d03f] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </motion.button>
            </div>
          </motion.form>
        </div>
      </section>

      <footer className='py-8 text-center text-gray-500 text-sm bg-white'>
        © 2024 The Vault — Exquisite Custom Jewelry
      </footer>
    </div>
  );
}
