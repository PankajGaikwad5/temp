// app/page.js
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Poppins, Montserrat } from 'next/font/google';
import Link from 'next/link';

// Load client carousel lazily (no SSR)
const InteractiveHome = dynamic(
  () => import('@/components/pageComponents/HomeInteractiveClient'),
  {
    ssr: false,
    loading: () => (
      <div className='h-screen flex items-center justify-center text-gray-600 text-sm'>
        Loading experience...
      </div>
    ),
  }
);

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600'] });

// SEO Metadata (Next.js 13+ format)
export const metadata = {
  title: 'The Vault by Karan Desai | Luxury Bracelets, Rings & Pendants',
  description:
    'Explore The Vault by Karan Desai — a curated collection of luxury bracelets, rings, and pendants that redefine timeless elegance and craftsmanship.',
  keywords:
    'Karan Desai, The Vault, luxury jewelry, designer bracelets, elegant rings, pendants, fine jewelry, Indian jewelry',
  openGraph: {
    title: 'The Vault by Karan Desai',
    description:
      'Luxury handcrafted jewelry — explore bracelets, rings, and pendants made with passion and precision.',
    url: 'https://thevaultkarandesai.com',
    siteName: 'The Vault by Karan Desai',
    images: [
      {
        url: '/logo4.png',
        width: 1200,
        height: 630,
        alt: 'The Vault by Karan Desai Jewelry Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Vault by Karan Desai',
    description:
      'Discover timeless jewelry crafted with precision — from bracelets to pendants, every piece defines elegance.',
    images: ['/logo4.png'],
  },
  alternates: {
    canonical: 'https://thevaultkarandesai.com/',
  },
};

// Structured Data (JSON-LD)
const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Vault by Karan Desai',
  url: 'https://thevaultkarandesai.com',
  logo: '/logo4.png',
  sameAs: [
    'https://www.instagram.com/thevaultkarandesai',
    'https://www.facebook.com/thevaultkarandesai',
  ],
  description:
    'The Vault by Karan Desai offers a luxurious collection of handcrafted bracelets, rings, and pendants.',
};

export default function HomePage() {
  return (
    <>
      {/* Structured Data Script */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main
        className={`${poppins.className} relative min-h-screen bg-[#eeeeee] text-gray-900 overflow-hidden`}
      >
        {/* Hero section (SEO friendly static text visible immediately) */}
        <section className='text-center pt-24 md:pt-36 px-6 md:px-10 hidden'>
          <Image
            src='/logo4.png'
            alt='The Vault by Karan Desai Logo'
            width={180}
            height={180}
            className='mx-auto mb-6'
          />
          <h1
            className={`${montserrat.className} text-3xl md:text-5xl font-semibold text-[#5a4631] mb-3`}
          >
            Timeless Jewelry, Redefined.
          </h1>
          <p
            className={`${poppins.className} text-sm md:text-lg text-gray-700 max-w-2xl mx-auto`}
          >
            Discover our exclusive collection of luxury{' '}
            <strong>bracelets</strong>, <strong>rings</strong>, and{' '}
            <strong>pendants</strong> — designed by
            <strong> Karan Desai</strong> to bring sophistication and
            craftsmanship together.
          </p>

          <div className='mt-8 flex justify-center gap-4'>
            <Link
              href='/products'
              className='bg-[#5a4631] text-white rounded-full px-6 py-2 text-sm md:text-base font-medium shadow-md hover:opacity-90 transition'
            >
              Explore Collection
            </Link>
            <Link
              href='/about-us'
              className='border border-[#5a4631] text-[#5a4631] rounded-full px-6 py-2 text-sm md:text-base font-medium hover:bg-[#5a4631]/10 transition'
            >
              About Us
            </Link>
          </div>
        </section>

        {/* Lazy-loaded Interactive 3D Carousel */}
        <InteractiveHome />

        <footer className='fixed bottom-0 py-2 text-center text-xs md:text-sm text-gray-600 w-full  backdrop-blur-sm'>
          © {new Date().getFullYear()} The Vault by Karan Desai. All rights
          reserved.
        </footer>
      </main>
    </>
  );
}
