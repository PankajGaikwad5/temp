// app/home/page.jsx
import dynamic from 'next/dynamic';
import { Poppins, Montserrat } from '@/lib/fonts';

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

export default function HomePage() {
  return (
    <main
      className={`${poppins.className} relative min-h-screen bg-[#eeeeee] text-gray-900 overflow-hidden`}
    >
      {/* Lazy-loaded Interactive 3D Carousel (1:1 with original homepage) */}
      <InteractiveHome />

      <footer className='fixed bottom-0 py-2 text-center text-xs md:text-sm text-gray-600 w-full backdrop-blur-sm z-30'>
        © {new Date().getFullYear()} The Vault by Karan Desai. All rights
        reserved.
      </footer>
    </main>
  );
}
