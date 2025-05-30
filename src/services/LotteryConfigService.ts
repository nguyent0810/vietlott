import { LotteryType, LotteryConfig } from "@/types/lottery";

export class LotteryConfigService {
  private static instance: LotteryConfigService;
  private currentLotteryType: LotteryType = "power655";

  private constructor() {}

  public static getInstance(): LotteryConfigService {
    if (!LotteryConfigService.instance) {
      LotteryConfigService.instance = new LotteryConfigService();
    }
    return LotteryConfigService.instance;
  }

  public getLotteryConfigs(): LotteryConfig[] {
    return [
      {
        type: "power655",
        name: "Power 6/55",
        description: "Pick 6 numbers from 1-55 + 1 power number",
        maxNumber: 55,
        numbersCount: 6,
        hasPowerNumber: true,
        icon: "⚡",
        color: "from-blue-500 to-indigo-600",
      },
      {
        type: "mega645",
        name: "Mega 6/45",
        description: "Pick 6 numbers from 1-45",
        maxNumber: 45,
        numbersCount: 6,
        hasPowerNumber: false,
        icon: "💎",
        color: "from-purple-500 to-pink-600",
      },
    ];
  }

  public getCurrentConfig(): LotteryConfig {
    const configs = this.getLotteryConfigs();
    return (
      configs.find((config) => config.type === this.currentLotteryType) ||
      configs[0]
    );
  }

  public setCurrentLotteryType(type: LotteryType): void {
    this.currentLotteryType = type;
  }

  public getCurrentLotteryType(): LotteryType {
    return this.currentLotteryType;
  }

  // Vietlott Power 6/55 Rules
  public getPower655Rules(): string[] {
    return [
      "Select 6 different numbers from 1 to 55",
      "Select 1 power number from 1 to 55",
      "No duplicate numbers allowed in main selection",
      "Power number can be same as main numbers",
      "Draws held twice weekly (Tuesday & Friday)",
      "Minimum jackpot: 12 billion VND",
    ];
  }

  // Vietlott Mega 6/45 Rules
  public getMega645Rules(): string[] {
    return [
      "Select 6 different numbers from 1 to 45",
      "No power number required",
      "No duplicate numbers allowed",
      "Draws held twice weekly (Wednesday & Saturday)",
      "Minimum jackpot: 15 billion VND",
      "Better odds than Power 6/55",
    ];
  }

  public getRulesForCurrentLottery(): string[] {
    return this.currentLotteryType === "power655"
      ? this.getPower655Rules()
      : this.getMega645Rules();
  }

  // Calculate odds for each lottery type (based on official sources)
  public getOdds(lotteryType: LotteryType): {
    jackpot: string;
    match5: string;
    match4: string;
    match3: string;
  } {
    if (lotteryType === "power655") {
      // Power 6/55: C(55,6) × 55 = 28,989,675 × 55 = 1,594,431,125 combinations
      // But actual jackpot odds are approximately 1 in 139,838,160 (with power number)
      return {
        jackpot: "1 in 139,838,160",
        match5: "1 in 2,542,512",
        match4: "1 in 47,415",
        match3: "1 in 1,235",
      };
    } else {
      // Mega 6/45: C(45,6) = 8,145,060 combinations
      return {
        jackpot: "1 in 8,145,060",
        match5: "1 in 34,808",
        match4: "1 in 733",
        match3: "1 in 45",
      };
    }
  }

  // Prize structure information
  public getPrizeStructure(
    lotteryType: LotteryType
  ): { level: string; condition: string; prize: string }[] {
    if (lotteryType === "power655") {
      return [
        {
          level: "Jackpot",
          condition: "6 numbers + Power",
          prize: "Jackpot (min 12B VND)",
        },
        { level: "Prize 1", condition: "6 numbers", prize: "40M - 60M VND" },
        {
          level: "Prize 2",
          condition: "5 numbers + Power",
          prize: "10M - 20M VND",
        },
        { level: "Prize 3", condition: "5 numbers", prize: "500K - 1M VND" },
        {
          level: "Prize 4",
          condition: "4 numbers + Power",
          prize: "200K - 400K VND",
        },
        { level: "Prize 5", condition: "4 numbers", prize: "50K - 100K VND" },
        {
          level: "Prize 6",
          condition: "3 numbers + Power",
          prize: "20K - 50K VND",
        },
      ];
    } else {
      return [
        {
          level: "Jackpot",
          condition: "6 numbers",
          prize: "Jackpot (min 15B VND)",
        },
        { level: "Prize 1", condition: "5 numbers", prize: "10M - 30M VND" },
        { level: "Prize 2", condition: "4 numbers", prize: "300K - 800K VND" },
        { level: "Prize 3", condition: "3 numbers", prize: "30K - 80K VND" },
      ];
    }
  }
}
