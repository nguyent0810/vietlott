import React from 'react';
import { SimulationResult, LotteryConfig } from '../types.ts';
import { LOTTERY_CONFIG } from '../constants.ts';
import { NumberBall } from './NumberBall.tsx';

interface SimulationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SimulationResult | null;
}

export const SimulationResultModal: React.FC<SimulationResultModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen || !result) return null;

  const { prediction, draw } = result;
  const config: LotteryConfig = LOTTERY_CONFIG[prediction.lotteryType];

  const matchedNumbers = new Set(prediction.predictedNumbers.filter(num => draw.numbers.includes(num)));
  const isSpecialMatched = prediction.specialNumber != null && prediction.specialNumber === draw.specialNumber;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl w-full max-w-lg shadow-2xl border border-slate-700/50" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white text-center">Simulation Result</h2>
          <p className="text-sm text-slate-400 text-center">Comparing your prediction for {prediction.date} with the actual draw.</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Your Prediction */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-3">Your Prediction ({prediction.strategy})</h3>
            <div className="flex flex-wrap justify-center gap-2 bg-slate-900/50 p-3 rounded-lg">
              {prediction.predictedNumbers.map(num => (
                <NumberBall key={`pred-${num}`} number={num} className={config.ballColor} isMatched={matchedNumbers.has(num)} />
              ))}
              {prediction.specialNumber != null && (
                <NumberBall number={prediction.specialNumber} className={config.specialBallColor || ''} isMatched={isSpecialMatched} />
              )}
            </div>
          </div>

          {/* Actual Draw */}
          <div>
            <h3 className="font-semibold text-lg text-white mb-3">Actual Winning Numbers (Draw #{draw.drawId} on {draw.date})</h3>
            <div className="flex flex-wrap justify-center gap-2 bg-slate-900/50 p-3 rounded-lg">
              {draw.numbers.map(num => (
                <NumberBall key={`draw-${num}`} number={num} className={config.ballColor} />
              ))}
              {draw.specialNumber != null && (
                <NumberBall number={draw.specialNumber} className={config.specialBallColor || ''} />
              )}
            </div>
          </div>
          
          {/* Result Summary */}
          <div className="text-center pt-4 border-t border-slate-700">
             <h3 className="text-xl font-bold text-white">You Matched: <span className="text-green-400">{matchedNumbers.size}</span> Number{matchedNumbers.size === 1 ? '' : 's'}</h3>
             {isSpecialMatched && <p className="text-lg font-semibold text-green-400">and the Special Number!</p>}
          </div>

        </div>

        <div className="p-4 bg-slate-900/50 rounded-b-xl text-center">
            <button onClick={onClose} className="bg-brand-red hover:bg-red-600 text-white font-bold py-2 px-6 rounded-md transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};