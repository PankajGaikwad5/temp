'use client';

import { motion } from 'framer-motion';

export default function ScrollSection({ 
  children, 
  className = '', 
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-100px" }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
}