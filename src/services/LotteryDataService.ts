import {
  LotteryResult,
  LotteryStatistics,
  NumberFrequency,
} from "@/types/lottery";

export class LotteryDataService {
  private static instance: LotteryDataService;
  private cache: Map<string, any> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): LotteryDataService {
    if (!LotteryDataService.instance) {
      LotteryDataService.instance = new LotteryDataService();
    }
    return LotteryDataService.instance;
  }

  public async fetchLotteryData(): Promise<LotteryResult[]> {
    const cacheKey = "lottery-data";
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await fetch("/api/lottery-data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error("Failed to fetch lottery data:", error);
      throw error;
    }
  }

  public calculateNumberFrequency(data: LotteryResult[]): NumberFrequency[] {
    const frequency: { [key: number]: number } = {};
    const totalNumbers = data.length * 6;

    data.forEach((result) => {
      result.result.forEach((number) => {
        frequency[number] = (frequency[number] || 0) + 1;
      });
    });

    const frequencyArray: NumberFrequency[] = [];
    for (let i = 1; i <= 55; i++) {
      const count = frequency[i] || 0;
      frequencyArray.push({
        number: i,
        count,
        percentage: totalNumbers > 0 ? (count / totalNumbers) * 100 : 0,
      });
    }

    return frequencyArray.sort((a, b) => b.count - a.count);
  }

  public calculateStatistics(data: LotteryResult[]): LotteryStatistics {
    const allFrequency = this.calculateNumberFrequency(data);

    const now = new Date();
    const getFilteredData = (days: number) => {
      return data.filter((result) => {
        const resultDate = new Date(result.date);
        const diffTime = now.getTime() - resultDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    };

    return {
      totalDraws: data.length,
      mostFrequent: allFrequency.slice(0, 10),
      leastFrequent: allFrequency.slice(-10).reverse(),
      numberDistribution: allFrequency,
      recentTrends: {
        last30Days: this.calculateNumberFrequency(getFilteredData(30)),
        last60Days: this.calculateNumberFrequency(getFilteredData(60)),
        last90Days: this.calculateNumberFrequency(getFilteredData(90)),
      },
    };
  }

  public getHotNumbers(
    data: LotteryResult[],
    count: number = 6,
    maxNumber: number = 55
  ): number[] {
    const frequency = this.calculateNumberFrequency(data);
    const numbers = frequency.slice(0, count).map((f) => f.number);
    return this.ensureUniqueNumbers(numbers, maxNumber);
  }

  public getColdNumbers(
    data: LotteryResult[],
    count: number = 6,
    maxNumber: number = 55
  ): number[] {
    const frequency = this.calculateNumberFrequency(data);
    const numbers = frequency
      .slice(-count)
      .map((f) => f.number)
      .reverse();
    return this.ensureUniqueNumbers(numbers, maxNumber);
  }

  public getBalancedNumbers(
    data: LotteryResult[],
    maxNumber: number = 55
  ): number[] {
    const hot = this.getHotNumbers(data, 3, maxNumber);
    const cold = this.getColdNumbers(data, 3, maxNumber);
    const combined = [...hot, ...cold];
    return this.ensureUniqueNumbers(combined, maxNumber);
  }

  public getRecentTrendNumbers(data: LotteryResult[]): number[] {
    const stats = this.calculateStatistics(data);
    return stats.recentTrends.last30Days.slice(0, 6).map((f) => f.number);
  }

  public getRandomNumbers(maxNumber: number = 55): number[] {
    const numbers: number[] = [];
    const used = new Set<number>();

    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * maxNumber) + 1;
      if (!used.has(num)) {
        numbers.push(num);
        used.add(num);
      }
    }

    return numbers.sort((a, b) => a - b);
  }

  // Utility function to ensure no duplicates in any algorithm
  private ensureUniqueNumbers(
    numbers: number[],
    maxNumber: number = 55
  ): number[] {
    const unique = [...new Set(numbers)]; // Remove duplicates

    // If we have fewer than 6 unique numbers, fill with random ones
    while (unique.length < 6) {
      const randomNum = Math.floor(Math.random() * maxNumber) + 1;
      if (!unique.includes(randomNum)) {
        unique.push(randomNum);
      }
    }

    return unique.slice(0, 6).sort((a, b) => a - b);
  }

  public getMathematicalPatternNumbers(data: LotteryResult[]): number[] {
    const frequency = this.calculateNumberFrequency(data);
    const avgFrequency =
      frequency.reduce((sum, f) => sum + f.count, 0) / frequency.length;

    const balanced = frequency.filter(
      (f) => Math.abs(f.count - avgFrequency) <= avgFrequency * 0.2
    );

    if (balanced.length >= 6) {
      return balanced.slice(0, 6).map((f) => f.number);
    }

    return frequency.slice(0, 6).map((f) => f.number);
  }

  public calculateConfidence(numbers: number[], data: LotteryResult[]): number {
    const stats = this.calculateStatistics(data);
    const avgFrequency =
      stats.numberDistribution.reduce((sum, f) => sum + f.count, 0) /
      stats.numberDistribution.length;
    const suggestedFrequencies = numbers.map(
      (num) =>
        stats.numberDistribution.find((f) => f.number === num)?.count || 0
    );
    const avgSuggestedFreq =
      suggestedFrequencies.reduce((sum, f) => sum + f, 0) /
      suggestedFrequencies.length;
    return Math.min(100, Math.max(0, (avgSuggestedFreq / avgFrequency) * 50));
  }

  // Enhanced Algorithm: Smart Frequency with Recency Bias
  public getSmartFrequencyNumbers(data: LotteryResult[]): number[] {
    const recentData = data.slice(0, 50);
    const allTimeData = data.slice(0, 200);

    const recentFreq = this.calculateNumberFrequency(recentData);
    const allTimeFreq = this.calculateNumberFrequency(allTimeData);

    // Combine recent and all-time frequencies with weights
    const smartScores = recentFreq.map((recent) => {
      const allTime = allTimeFreq.find((f) => f.number === recent.number);
      const recentWeight = 0.7;
      const allTimeWeight = 0.3;

      return {
        number: recent.number,
        score:
          recent.percentage * recentWeight +
          (allTime?.percentage || 0) * allTimeWeight,
      };
    });

    return smartScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((s) => s.number)
      .sort((a, b) => a - b);
  }

  // Enhanced Algorithm: Gap Analysis with Prediction
  public getGapAnalysisNumbers(data: LotteryResult[]): number[] {
    const gapAnalysis: {
      [key: number]: { gaps: number[]; avgGap: number; currentGap: number };
    } = {};

    // Calculate gaps for each number
    for (let num = 1; num <= 55; num++) {
      const gaps: number[] = [];
      let lastSeen = -1;

      data.forEach((result, index) => {
        if (result.result.includes(num)) {
          if (lastSeen !== -1) {
            gaps.push(index - lastSeen);
          }
          lastSeen = index;
        }
      });

      const avgGap =
        gaps.length > 0
          ? gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length
          : 0;
      const currentGap = lastSeen === -1 ? data.length : lastSeen;

      gapAnalysis[num] = { gaps, avgGap, currentGap };
    }

    // Select numbers that are "due" based on gap analysis
    const candidates = Object.entries(gapAnalysis)
      .map(([num, analysis]) => ({
        number: parseInt(num),
        priority:
          analysis.currentGap >= analysis.avgGap
            ? analysis.currentGap / analysis.avgGap
            : 0,
      }))
      .filter((c) => c.priority > 1.2)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6)
      .map((c) => c.number);

    // If not enough "due" numbers, fill with hot numbers
    if (candidates.length < 6) {
      const hotNumbers = this.getHotNumbers(data, 6 - candidates.length);
      candidates.push(...hotNumbers.filter((n) => !candidates.includes(n)));
    }

    return candidates.slice(0, 6).sort((a, b) => a - b);
  }

  // Enhanced Algorithm: Pattern-Based Selection
  public getPatternBasedNumbers(data: LotteryResult[]): number[] {
    const recentData = data.slice(0, 30);

    // Analyze patterns in recent draws
    const patterns = {
      evenOdd: this.analyzeEvenOddPattern(recentData),
      sumRange: this.analyzeSumPattern(recentData),
      consecutive: this.analyzeConsecutivePattern(recentData),
      endDigits: this.analyzeEndDigitPattern(recentData),
    };

    // Generate numbers based on identified patterns
    const candidates: number[] = [];
    const used = new Set<number>();

    // Apply even/odd balance
    const targetEven = patterns.evenOdd.optimalEven;
    const targetOdd = 6 - targetEven;

    let evenCount = 0;
    let oddCount = 0;

    // Get frequency-based candidates
    const frequency = this.calculateNumberFrequency(data.slice(0, 100));
    const sortedByFreq = frequency.sort((a, b) => b.count - a.count);

    for (const freq of sortedByFreq) {
      if (candidates.length >= 6) break;

      const isEven = freq.number % 2 === 0;

      if (
        (isEven && evenCount < targetEven) ||
        (!isEven && oddCount < targetOdd)
      ) {
        if (!used.has(freq.number)) {
          candidates.push(freq.number);
          used.add(freq.number);
          if (isEven) evenCount++;
          else oddCount++;
        }
      }
    }

    // Fill remaining slots if needed
    while (candidates.length < 6) {
      for (const freq of sortedByFreq) {
        if (candidates.length >= 6) break;
        if (!used.has(freq.number)) {
          candidates.push(freq.number);
          used.add(freq.number);
        }
      }
    }

    return candidates.slice(0, 6).sort((a, b) => a - b);
  }

  // Enhanced Algorithm: Weighted Ensemble
  public getEnsembleNumbers(data: LotteryResult[]): number[] {
    const algorithms = [
      { name: "hot", numbers: this.getHotNumbers(data), weight: 0.25 },
      {
        name: "smart",
        numbers: this.getSmartFrequencyNumbers(data),
        weight: 0.25,
      },
      { name: "gap", numbers: this.getGapAnalysisNumbers(data), weight: 0.25 },
      {
        name: "pattern",
        numbers: this.getPatternBasedNumbers(data),
        weight: 0.25,
      },
    ];

    const scores: { [key: number]: number } = {};

    // Initialize scores
    for (let i = 1; i <= 55; i++) {
      scores[i] = 0;
    }

    // Calculate weighted scores
    algorithms.forEach((algo) => {
      algo.numbers.forEach((num, index) => {
        scores[num] += algo.weight * (6 - index); // Higher weight for earlier positions
      });
    });

    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([num]) => parseInt(num))
      .sort((a, b) => a - b);
  }

  // Helper methods for pattern analysis
  private analyzeEvenOddPattern(data: LotteryResult[]): {
    optimalEven: number;
  } {
    const evenOddCounts = data.map((result) => {
      const even = result.result.filter((n) => n % 2 === 0).length;
      return { even, odd: 6 - even };
    });

    const avgEven =
      evenOddCounts.reduce((sum, eo) => sum + eo.even, 0) /
      evenOddCounts.length;
    return { optimalEven: Math.round(avgEven) };
  }

  private analyzeSumPattern(data: LotteryResult[]): {
    optimalSum: number;
    range: { min: number; max: number };
  } {
    const sums = data.map((result) =>
      result.result.reduce((sum, num) => sum + num, 0)
    );
    const avgSum = sums.reduce((sum, s) => sum + s, 0) / sums.length;
    const minSum = Math.min(...sums);
    const maxSum = Math.max(...sums);

    return {
      optimalSum: Math.round(avgSum),
      range: { min: minSum, max: maxSum },
    };
  }

  private analyzeConsecutivePattern(data: LotteryResult[]): {
    hasConsecutive: boolean;
    avgConsecutive: number;
  } {
    const consecutiveCounts = data.map((result) => {
      const sorted = [...result.result].sort((a, b) => a - b);
      let consecutive = 0;
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] === sorted[i] + 1) {
          consecutive++;
        }
      }
      return consecutive;
    });

    const avgConsecutive =
      consecutiveCounts.reduce((sum, c) => sum + c, 0) /
      consecutiveCounts.length;
    return {
      hasConsecutive: avgConsecutive > 0.5,
      avgConsecutive,
    };
  }

  private analyzeEndDigitPattern(data: LotteryResult[]): {
    [key: number]: number;
  } {
    const endDigits: { [key: number]: number } = {};

    data.forEach((result) => {
      result.result.forEach((num) => {
        const endDigit = num % 10;
        endDigits[endDigit] = (endDigits[endDigit] || 0) + 1;
      });
    });

    return endDigits;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}
