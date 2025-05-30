'use client';

import { motion } from 'framer-motion';

interface NumberBallProps {
  number: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'power' | 'hot' | 'cold' | 'suggested';
  delay?: number;
  animate?: boolean;
}

export default function NumberBall({ 
  number, 
  size = 'md', 
  variant = 'primary',
  delay = 0,
  animate = true
}: NumberBallProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 shadow-blue-500/25',
    secondary: 'bg-gradient-to-br from-gray-500 to-gray-600 border-gray-400 shadow-gray-500/25',
    power: 'bg-gradient-to-br from-red-500 to-red-600 border-red-400 shadow-red-500/25',
    hot: 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-400 shadow-orange-500/25',
    cold: 'bg-gradient-to-br from-cyan-500 to-blue-500 border-cyan-400 shadow-cyan-500/25',
    suggested: 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-green-500/25'
  };

  const baseClasses = `
    rounded-full flex items-center justify-center text-white font-bold
    border-2 shadow-lg backdrop-blur-sm
    ${sizeClasses[size]}
    ${variantClasses[variant]}
  `;

  const ballAnimation = animate ? {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay 
      }
    },
    whileHover: { 
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  } : {};

  return (
    <motion.div
      className={baseClasses}
      {...ballAnimation}
    >
      {number}
    </motion.div>
  );
}
