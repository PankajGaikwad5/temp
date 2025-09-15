'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/products/bracelets', label: 'Bracelets' },
    { href: '/products/rings', label: 'Rings' },
    { href: '/products/pendants', label: 'Pendants' },
    { href: '/products', label: 'Products' },
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/about-us', label: 'About' },
    { href: '/contact-us', label: 'Contact Us' },
  ];

  return (
    <header className='fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#eee] px-5 md:px-10 py-5 flex justify-between items-center shadow-sm'>
      {/* Logo */}
      <a href='/'>
        <div className='flex items-center gap-3'>
          <Image src='/logo4.png' alt='logo' width={45} height={45} />
          <h1
            className={`${cormorant.className} text-2xl font-bold tracking-wide text-[#2a1d12]`}
          >
            The Vault
          </h1>
        </div>
      </a>

      {/* Desktop Nav */}
      <nav
        className={`${inter.className} hidden md:flex gap-10 text-sm text-[#2a1d12]`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className='hover:text-[#c5a572] transition duration-300 ease-in-out'
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Mobile Hamburger */}
      <div className='md:hidden'>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className='p-2 rounded-md hover:bg-gray-100 transition'
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu with animation */}
      <AnimatePresence>
        {mobileOpen && (
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
                onClick={() => setMobileOpen(false)}
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
