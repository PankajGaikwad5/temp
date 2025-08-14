'use client';

import { motion } from 'framer-motion';

export default function OverlayInfo({ item, index, total }) {
  // Simple animated swap on front change
  return (
    <motion.div
      key={item?.name}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='pointer-events-auto w-full max-w-3xl mx-auto bg-transparent rounded-2xl p-6 sm:p-8'
    >
      <div className='w-full flex justify-center items-center'>
        <h1 className='text-2xl  font-bold text-[#722F37] leading-tight'>
          {item?.name}
        </h1>
      </div>
      {/* <div className='flex items-center justify-between '>
        <div>
          <h1 className='text-2xl  font-bold text-[#722F37] leading-tight'>
            {item?.name}
          </h1>
          <p className='text-sm  text-[#8b4b52] mt-1'>{item?.subtitle}</p>
        </div>
        <div className='shrink-0 text-xs  text-[#722F37]'>
          {index + 1} / {total}
        </div>
      </div>

      <p className='text-[#5f2b31] mt-4 sm:mt-6 text-base  leading-relaxed'>
        {item?.description}
      </p>

      <div className='mt-6 flex items-center gap-3'>
        <button className='px-5 py-2 rounded-full bg-[#f6cf58] font-semibold text-black shadow hover:shadow-lg transition'>
          Explore
        </button>
        <button className='px-5 py-2 rounded-full border border-[#722F37]/30 text-[#722F37] hover:bg-[#722F37]/5 transition'>
          Details
        </button>
      </div> */}
    </motion.div>
  );
}
