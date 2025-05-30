// Mobile version of LotteryDataService - copied and adapted from web app
import { LotteryResult, NumberFrequency, StatisticsData, LotteryType } from '../types/lottery';

export class LotteryDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  public calculateNumberFrequency(data: LotteryResult[]): NumberFrequency[] {
    const frequency: { [key: number]: number } = {};
    const lastSeen: { [key: number]: string } = {};
    
    // Count frequency and track last seen
    data.forEach((result, index) => {
      result.numbers.forEach((num) => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (!lastSeen[num] || index < data.findIndex(r => r.numbers.includes(num))) {
          lastSeen[num] = result.drawDate;
        }
      });
    });

    // Convert to array and calculate percentages
    const totalDraws = data.length;
    const frequencyArray: NumberFrequency[] = [];

    for (let num = 1; num <= 55; num++) {
      const freq = frequency[num] || 0;
      const lastSeenDate = lastSeen[num] || data[data.length - 1]?.drawDate || new Date().toISOString();
      const daysSince = Math.floor((Date.now() - new Date(lastSeenDate).getTime()) / (1000 * 60 * 60 * 24));

      frequencyArray.push({
        number: num,
        frequency: freq,
        percentage: totalDraws > 0 ? (freq / totalDraws) * 100 : 0,
        lastSeen: lastSeenDate,
        daysSinceLastSeen: daysSince,
      });
    }

    return frequencyArray.sort((a, b) => b.frequency - a.frequency);
  }

  public calculateStatistics(data: LotteryResult[]): StatisticsData {
    const allFrequency = this.calculateNumberFrequency(data);
    
    const getFilteredData = (days: number) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return data.filter(result => new Date(result.drawDate) >= cutoffDate);
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

  public getSmartFrequencyNumbers(data: LotteryResult[]): number[] {
    const frequency = this.calculateNumberFrequency(data);
    const recentData = data.slice(0, 20); // Last 20 draws
    const recentFreq = this.calculateNumberFrequency(recentData);
    
    // Combine overall frequency with recent trends
    const smartNumbers = frequency.map(f => {
      const recentF = recentFreq.find(rf => rf.number === f.number);
      const recentBoost = recentF ? recentF.frequency * 2 : 0;
      return {
        number: f.number,
        score: f.frequency + recentBoost,
      };
    });

    return smartNumbers
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(s => s.number)
      .sort((a, b) => a - b);
  }

  public getEnsembleNumbers(data: LotteryResult[]): number[] {
    const algorithms = [
      { name: "hot", numbers: this.getHotNumbers(data), weight: 0.25 },
      { name: "smart", numbers: this.getSmartFrequencyNumbers(data), weight: 0.25 },
      { name: "gap", numbers: this.getGapAnalysisNumbers(data), weight: 0.25 },
      { name: "pattern", numbers: this.getPatternBasedNumbers(data), weight: 0.25 },
    ];

    const scores: { [key: number]: number } = {};

    // Initialize scores
    for (let i = 1; i <= 55; i++) {
      scores[i] = 0;
    }

    // Calculate weighted scores
    algorithms.forEach((algo) => {
      algo.numbers.forEach((num, index) => {
        scores[num] += algo.weight * (6 - index);
      });
    });

    // Get top 6 numbers
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([num]) => parseInt(num))
      .sort((a, b) => a - b);
  }

  private getGapAnalysisNumbers(data: LotteryResult[]): number[] {
    const gapAnalysis: { [key: number]: { gaps: number[]; avgGap: number; currentGap: number } } = {};
    
    // Initialize for all numbers
    for (let num = 1; num <= 55; num++) {
      gapAnalysis[num] = { gaps: [], avgGap: 0, currentGap: 0 };
    }

    // Calculate gaps between appearances
    data.forEach((result, index) => {
      result.numbers.forEach(num => {
        if (gapAnalysis[num].gaps.length === 0) {
          gapAnalysis[num].currentGap = index;
        } else {
          const lastIndex = data.findIndex((r, i) => i < index && r.numbers.includes(num));
          if (lastIndex !== -1) {
            gapAnalysis[num].gaps.push(index - lastIndex);
          }
        }
      });
    });

    // Calculate average gaps
    Object.keys(gapAnalysis).forEach(numStr => {
      const num = parseInt(numStr);
      const gaps = gapAnalysis[num].gaps;
      gapAnalysis[num].avgGap = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 10;
    });

    // Select numbers that are "due"
    const candidates = Object.entries(gapAnalysis)
      .map(([num, analysis]) => ({
        number: parseInt(num),
        priority: analysis.currentGap >= analysis.avgGap ? analysis.currentGap / analysis.avgGap : 0,
      }))
      .filter((c) => c.priority > 1.2)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6)
      .map((c) => c.number);

    return candidates.length >= 6 ? candidates : this.getHotNumbers(data, 6);
  }

  private getPatternBasedNumbers(data: LotteryResult[]): number[] {
    // Simple pattern analysis - consecutive numbers, odd/even distribution
    const recentResults = data.slice(0, 10);
    const allNumbers = recentResults.flatMap(r => r.numbers);
    
    // Avoid too many consecutive numbers
    const frequency = this.calculateNumberFrequency(data);
    const candidates = frequency.slice(0, 12).map(f => f.number);
    
    const selected: number[] = [];
    let oddCount = 0;
    let evenCount = 0;
    
    for (const num of candidates) {
      if (selected.length >= 6) break;
      
      // Check if adding this number creates too many consecutive
      const hasConsecutive = selected.some(s => Math.abs(s - num) === 1);
      if (hasConsecutive && selected.length > 2) continue;
      
      // Balance odd/even
      if (num % 2 === 0) {
        if (evenCount < 3) {
          selected.push(num);
          evenCount++;
        }
      } else {
        if (oddCount < 3) {
          selected.push(num);
          oddCount++;
        }
      }
    }
    
    // Fill remaining slots if needed
    while (selected.length < 6) {
      const remaining = candidates.find(c => !selected.includes(c));
      if (remaining) selected.push(remaining);
      else break;
    }
    
    return selected.sort((a, b) => a - b);
  }

  private ensureUniqueNumbers(numbers: number[], maxNumber: number): number[] {
    const unique = [...new Set(numbers)];
    
    // Fill missing numbers if needed
    while (unique.length < 6) {
      const randomNum = Math.floor(Math.random() * maxNumber) + 1;
      if (!unique.includes(randomNum)) {
        unique.push(randomNum);
      }
    }
    
    return unique.slice(0, 6).sort((a, b) => a - b);
  }
}
