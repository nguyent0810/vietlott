
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-brand-red to-brand-yellow">
                <span className="text-white font-bold text-2xl">AI</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
                Vietlott AI Predictor
            </h1>
        </div>
      </div>
    </header>
  );
};
