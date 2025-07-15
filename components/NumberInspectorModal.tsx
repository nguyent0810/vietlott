import React, { useMemo } from 'react';
import { DrawResult, LotteryType, LotteryConfig } from '../types.ts';
import { LOTTERY_CONFIG } from '../constants.ts';
import { NumberBall } from './NumberBall.tsx';

interface NumberInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  number: number;
  lotteryType: LotteryType;
  fullHistory: DrawResult[];
}

const StatItem: React.FC<{ label: string; value: string | number; valueClass?: string }> = ({ label, value, valueClass = 'text-sky-400' }) => (
    <div className="bg-slate-900/50 p-3 rounded-lg text-center">
        <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
        <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
    </div>
);

export const NumberInspectorModal: React.FC<NumberInspectorModalProps> = ({
  isOpen,
  onClose,
  number,
  lotteryType,
  fullHistory,
}) => {
  const config: LotteryConfig = LOTTERY_CONFIG[lotteryType];

  const stats = useMemo(() => {
    const drawsWithNumber = fullHistory
        .filter(d => d.numbers.includes(number) || d.specialNumber === number)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (drawsWithNumber.length === 0) {
        return {
            count: 0,
            lastSeen: 'N/A',
            drawsSinceLastSeen: fullHistory.length,
            partnerNumbers: [],
            drawHistory: []
        };
    }
    
    const lastSeenDraw = drawsWithNumber[0];
    const indexOfLastSeen = fullHistory.findIndex(d => d.drawId === lastSeenDraw.drawId);
    
    const partnerMap = new Map<number, number>();
    drawsWithNumber.forEach(draw => {
        draw.numbers.forEach(num => {
            if (num !== number) {
                partnerMap.set(num, (partnerMap.get(num) || 0) + 1);
            }
        });
    });

    const sortedPartners = Array.from(partnerMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5 partners

    return {
      count: drawsWithNumber.length,
      lastSeen: new Date(lastSeenDraw.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'}),
      drawsSinceLastSeen: indexOfLastSeen,
      partnerNumbers: sortedPartners,
      drawHistory: drawsWithNumber,
    };
  }, [number, fullHistory]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl w-full max-w-2xl shadow-2xl border border-slate-700/50 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <NumberBall number={number} className={config.ballColor} />
            <h2 className="text-2xl font-bold text-white">Inspector: Number {number}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 text-3xl hover:text-white transition-colors">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatItem label="Times Drawn" value={stats.count} />
                <StatItem label="Last Seen" value={stats.lastSeen} valueClass="text-lg text-slate-300" />
                <StatItem label="Draws Since" value={stats.drawsSinceLastSeen} />
            </div>

            <div className="mb-6">
                <h3 className="font-semibold text-lg text-white mb-3">Top Partner Numbers</h3>
                <div className="flex flex-wrap gap-2 items-center p-3 bg-slate-900/50 rounded-lg">
                    {stats.partnerNumbers.length > 0 ? stats.partnerNumbers.map(([num, count]) => (
                        <div key={num} className="relative group">
                            <NumberBall number={num} className={config.ballColor} small />
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-slate-950 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Drawn {count} times together
                            </div>
                        </div>
                    )) : <p className="text-sm text-slate-500">No partner data available.</p>}
                </div>
            </div>

            <div>
                 <h3 className="font-semibold text-lg text-white mb-3">Full Draw History ({stats.drawHistory.length})</h3>
                 <div className="max-h-64 overflow-y-auto pr-2 border-t border-slate-700">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700 sticky top-0">
                            <tr>
                                <th className="px-4 py-2">Draw</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Winning Numbers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.drawHistory.map(draw => (
                                <tr key={draw.drawId} className="border-b border-slate-700">
                                    <td className="px-4 py-2 text-white">#{draw.drawId}</td>
                                    <td className="px-4 py-2">{draw.date}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex flex-wrap gap-1">
                                        {draw.numbers.map(n => (
                                            <span key={n} className={`font-bold ${n === number ? 'text-sky-400' : ''}`}>{n}</span>
                                        ))}
                                        {draw.specialNumber != null && (
                                            <span className={`font-bold ${draw.specialNumber === number ? 'text-sky-400' : ''}`}>| {draw.specialNumber}</span>
                                        )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};