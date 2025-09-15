'use client';

import { useState } from 'react';
import {
  Inter,
  Cormorant_Garamond,
  Poppins,
  Montserrat,
} from 'next/font/google';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600'] });

export default function CataloguePage() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className='flex flex-col min-h-screen bg-[#eeeeee]'>
      {/* Header */}
      <Navbar />

      {/* Spacer for header */}
      <div className='h-24' />

      {/* Main content grows to push footer down */}
      <main className='flex-grow flex flex-col'>
        {/* Hero Section */}
        <section className='flex flex-col items-center text-center px-6 py-20'>
          <h2
            className={`${cormorant.className} text-5xl md:text-6xl font-bold text-[#722F37] mb-6`}
          >
            Explore Our Catalogue
          </h2>
          <p
            className={`${inter.className} text-lg text-[#722F37]/80 max-w-2xl leading-relaxed`}
          >
            Discover our full range of luxury jewelry designs in one beautifully
            curated catalogue. You can preview it online or download it for
            later.
          </p>
        </section>

        {/* Catalogue Viewer */}
        <section className='flex flex-col items-center justify-center px-6 pb-20'>
          <div className='bg-white rounded-3xl shadow-xl max-w-4xl w-full p-8 text-center'>
            {!showPreview ? (
              <>
                <Image
                  src='/cat.png'
                  alt='Catalogue cover'
                  width={600}
                  height={400}
                  className='rounded-2xl shadow-md mx-auto mb-8'
                />
                <div className='flex flex-col md:flex-row gap-6 justify-center'>
                  <button
                    onClick={() => setShowPreview(true)}
                    className='bg-[#722F37] text-white px-6 py-3 rounded-full shadow hover:opacity-90 transition'
                  >
                    View Catalogue
                  </button>
                  <a
                    href='/cat.pdf'
                    download
                    className='bg-[#c5a572] text-white px-6 py-3 rounded-full shadow hover:opacity-90 transition'
                  >
                    Download Catalogue
                  </a>
                </div>
              </>
            ) : (
              <div className='relative w-full h-[80vh] rounded-2xl overflow-hidden shadow-lg'>
                <iframe
                  src='/cat.pdf'
                  className='w-full h-full'
                  title='Catalogue Preview'
                />
                <button
                  onClick={() => setShowPreview(false)}
                  className='absolute top-4 right-4 bg-white/80 backdrop-blur-md text-[#722F37] px-4 py-2 rounded-full shadow hover:bg-white'
                >
                  Close Preview
                </button>
              </div>
            )}
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
