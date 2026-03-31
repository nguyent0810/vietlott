import React from 'react';
import { motion } from 'framer-motion';

interface NumberBallProps {
  number: number;
  className?: string;
  small?: boolean;
  isMatched?: boolean;
  isLocked?: boolean;
}

export const NumberBall: React.FC<NumberBallProps> = ({ number, className = '', small = false, isMatched = false, isLocked = false }) => {
  const sizeClasses = small ? 'w-7 h-7 text-sm' : 'w-12 h-12 text-xl cursor-pointer';
  const matchedClasses = isMatched ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : '';
  const lockedClasses = isLocked ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900 shadow-[0_0_15px_rgba(56,189,248,0.5)]' : '';

  // Add subtle gradient to balls based on context
  const baselineGradient = className.includes('bg-') ? className : 'bg-gradient-to-br from-slate-600 to-slate-800';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -30 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      whileHover={!small ? { scale: 1.15, y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`flex items-center justify-center rounded-full font-bold text-white shadow-xl ${sizeClasses} ${baselineGradient} ${matchedClasses} ${lockedClasses} border border-white/10`}
    >
      {number}
    </motion.div>
  );
};