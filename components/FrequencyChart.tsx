import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NumberFrequency, LotteryType } from '../types.ts';
import { LOTTERY_CONFIG } from '../constants.ts';

interface FrequencyChartProps {
  data: NumberFrequency[];
  lotteryType: LotteryType;
  onSelectNumber: (num: number) => void;
}

export const FrequencyChart: React.FC<FrequencyChartProps> = ({ data, lotteryType, onSelectNumber }) => {
    const chartColor = lotteryType === 'Mega 6/45' ? '#dd282f' : '#fdb913';

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg h-[400px]">
      <h2 className="text-xl font-bold text-white mb-4">Number Frequency</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="number" stroke="#94a3b8" angle={-45} textAnchor="end" height={50} interval="preserveStartEnd" tick={{ fontSize: 12 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={[0, 'auto']} />
          <Tooltip 
             contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155',
                color: '#e2e8f0'
            }}
            cursor={{fill: 'rgba(221, 40, 47, 0.1)'}}
          />
          <Legend wrapperStyle={{ color: '#e2e8f0' }} />
          <Bar dataKey="count" name="Draw Count" fill={chartColor} onClick={(d: any) => onSelectNumber(d.payload.number)} cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};