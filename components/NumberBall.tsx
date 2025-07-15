
import React from 'react';

interface NumberBallProps {
  number: number;
  className?: string;
  small?: boolean;
  isMatched?: boolean;
  isLocked?: boolean;
}

export const NumberBall: React.FC<NumberBallProps> = ({ number, className = '', small = false, isMatched = false, isLocked = false }) => {
  const sizeClasses = small ? 'w-7 h-7 text-sm' : 'w-12 h-12 text-xl';
  const matchedClasses = isMatched ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-slate-800' : '';
  const lockedClasses = isLocked ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-800' : '';

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white shadow-md transition-all ${sizeClasses} ${className} ${matchedClasses} ${lockedClasses}`}
    >
      {number}
    </div>
  );
};