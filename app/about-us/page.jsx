'use client';

import Image from 'next/image';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export default function AboutPage() {
  return (
    <div className='flex flex-col min-h-screen bg-[#fdfcf9] text-[#2a1d12]'>
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className='relative flex items-center justify-center h-[85vh] overflow-hidden'>
        {/* Background image */}
        <div className='absolute inset-0'>
          <Image
            src='/ringbg.png' // replace with marble, fabric, or abstract vault-style image
            alt='Luxury background'
            fill
            className='object-cover object-center'
            priority
          />
          {/* Dark overlay for contrast */}
          <div className='absolute inset-0 bg-black/30 mix-blend-multiply' />
        </div>

        {/* Content */}
        <div className='relative z-10 text-center px-6 md:px-12 max-w-6xl mx-auto'>
          <h1
            className={`${cormorant.className} text-6xl md:text-8xl font-bold text-white tracking-wide mb-6`}
          >
            The Vault
          </h1>
          <p
            className={`${inter.className} text-xl md:text-2xl text-gray-200 mb-8`}
          >
            By Karan Desai
          </p>

          {/* Divider */}
          <div className='w-28 h-[3px] bg-gradient-to-r from-[#d4af37] to-[#f5e6b7] mx-auto mb-8'></div>

          <p
            className={`${inter.className} text-lg md:text-2xl text-gray-200/90 leading-relaxed max-w-4xl mx-auto`}
          >
            A journey of passion, design, and craftsmanship. Where artistry
            meets timeless elegance, and every creation becomes a story waiting
            to be told.
          </p>
        </div>
      </section>

      <main className='flex-grow'>
        {/* Our Story */}
        <section className='px-6 md:px-16 py-20 text-center max-w-4xl mx-auto'>
          <h2
            className={`${cormorant.className} text-4xl font-bold text-[#722F37] mb-6`}
          >
            Our Story
          </h2>
          <p
            className={`${inter.className} text-lg leading-relaxed text-[#2a1d12]/80`}
          >
            THE VAULT was born from a desire to create jewelry that transcends
            trends and embraces individuality. Each piece is thoughtfully
            designed to balance modern artistry with classic craftsmanship,
            offering a collection that feels both luxurious and deeply personal.
            <br />
            <br />
            We believe that jewelry should not only adorn but also resonate —
            carrying with it memories, milestones, and meaning. Our bracelets,
            rings, and pendants are designed to be cherished, passed on, and
            remembered.
          </p>
        </section>

        {/* Meet the Founder */}
        <section className='px-6 md:px-16 py-20 flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto'>
          <Image
            src='https://www.karandesaihome.com/_next/image?url=%2Fassets%2Fprofile.jpg&w=640&q=75'
            alt='Founder - Karan Desai'
            width={300}
            height={300}
            className='rounded-3xl shadow-lg object-cover'
          />
          <div className='text-center md:text-left'>
            <h2
              className={`${cormorant.className} text-4xl font-bold text-[#722F37] mb-4`}
            >
              Meet the Founder
            </h2>
            <p
              className={`${inter.className} text-lg leading-relaxed text-[#2a1d12]/80`}
            >
              Driven by a passion for design and artistry,{' '}
              <span className='font-semibold'>Karan Desai</span> envisioned THE
              VAULT as a space where jewelry is not just worn but felt. His
              vision is to curate a collection that blends luxury with emotion —
              pieces that become treasured keepsakes and timeless companions.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='py-8 text-center text-sm text-gray-500 border-t border-[#eee] bg-[#fdfcf9]'>
        <p>
          &copy; {new Date().getFullYear()} The Vault by Karan Desai. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
