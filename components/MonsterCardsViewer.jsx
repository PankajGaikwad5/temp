'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function MonsterCardsViewer({ cards = [], open, onClose }) {
  const cardsContainerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (wrapperRef.current && cardsContainerRef.current) {
      const wrapperWidth = wrapperRef.current.offsetWidth;
      const cardsWidth = cardsContainerRef.current.scrollWidth; // total width of cards

      setScrollable(cardsWidth > wrapperWidth);
    }

    const cardsEls = Array.from(cardsContainerRef.current.children);

    gsap.set(cardsEls, {
      rotateY: 540,
      scale: 0.1,
      opacity: 0,
      transformStyle: 'preserve-3d',
    });

    cardsEls.forEach((el, idx) => {
      gsap.to(el, {
        rotateY: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        delay: idx * 0.15,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });
  }, [open, cards.length]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4'
      role='dialog'
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-200 z-50'
      >
        ×
      </button>

      {/* Wrapper */}
      <div
        ref={wrapperRef}
        className={`w-full max-w-full py-8 ${
          scrollable ? 'overflow-x-auto' : 'flex justify-center'
        }`}
      >
        <div
          ref={cardsContainerRef}
          className='flex gap-4 md:gap-6 px-4 sm:px-6 lg:px-8'
          style={{ perspective: 800 }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              className='relative flex-shrink-0 w-80 sm:w-56 md:w-52 lg:w-72 xl:w-96 2xl:w-1/4 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-white cursor-pointer'
            >
              <Image
                src={card.url}
                alt={`Card ${idx + 1}`}
                fill
                className='object-cover backface-hidden rounded-2xl'
                sizes='(max-width: 640px) 70vw, (max-width: 768px) 50vw, 20vw'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
