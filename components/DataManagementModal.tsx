import React, { useState, useMemo } from 'react';
import { DrawResult, LotteryType, LotteryConfig } from '../types.ts';
import { LOTTERY_CONFIG } from '../constants.ts';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotteryType: LotteryType;
  drawHistory: DrawResult[];
  onHistoryUpdate: (newHistory: DrawResult[]) => void;
}

const today = new Date().toISOString().split('T')[0];

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  lotteryType,
  drawHistory,
  onHistoryUpdate,
}) => {
  const [drawId, setDrawId] = useState('');
  const [date, setDate] = useState(today);
  const [numbersStr, setNumbersStr] = useState('');
  const [specialNumberStr, setSpecialNumberStr] = useState('');
  const [error, setError] = useState<string | null>(null);

  const config: LotteryConfig = LOTTERY_CONFIG[lotteryType];

  const validateAndParseNumbers = () => {
    const mainNumbers = numbersStr.split(/[\s,]+/).filter(Boolean).map(Number);
    if (mainNumbers.some(isNaN)) {
      throw new Error('All numbers must be valid numerical values.');
    }
    if (mainNumbers.length !== config.mainNumbers) {
      throw new Error(`Please provide exactly ${config.mainNumbers} main numbers.`);
    }
    if (new Set(mainNumbers).size !== config.mainNumbers) {
        throw new Error('All main numbers must be unique.');
    }
    for (const num of mainNumbers) {
      if (num < 1 || num > config.range) {
        throw new Error(`All main numbers must be between 1 and ${config.range}.`);
      }
    }
    
    let specialNumber: number | undefined = undefined;
    if (config.specialNumbers) {
        if (!specialNumberStr) throw new Error('A special number is required for this lottery type.');
        specialNumber = Number(specialNumberStr);
        if (isNaN(specialNumber)) throw new Error('Special number must be a valid numerical value.');
        if (specialNumber < 1 || specialNumber > config.range) {
            throw new Error(`The special number must be between 1 and ${config.range}.`);
        }
    }
    
    return { mainNumbers, specialNumber };
  };

  const handleAddDraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!drawId || !date || !numbersStr) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const { mainNumbers, specialNumber } = validateAndParseNumbers();
      const newDraw: DrawResult = {
        drawId,
        date,
        numbers: mainNumbers.sort((a,b) => a - b),
        specialNumber,
        lotteryType,
      };

      if (drawHistory.some(d => d.drawId === newDraw.drawId)) {
          setError('A draw with this ID already exists.');
          return;
      }

      onHistoryUpdate([newDraw, ...drawHistory]);
      
      // Reset form
      setDrawId('');
      setDate(today);
      setNumbersStr('');
      setSpecialNumberStr('');

    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleDeleteDraw = (id: string) => {
    if(window.confirm(`Are you sure you want to delete draw #${id}?`)) {
        onHistoryUpdate(drawHistory.filter(d => d.drawId !== id));
    }
  };

  const sortedHistory = useMemo(() => 
    [...drawHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.drawId.localeCompare(a.drawId)), 
    [drawHistory]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl w-full max-w-2xl shadow-2xl border border-slate-700/50 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Manage Draw History for {lotteryType}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">&times;</button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleAddDraw} className="p-6 border-b border-slate-700">
          <h3 className="font-semibold text-lg text-white mb-4">Add New Draw</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Draw ID (e.g., 01078)" value={drawId} onChange={e => setDrawId(e.target.value)} className="bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-brand-yellow focus:outline-none" required />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} max={today} className="bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-brand-yellow focus:outline-none" required />
            <input type="text" placeholder={`Numbers (e.g. 5,15,25,35,45,55)`} value={numbersStr} onChange={e => setNumbersStr(e.target.value)} className="bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-brand-yellow focus:outline-none" required />
            <input type="text" placeholder="Special #" value={specialNumberStr} onChange={e => setSpecialNumberStr(e.target.value)} className="bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-brand-yellow focus:outline-none" disabled={!config.specialNumbers} required={!!config.specialNumbers}/>
          </div>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          <button type="submit" className="mt-4 w-full bg-brand-red hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Add Draw</button>
        </form>

        {/* History List */}
        <div className="p-6 overflow-y-auto">
            <h3 className="font-semibold text-lg text-white mb-4">Existing Draws ({drawHistory.length})</h3>
            <div className="max-h-[40vh] overflow-y-auto pr-2">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-300 uppercase bg-slate-700 sticky top-0">
                        <tr>
                            <th className="px-4 py-2">Draw</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Numbers</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedHistory.map(draw => (
                            <tr key={draw.drawId} className="border-b border-slate-700">
                                <td className="px-4 py-2 text-white">#{draw.drawId}</td>
                                <td className="px-4 py-2">{draw.date}</td>
                                <td className="px-4 py-2">{draw.numbers.join(', ')}{draw.specialNumber ? ` | ${draw.specialNumber}` : ''}</td>
                                <td className="px-4 py-2 text-right">
                                    <button onClick={() => handleDeleteDraw(draw.drawId)} className="text-red-500 hover:text-red-400 p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};