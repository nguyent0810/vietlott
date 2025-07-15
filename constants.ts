import { LotteryType, LotteryConfig, AIStrategy } from './types.ts';

export const LOTTERY_TYPES = {
  MEGA: 'Mega 6/45',
  POWER: 'Power 6/55',
} as const;

export const LOTTERY_CONFIG: Record<LotteryType, LotteryConfig> = {
  [LOTTERY_TYPES.MEGA]: {
    name: 'Mega 6/45',
    range: 45,
    ballColor: 'bg-brand-red',
    mainNumbers: 6,
  },
  [LOTTERY_TYPES.POWER]: {
    name: 'Power 6/55',
    range: 55,
    ballColor: 'bg-brand-yellow text-slate-900',
    specialBallColor: 'bg-brand-red',
    mainNumbers: 6,
    specialNumbers: 1
  },
};

export const AI_STRATEGIES: Record<AIStrategy, { label: string; description: string }> = {
  BALANCED: {
    label: 'Balanced Mix',
    description: 'A smart blend of hot, cold, and statistical analysis for a well-rounded pick.',
  },
  HOT_FOCUS: {
    label: 'Hot Focus',
    description: 'Prioritizes numbers that have appeared frequently in recent draws.',
  },
  COLD_FOCUS: {
    label: 'Contrarian (Cold)',
    description: 'Favors numbers that are statistically "due" and have appeared less often.',
  },
  CO_PILOT: {
    label: 'AI Co-Pilot',
    description: 'You lock in your lucky numbers, and the AI finds the best companions for them.',
  }
};