import React from 'react';
import { LotteryType, DrawResult, PredictionRecord } from '../types.ts';
import { PredictionPanel } from './PredictionPanel.tsx';
import { HeatmapChart } from './HeatmapChart.tsx';
import { HistoryTable } from './HistoryTable.tsx';
import { PredictionHistory } from './PredictionHistory.tsx';
import { AnalysisWidgets } from './AnalysisWidgets.tsx';

interface DashboardProps {
  lotteryType: LotteryType;
  history: DrawResult[];
  predictionHistory: PredictionRecord[];
  onPredictionGenerated: (prediction: Omit<PredictionRecord, 'id' | 'date'>) => void;
  onSelectNumber: (num: number) => void;
  isSimulationActive: boolean;
  onRequestApiKey: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ lotteryType, history, predictionHistory, onPredictionGenerated, onSelectNumber, isSimulationActive, onRequestApiKey }) => {
  const recentHistory = history.slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <PredictionPanel 
          lotteryType={lotteryType} 
          history={history} 
          onPredictionGenerated={onPredictionGenerated}
          isSimulationActive={isSimulationActive}
          onRequestApiKey={onRequestApiKey}
        />
      </div>
      <div className="lg:col-span-3">
        <AnalysisWidgets history={history} lotteryType={lotteryType} />
      </div>
      <div className="lg:col-span-3">
        <HeatmapChart lotteryType={lotteryType} history={history} onSelectNumber={onSelectNumber} />
      </div>
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <HistoryTable lotteryType={lotteryType} data={recentHistory} onSelectNumber={onSelectNumber} />
          <PredictionHistory 
            predictions={predictionHistory}
            drawHistory={history}
            onSelectNumber={onSelectNumber}
          />
      </div>
    </div>
  );
};