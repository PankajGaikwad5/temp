'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Buttons = ({ product, index }) => {
  const overlayRefs = useRef([]);
  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) return;
    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      {
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
      },
      {
        clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)',
        duration: 0.15,
        ease: 'power2.out',
      }
    );
  };
  const handleMouseLeave = (index) => {
    if (window.innerWidth < 768) return;
    const el = overlayRefs.current[index];
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.to(el, {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
      duration: 0.2,
      ease: 'power2.in',
    });
  };
  console.log(product.id);

  return (
    <a
      href={`/productdetail/${product.id}`}
      className='relative inline-block'
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={() => handleMouseLeave(index)}
    >
      <button
        className='mt-4 px-5 py-2 border border-[#d4af37] text-[#2a1d12] hover:text-white rounded-full text-sm  font-medium 
      relative overflow-hidden z-10 transition-all duration-500'
      >
        {/* Overlay behind text */}
        <span
          className='absolute inset-0 bg-[#d4af37] clip-path transition-all duration-200 z-[-1] py-1'
          ref={(el) => {
            overlayRefs.current[index] = el;
          }}
          style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          }}
        />
        View Product
      </button>
    </a>
  );
};

export default Buttons;
