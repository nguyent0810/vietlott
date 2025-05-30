'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  delay?: number;
}

export default function Card({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false,
  delay = 0 
}: CardProps) {
  const baseClasses = `
    rounded-xl shadow-lg backdrop-blur-sm border border-white/10
    ${gradient 
      ? 'bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70' 
      : 'bg-white/80 dark:bg-gray-800/80'
    }
    ${className}
  `;

  const hoverAnimation = hover ? {
    whileHover: { 
      scale: 1.02,
      y: -4,
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <motion.div
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      {...hoverAnimation}
    >
      {children}
    </motion.div>
  );
}
