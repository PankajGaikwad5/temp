'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function MonsterCardsViewer({ cards = [], open, onClose }) {
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    if (open && cardsContainerRef.current) {
      const cardsEls = Array.from(cardsContainerRef.current.children);

      // Initialize cards flipped face-down
      gsap.set(cardsEls, {
        rotateY: 540,
        scale: 0.1,
        opacity: 0,
        transformStyle: 'preserve-3d',
      });

      // Animate flip + fade + scale
      cardsEls.forEach((el, idx) => {
        gsap.to(el, {
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: idx * 0.2,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      });
    }
  }, [open, cards.length]);

  if (!open) return null;

  // Calculate horizontal spacing based on number of cards
  const getContainerStyle = (n) => {
    if (n === 1) return 'justify-center';
    if (n <= 4) return 'justify-center gap-6 md:gap-8 ';
    return 'justify-center gap-4 md:gap-6 flex-wrap';
  };
  const getSize = (n) => {
    // if (n === 1) return '2xl:w-80';
    if (n <= 4) return '2xl:w-1/4 ';
    return '2xl:w-80';
  };

  return (
    <div
      className='fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm flex items-center'
      role='dialog'
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 text-white text-2xl md:text-3xl font-bold hover:text-gray-200 z-50'
      >
        ×
      </button>

      {/* Cards Container */}
      <div
        ref={cardsContainerRef}
        className={`relative flex ${getContainerStyle(
          cards.length
        )} w-full px-4 md:px-8 flex-wrap`}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`relative w-36 md:w-44  ${getSize(
              cards.length
            )} aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-white cursor-pointer perspective`}
            style={{ perspective: 800 }}
          >
            <Image
              src={card.url}
              alt={`Card ${idx + 1}`}
              fill
              className='object-cover backface-hidden rounded-2xl'
              sizes='(max-width: 768px) 40vw, 20vw'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
