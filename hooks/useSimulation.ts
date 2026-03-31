import { useState, useMemo, useCallback } from 'react';
import { DrawResult, PredictionRecord, SimulationResult } from '../types.ts';
import toast from 'react-hot-toast';

export const useSimulation = (history: DrawResult[], predictionHistory: PredictionRecord[]) => {
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [simulationDate, setSimulationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [revealedDraw, setRevealedDraw] = useState<SimulationResult | null>(null);

  const visibleHistory = useMemo(() => {
    if (!isSimulationMode) return history;
    return history.filter(d => new Date(d.date) <= new Date(simulationDate));
  }, [isSimulationMode, simulationDate, history]);

  const handleRevealDraw = useCallback(() => {
    const latestPrediction = predictionHistory[0];
    if (!latestPrediction) {
      toast.error('No prediction found to reveal. Make a prediction first.');
      return;
    }

    const nextDraw = history
      .filter(d => new Date(d.date) > new Date(simulationDate))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    if (nextDraw) {
      setRevealedDraw({ prediction: latestPrediction, draw: nextDraw });
      toast.success('Simulated historical draw revealed!');
    } else {
      toast.error("No future draw found in the database to reveal.");
    }
  }, [predictionHistory, history, simulationDate]);

  return {
    isSimulationMode,
    setIsSimulationMode,
    simulationDate,
    setSimulationDate,
    revealedDraw,
    setRevealedDraw,
    visibleHistory,
    handleRevealDraw
  };
};
