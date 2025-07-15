import { LOTTERY_TYPES } from './constants.ts';

export type LotteryType = typeof LOTTERY_TYPES[keyof typeof LOTTERY_TYPES];

export type AIStrategy = 'BALANCED' | 'HOT_FOCUS' | 'COLD_FOCUS' | 'CO_PILOT';

export interface DrawResult {
  drawId: string;
  date: string;
  numbers: number[];
  specialNumber?: number;
  lotteryType: LotteryType; // Added to uniquely identify the draw
}

export interface NumberFrequency {
  number: number;
  count: number;
}

export interface LotteryConfig {
  name: string;
  range: number;
  ballColor: string;
  specialBallColor?: string;
  mainNumbers: number;
  specialNumbers?: number;
}

export interface PredictionRecord {
  id: string;
  date: string;
  lotteryType: LotteryType;
  predictedNumbers: number[];
  specialNumber?: number;
  strategy: AIStrategy;
  reasoning: string;
  lockedNumbers?: number[];
}

export interface SimulationResult {
  prediction: PredictionRecord;
  draw: DrawResult;
}