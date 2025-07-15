import React from 'react';
import { LotteryType } from '../types.ts';
import { LOTTERY_TYPES } from '../constants.ts';

interface LotterySelectorProps {
  selectedLottery: LotteryType;
  onSelectLottery: (lottery: LotteryType) => void;
}

export const LotterySelector: React.FC<LotterySelectorProps> = ({ selectedLottery, onSelectLottery }) => {
  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 p-2 bg-slate-800 rounded-full">
      {(Object.values(LOTTERY_TYPES)).map((lottery) => (
        <button
          key={lottery}
          onClick={() => onSelectLottery(lottery)}
          className={`px-4 sm:px-8 py-3 text-sm sm:text-base font-bold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-yellow ${
            selectedLottery === lottery
              ? 'bg-brand-red text-white shadow-lg'
              : 'bg-transparent text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          {lottery}
        </button>
      ))}
    </div>
  );
};