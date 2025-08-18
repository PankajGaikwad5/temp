'use client';

import ModelCarouselScene from '@/components/ModelCarouselScene';
import OverlayInfo from '@/components/OverlayInfo';
import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';

export default function HomePage() {
  // Provide data for each model (name, copy, and model path)
  const models = useMemo(
    () => [
      {
        name: 'Bracelets',
        subtitle: 'asjgdghd',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem quae sed maxime ducimus dicta  inventore.',
        path: '/bracelet.glb',
      },
      {
        name: 'Rings',
        subtitle: 'kdsjfhsf',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem quae sed maxime ducimus dicta  inventore.',
        path: '/ring.glb',
      },
      {
        name: 'Pendants',
        subtitle: 'fkjdsbafj',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem quae sed maxime ducimus dicta  inventore.',
        path: '/ring2.glb',
      },
    ],
    []
  );

  const [frontIndex, setFrontIndex] = useState(0);

  return (
    <main className='relative min-h-screen bg-[#eeeeee]'>
      {/* 3D Scene */}
      <div className='fixed inset-0 z-10'>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ModelCarouselScene
            models={models}
            onFrontChange={(idx) => setFrontIndex(idx)}
            // tune durations/feel here if you like:
            autoAdvanceInterval={4500}
            bounceAmplitude={0.12}
            bounceSpeed={1.2}
            radius={4.2}
          />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className='relative z-20 pointer-events-none'>
        <section className='min-h-screen flex items-end justify-center p-6 sm:p-10'>
          <OverlayInfo
            key={frontIndex}
            item={models[frontIndex]}
            index={frontIndex}
            total={models.length}
          />
        </section>

        {/* Spacer so you can scroll if needed (optional) */}
        <div className='h-[30vh]' />
      </div>
    </main>
  );
}
