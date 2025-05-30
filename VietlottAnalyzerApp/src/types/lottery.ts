// Lottery Types for Mobile App
export type LotteryType = "power655" | "mega645";

export interface LotteryResult {
  id: string;
  drawDate: string;
  numbers: number[];
  powerNumber?: number; // For Power 6/55
  jackpot?: number;
  lotteryType: LotteryType;
  drawId?: number;
}

export interface LotteryConfig {
  type: LotteryType;
  name: string;
  maxNumber: number;
  numbersCount: number;
  hasPowerNumber: boolean;
  powerNumberMax?: number;
  description: string;
  color: string;
  icon: string;
}

export interface NumberFrequency {
  number: number;
  frequency: number;
  percentage: number;
  lastSeen: string;
  daysSinceLastSeen: number;
}

export interface PredictionAlgorithm {
  id: string;
  name: string;
  description: string;
  confidence: number;
  numbers: number[];
  powerNumber?: number;
  accuracy?: number;
  lastUpdated: string;
}

export interface StatisticsData {
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

export interface UserPrediction {
  id: string;
  numbers: number[];
  powerNumber?: number;
  algorithm: string;
  confidence: number;
  createdAt: string;
  lotteryType: LotteryType;
  isWinner?: boolean;
  matchedNumbers?: number;
  prize?: number;
}

export interface AppSettings {
  preferredLotteryType: LotteryType;
  notificationsEnabled: boolean;
  darkMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
  language: 'vi' | 'en';
  biometricEnabled: boolean;
}

export interface NotificationSettings {
  newResults: boolean;
  predictionUpdates: boolean;
  weeklyAnalysis: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface LotteryDataResponse extends ApiResponse<LotteryResult[]> {}
export interface StatisticsResponse extends ApiResponse<StatisticsData> {}
export interface PredictionResponse extends ApiResponse<PredictionAlgorithm[]> {}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TrendData {
  date: string;
  frequency: number;
  number: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Predictions: { lotteryType?: LotteryType };
  History: { lotteryType?: LotteryType };
  Statistics: { lotteryType?: LotteryType };
  Settings: undefined;
  Notifications: undefined;
  PredictionDetail: { predictionId: string };
  ResultDetail: { resultId: string };
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREDICTIONS: 'user_predictions',
  APP_SETTINGS: 'app_settings',
  NOTIFICATION_SETTINGS: 'notification_settings',
  CACHED_RESULTS: 'cached_results',
  LAST_SYNC: 'last_sync',
  ALGORITHM_PERFORMANCE: 'algorithm_performance',
} as const;

// Constants
export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
  power655: {
    type: 'power655',
    name: 'Power 6/55',
    maxNumber: 55,
    numbersCount: 6,
    hasPowerNumber: true,
    powerNumberMax: 55,
    description: 'Chọn 6 số từ 1-55 và 1 số Power từ 1-55',
    color: '#FF6B6B',
    icon: '⚡',
  },
  mega645: {
    type: 'mega645',
    name: 'Mega 6/45',
    maxNumber: 45,
    numbersCount: 6,
    hasPowerNumber: false,
    description: 'Chọn 6 số từ 1-45',
    color: '#4ECDC4',
    icon: '💎',
  },
};

export const API_ENDPOINTS = {
  LOTTERY_DATA: '/api/lottery-data',
  PREDICTIONS: '/api/predictions',
  STATISTICS: '/api/statistics',
} as const;
