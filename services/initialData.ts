import { LotteryType, DrawResult } from '../types.ts';
import { LOTTERY_TYPES } from '../constants.ts';

const initialPowerHistory: DrawResult[] = [
    { drawId: "01078", date: "2024-07-27", numbers: [3, 12, 15, 25, 33, 44], specialNumber: 5, lotteryType: LOTTERY_TYPES.POWER },
    { drawId: "01077", date: "2024-07-25", numbers: [8, 11, 28, 30, 39, 41], specialNumber: 52, lotteryType: LOTTERY_TYPES.POWER },
    { drawId: "01076", date: "2024-07-23", numbers: [6, 19, 21, 22, 37, 51], specialNumber: 4, lotteryType: LOTTERY_TYPES.POWER },
    { drawId: "01075", date: "2024-07-20", numbers: [1, 13, 29, 36, 38, 55], specialNumber: 16, lotteryType: LOTTERY_TYPES.POWER },
    { drawId: "01074", date: "2024-07-18", numbers: [7, 10, 14, 20, 40, 48], specialNumber: 23, lotteryType: LOTTERY_TYPES.POWER },
    { drawId: "01073", date: "2024-07-16", numbers: [9, 17, 24, 31, 46, 50], specialNumber: 34, lotteryType: LOTTERY_TYPES.POWER },
    { drawId: "01072", date: "2024-07-13", numbers: [2, 26, 35, 42, 47, 49], specialNumber: 18, lotteryType: LOTTERY_TYPES.POWER },
    { drawId: "01071", date: "2024-07-11", numbers: [13, 27, 30, 32, 45, 54], specialNumber: 22, lotteryType: LOTTERY_TYPES.POWER },
    { drawId: "01070", date: "2024-07-09", numbers: [4, 6, 18, 28, 33, 53], specialNumber: 3, lotteryType: LOTTERY_TYPES.POWER },
    { drawId: "01069", date: "2024-07-06", numbers: [5, 16, 23, 29, 34, 43], specialNumber: 1, lotteryType: LOTTERY_TYPES.POWER }
];

const initialMegaHistory: DrawResult[] = [
    { drawId: "01229", date: "2024-07-26", numbers: [6, 10, 14, 22, 33, 41], lotteryType: LOTTERY_TYPES.MEGA },
    { drawId: "01228", date: "2024-07-24", numbers: [2, 8, 15, 28, 30, 39], lotteryType: LOTTERY_TYPES.MEGA },
    { drawId: "01227", date: "2024-07-21", numbers: [1, 11, 19, 21, 27, 37], lotteryType: LOTTERY_TYPES.MEGA },
    { drawId: "01226", date: "2024-07-19", numbers: [5, 13, 16, 29, 38, 45], lotteryType: LOTTERY_TYPES.MEGA },
    { drawId: "01225", date: "2024-07-17", numbers: [3, 7, 18, 20, 25, 40], lotteryType: LOTTERY_TYPES.MEGA },
    { drawId: "01224", date: "2024-07-14", numbers: [9, 12, 17, 24, 31, 42], lotteryType: LOTTERY_TYPES.MEGA },
    { drawId: "01223", date: "2024-07-12", numbers: [4, 16, 23, 26, 35, 43], lotteryType: LOTTERY_TYPES.MEGA },
    { drawId: "01222", date: "2024-07-10", numbers: [10, 13, 27, 30, 32, 34], lotteryType: LOTTERY_TYPES.MEGA },
    { drawId: "01221", date: "2024-07-07", numbers: [1, 6, 11, 22, 28, 36], lotteryType: LOTTERY_TYPES.MEGA },
    { drawId: "01220", date: "2024-07-05", numbers: [8, 19, 21, 25, 33, 44], lotteryType: LOTTERY_TYPES.MEGA }
];


export const getInitialHistory = (lotteryType: LotteryType): DrawResult[] => {
    switch (lotteryType) {
        case LOTTERY_TYPES.MEGA:
            return initialMegaHistory;
        case LOTTERY_TYPES.POWER:
            return initialPowerHistory;
        default:
            return [];
    }
};
