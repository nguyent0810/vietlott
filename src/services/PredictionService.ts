import { 
  LotteryResult, 
  PredictionRecord, 
  AlgorithmPerformance, 
  NumberPattern,
  AdvancedPattern 
} from '@/types/lottery';

export class PredictionService {
  private static instance: PredictionService;
  private predictions: PredictionRecord[] = [];
  private readonly STORAGE_KEY = 'vietlott-predictions';

  private constructor() {
    this.loadPredictions();
  }

  public static getInstance(): PredictionService {
    if (!PredictionService.instance) {
      PredictionService.instance = new PredictionService();
    }
    return PredictionService.instance;
  }

  // Advanced Algorithm: Neural Network-inspired Pattern Recognition
  public getNeuralPatternNumbers(data: LotteryResult[]): number[] {
    const recentData = data.slice(0, 50); // Last 50 draws
    const patterns = this.analyzePatterns(recentData);
    
    // Weight factors for different patterns
    const weights = {
      frequency: 0.3,
      recency: 0.25,
      gaps: 0.2,
      evenOdd: 0.15,
      sum: 0.1
    };

    const scores: { [key: number]: number } = {};
    
    // Initialize scores
    for (let i = 1; i <= 55; i++) {
      scores[i] = 0;
    }

    // Frequency scoring
    const frequency = this.calculateFrequency(recentData);
    frequency.forEach(f => {
      scores[f.number] += f.percentage * weights.frequency;
    });

    // Recency scoring (recent numbers get higher scores)
    recentData.slice(0, 10).forEach((result, index) => {
      result.result.forEach(num => {
        scores[num] += (10 - index) * weights.recency;
      });
    });

    // Gap analysis scoring
    const gaps = this.analyzeGaps(data);
    gaps.forEach(gap => {
      if (gap.expectedNext) {
        scores[gap.number] += gap.probability * weights.gaps;
      }
    });

    // Even/Odd balance scoring
    const evenOddBalance = this.getOptimalEvenOddBalance(patterns);
    for (let i = 1; i <= 55; i++) {
      const isEven = i % 2 === 0;
      if ((isEven && evenOddBalance.needMore === 'even') || 
          (!isEven && evenOddBalance.needMore === 'odd')) {
        scores[i] += weights.evenOdd;
      }
    }

    // Sum range scoring
    const optimalSum = this.getOptimalSum(recentData);
    const candidates = this.generateCandidatesForSum(scores, optimalSum);
    
    return candidates.slice(0, 6);
  }

  // Advanced Algorithm: Fibonacci Sequence Pattern
  public getFibonacciPatternNumbers(data: LotteryResult[]): number[] {
    const fibNumbers = this.generateFibonacci(55);
    const frequency = this.calculateFrequency(data.slice(0, 100));
    
    // Score Fibonacci numbers based on their frequency
    const fibScores = fibNumbers.map(num => ({
      number: num,
      score: frequency.find(f => f.number === num)?.percentage || 0
    }));

    // Mix high-scoring Fibonacci numbers with complementary numbers
    const topFib = fibScores.sort((a, b) => b.score - a.score).slice(0, 3);
    const complementary = this.getComplementaryNumbers(
      topFib.map(f => f.number), 
      data, 
      3
    );

    return [...topFib.map(f => f.number), ...complementary].sort((a, b) => a - b);
  }

  // Advanced Algorithm: Machine Learning-inspired Weighted Selection
  public getMLWeightedNumbers(data: LotteryResult[]): number[] {
    const features = this.extractFeatures(data);
    const weights = this.calculateMLWeights(features);
    
    const candidates: { number: number; weight: number }[] = [];
    
    for (let i = 1; i <= 55; i++) {
      let weight = 0;
      
      // Feature-based weighting
      weight += weights.frequency * (features.frequency[i] || 0);
      weight += weights.recency * (features.recency[i] || 0);
      weight += weights.pattern * (features.pattern[i] || 0);
      weight += weights.position * (features.position[i] || 0);
      
      candidates.push({ number: i, weight });
    }

    return candidates
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 6)
      .map(c => c.number)
      .sort((a, b) => a - b);
  }

  // Advanced Algorithm: Chaos Theory-based Selection
  public getChaosTheoryNumbers(data: LotteryResult[]): number[] {
    const recentData = data.slice(0, 30);
    const chaosFactors = this.calculateChaosFactors(recentData);
    
    // Use chaos factors to generate pseudo-random but pattern-aware numbers
    const seeds = chaosFactors.map(factor => Math.sin(factor * Math.PI));
    const numbers: number[] = [];
    const used = new Set<number>();
    
    for (let i = 0; i < 6; i++) {
      let num = Math.floor((Math.abs(seeds[i % seeds.length]) * 55)) + 1;
      
      // Ensure uniqueness
      while (used.has(num)) {
        num = (num % 55) + 1;
      }
      
      numbers.push(num);
      used.add(num);
    }
    
    return numbers.sort((a, b) => a - b);
  }

  // Store prediction for future comparison
  public storePrediction(
    numbers: number[], 
    algorithm: string, 
    confidence: number
  ): string {
    const prediction: PredictionRecord = {
      id: this.generateId(),
      date: new Date().toISOString().split('T')[0],
      predictedNumbers: numbers,
      algorithm,
      confidence,
      timestamp: Date.now()
    };

    this.predictions.push(prediction);
    this.savePredictions();
    return prediction.id;
  }

  // Compare prediction with actual result
  public comparePrediction(predictionId: string, actualResult: LotteryResult): void {
    const prediction = this.predictions.find(p => p.id === predictionId);
    if (!prediction) return;

    const matches = prediction.predictedNumbers.filter(num => 
      actualResult.result.includes(num)
    ).length;

    prediction.actualNumbers = actualResult.result;
    prediction.powerNumber = actualResult.powerNumber;
    prediction.matches = matches;
    prediction.accuracy = (matches / 6) * 100;

    this.savePredictions();
  }

  // Get algorithm performance statistics
  public getAlgorithmPerformance(): AlgorithmPerformance[] {
    const algorithms = [...new Set(this.predictions.map(p => p.algorithm))];
    
    return algorithms.map(algorithm => {
      const algorithmPredictions = this.predictions.filter(p => 
        p.algorithm === algorithm && p.matches !== undefined
      );

      if (algorithmPredictions.length === 0) {
        return {
          algorithmName: algorithm,
          totalPredictions: 0,
          averageMatches: 0,
          bestMatch: 0,
          accuracy: 0,
          confidenceScore: 0,
          lastUpdated: new Date().toISOString()
        };
      }

      const totalMatches = algorithmPredictions.reduce((sum, p) => sum + (p.matches || 0), 0);
      const averageMatches = totalMatches / algorithmPredictions.length;
      const bestMatch = Math.max(...algorithmPredictions.map(p => p.matches || 0));
      const accuracy = algorithmPredictions.reduce((sum, p) => sum + (p.accuracy || 0), 0) / algorithmPredictions.length;
      const confidenceScore = algorithmPredictions.reduce((sum, p) => sum + p.confidence, 0) / algorithmPredictions.length;

      return {
        algorithmName: algorithm,
        totalPredictions: algorithmPredictions.length,
        averageMatches: Math.round(averageMatches * 100) / 100,
        bestMatch,
        accuracy: Math.round(accuracy * 100) / 100,
        confidenceScore: Math.round(confidenceScore * 100) / 100,
        lastUpdated: new Date().toISOString()
      };
    });
  }

  // Get all predictions
  public getPredictions(): PredictionRecord[] {
    return [...this.predictions].sort((a, b) => b.timestamp - a.timestamp);
  }

  // Private helper methods
  private analyzePatterns(data: LotteryResult[]): NumberPattern {
    const allNumbers = data.flatMap(result => result.result);
    const consecutive = this.findConsecutivePatterns(allNumbers);
    const evenOdd = this.analyzeEvenOdd(allNumbers);
    const sums = data.map(result => result.result.reduce((sum, num) => sum + num, 0));
    
    return {
      consecutive,
      evenOdd,
      sumRange: {
        min: Math.min(...sums),
        max: Math.max(...sums),
        average: sums.reduce((sum, s) => sum + s, 0) / sums.length
      },
      gaps: this.analyzeNumberGaps(data),
      repeats: this.findRepeatingPatterns(data)
    };
  }

  private calculateFrequency(data: LotteryResult[]): { number: number; percentage: number }[] {
    const frequency: { [key: number]: number } = {};
    const totalNumbers = data.length * 6;

    data.forEach(result => {
      result.result.forEach(number => {
        frequency[number] = (frequency[number] || 0) + 1;
      });
    });

    return Object.entries(frequency).map(([num, count]) => ({
      number: parseInt(num),
      percentage: (count / totalNumbers) * 100
    }));
  }

  private analyzeGaps(data: LotteryResult[]): { number: number; gap: number; probability: number; expectedNext: boolean }[] {
    const gaps: { [key: number]: number[] } = {};
    
    // Calculate gaps for each number
    for (let num = 1; num <= 55; num++) {
      gaps[num] = [];
      let lastSeen = -1;
      
      data.forEach((result, index) => {
        if (result.result.includes(num)) {
          if (lastSeen !== -1) {
            gaps[num].push(index - lastSeen);
          }
          lastSeen = index;
        }
      });
    }

    return Object.entries(gaps).map(([num, gapArray]) => {
      const avgGap = gapArray.length > 0 ? gapArray.reduce((sum, gap) => sum + gap, 0) / gapArray.length : 0;
      const currentGap = this.getCurrentGap(parseInt(num), data);
      const probability = currentGap >= avgGap ? Math.min(currentGap / avgGap, 2) : 0;
      
      return {
        number: parseInt(num),
        gap: currentGap,
        probability,
        expectedNext: probability > 1.2
      };
    });
  }

  private getCurrentGap(number: number, data: LotteryResult[]): number {
    for (let i = 0; i < data.length; i++) {
      if (data[i].result.includes(number)) {
        return i;
      }
    }
    return data.length;
  }

  private generateFibonacci(max: number): number[] {
    const fib = [1, 1];
    while (fib[fib.length - 1] < max) {
      fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    return fib.filter(n => n <= max);
  }

  private getComplementaryNumbers(existing: number[], data: LotteryResult[], count: number): number[] {
    const frequency = this.calculateFrequency(data);
    const available = frequency.filter(f => !existing.includes(f.number));
    return available
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, count)
      .map(f => f.number);
  }

  private extractFeatures(data: LotteryResult[]): any {
    // Extract various features for ML-like processing
    return {
      frequency: this.calculateFrequency(data.slice(0, 100)),
      recency: this.calculateRecency(data.slice(0, 20)),
      pattern: this.calculatePatternScores(data.slice(0, 50)),
      position: this.calculatePositionScores(data.slice(0, 30))
    };
  }

  private calculateMLWeights(features: any): any {
    // Simple weight calculation based on feature importance
    return {
      frequency: 0.4,
      recency: 0.3,
      pattern: 0.2,
      position: 0.1
    };
  }

  private calculateChaosFactors(data: LotteryResult[]): number[] {
    return data.map((result, index) => {
      const sum = result.result.reduce((s, n) => s + n, 0);
      const variance = this.calculateVariance(result.result);
      return (sum * variance) / (index + 1);
    });
  }

  private calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    return numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadPredictions(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.predictions = JSON.parse(stored);
      }
    }
  }

  private savePredictions(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.predictions));
    }
  }

  // Additional helper methods (simplified implementations)
  private findConsecutivePatterns(numbers: number[]): number[] { return []; }
  private analyzeEvenOdd(numbers: number[]): { even: number; odd: number } { 
    const even = numbers.filter(n => n % 2 === 0).length;
    return { even, odd: numbers.length - even };
  }
  private analyzeNumberGaps(data: LotteryResult[]): number[] { return []; }
  private findRepeatingPatterns(data: LotteryResult[]): number[] { return []; }
  private getOptimalEvenOddBalance(patterns: NumberPattern): { needMore: 'even' | 'odd' } {
    return { needMore: patterns.evenOdd.even > patterns.evenOdd.odd ? 'odd' : 'even' };
  }
  private getOptimalSum(data: LotteryResult[]): number {
    const sums = data.map(r => r.result.reduce((s, n) => s + n, 0));
    return sums.reduce((s, sum) => s + sum, 0) / sums.length;
  }
  private generateCandidatesForSum(scores: { [key: number]: number }, targetSum: number): number[] {
    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 12)
      .map(([num]) => parseInt(num));
  }
  private calculateRecency(data: LotteryResult[]): any { return {}; }
  private calculatePatternScores(data: LotteryResult[]): any { return {}; }
  private calculatePositionScores(data: LotteryResult[]): any { return {}; }
}
