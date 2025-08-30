'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Poppins } from 'next/font/google';
import { useState } from 'react';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });

const category = {
  name: 'Bracelets',
  description: 'Explore our exclusive collection of fine bracelets.',
};

const products = [
  {
    id: 1,
    name: 'Gold Bracelet',
    price: '$99',
    description: 'A timeless piece of elegance.',
    modelPath: '/bracelet2.glb', // Path to your 3D model
  },
  {
    id: 2,
    name: 'Silver Bracelet',
    price: '$89',
    description: 'Sleek and sophisticated for everyday wear.',
    modelPath: '/ring.glb', // Path to your 3D model
  },
  {
    id: 3,
    name: 'Diamond Bracelet',
    price: '$299',
    description: 'The epitome of luxury and style.',
    modelPath: '/pendant2.glb', // Path to your 3D model
  },
];

export default function CategoryPage() {
  const [activeProduct, setActiveProduct] = useState(products[0]);

  const handleProductSelect = (product) => {
    setActiveProduct(product);
  };

  return (
    <main className='min-h-screen w-full bg-[#f3f3f3]'>
      {/* Hero Section with Image Background */}
      <section
        className='relative w-full h-[600px] bg-cover bg-center'
        style={{
          backgroundImage: "url('../bracelet/b1.png')", // Add your background image path here
        }}
      >
        <div className='absolute inset-0 flex flex-col items-center justify-center text-white'>
          <h1 className={`${poppins.className} text-5xl font-bold`}>
            {category.name}
          </h1>
          <p className={`${poppins.className} text-lg font-medium mt-4`}>
            {category.description}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className='py-16 px-8'>
        <h2
          className={`${poppins.className} text-3xl font-semibold text-[#4e3a27] mb-8`}
        >
          Our Exclusive Collection
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
          {products.map((product) => (
            <div
              key={product.id}
              className='relative bg-white p-4 rounded-2xl shadow-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl cursor-pointer border border-[#e0e0e0]'
              onClick={() => handleProductSelect(product)}
              // style={{ height: '600px' }} // Increased height for better proportions
            >
              {/* 3D Model */}
              <div
                className='w-full h-[250px] mb-4 bg-[#eeeeee] rounded-xl overflow-hidden' // Model background color
              >
                <Canvas
                  camera={{ position: [0, 1, 5], fov: 45 }}
                  className='w-full h-full'
                >
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <OrbitControls enableRotate={true} enableZoom={true} />
                  <Environment files='../final.hdr' />
                  <ModelRenderer modelPath={product.modelPath} />
                </Canvas>
              </div>

              {/* Product Details */}
              <div className='flex justify-between items-center'>
                <div className='text-start flex justify-start items-start flex-col'>
                  <h3
                    className={`${poppins.className} text-lg font-semibold text-[#4e3a27]`}
                  >
                    {product.name}
                  </h3>
                  <p className={`${poppins.className} text-sm text-gray-600`}>
                    {product.description}
                  </p>
                  {/* <span className='text-xl font-semibold text-[#4e3a27]'>
                    {product.price}
                  </span> */}
                </div>

                {/* "View Product" Button */}
                <div className='mt-4 text-center'>
                  <button className='bg-[#eeeeee] text-black py-2 px-6 rounded-md font-medium shadow-md transition-all hover:bg-[#cecece]'>
                    View Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className='py-8 text-center text-sm text-gray-600'>
        &copy; {new Date().getFullYear()} The Vault by Karan Desai. All rights
        reserved.
      </footer>
    </main>
  );
}

// Direct model rendering using useGLTF hook
function ModelRenderer({ modelPath }) {
  const { scene } = useGLTF(modelPath);

  // Clone the model and add shadows to meshes
  const model = scene.clone(true);
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material && child.material.metalness !== undefined) {
        child.material.metalness = Math.min(
          1,
          (child.material.metalness ?? 0.8) + 0.1
        );
        child.material.roughness = Math.max(
          0,
          (child.material.roughness ?? 0.3) - 0.05
        );
      }
    }
  });

  return (
    <group>
      <primitive object={model} />
    </group>
  );
}

// Preloading GLB models (to avoid loading lag)
useGLTF.preload('/bracelet2.glb');
useGLTF.preload('/ring.glb');
useGLTF.preload('/pendant2.glb');
