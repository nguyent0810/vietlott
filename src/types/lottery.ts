export type LotteryType = "power655" | "mega645";

export interface LotteryResult {
  id: string;
  date: string;
  result: number[];
  powerNumber?: number;
  jackpot1?: string;
  jackpot2?: string;
  processTime?: string;
  lotteryType?: LotteryType;
}

export interface LotteryConfig {
  type: LotteryType;
  name: string;
  description: string;
  maxNumber: number;
  numbersCount: number;
  hasPowerNumber: boolean;
  icon: string;
  color: string;
}

export interface NumberFrequency {
  number: number;
  count: number;
  percentage: number;
}

export interface LotteryStatistics {
  totalDraws: number;
  mostFrequent: NumberFrequency[];
  leastFrequent: NumberFrequency[];
  numberDistribution: NumberFrequency[];
  recentTrends: {
    last30Days: NumberFrequency[];
    last60Days: NumberFrequency[];
    last90Days: NumberFrequency[];
  };
}

export interface SuggestionAlgorithm {
  name: string;
  description: string;
  generate: (data: LotteryResult[]) => number[];
}

export interface NumberSuggestionResult {
  numbers: number[];
  algorithm: string;
  confidence: number;
  reasoning: string;
}

export interface PredictionRecord {
  id: string;
  date: string;
  predictedNumbers: number[];
  algorithm: string;
  confidence: number;
  actualNumbers?: number[];
  powerNumber?: number;
  matches?: number;
  accuracy?: number;
  timestamp: number;
}

export interface AlgorithmPerformance {
  algorithmName: string;
  totalPredictions: number;
  averageMatches: number;
  bestMatch: number;
  accuracy: number;
  confidenceScore: number;
  lastUpdated: string;
}

export interface AdvancedPattern {
  name: string;
  description: string;
  pattern: number[];
  frequency: number;
  lastSeen: string;
}

export interface NumberPattern {
  consecutive: number[];
  evenOdd: { even: number; odd: number };
  sumRange: { min: number; max: number; average: number };
  gaps: number[];
  repeats: number[];
}
