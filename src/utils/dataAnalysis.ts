import { LotteryResult, NumberFrequency, LotteryStatistics, SuggestionAlgorithm } from '@/types/lottery';

export function calculateNumberFrequency(data: LotteryResult[]): NumberFrequency[] {
  const frequency: { [key: number]: number } = {};
  const totalNumbers = data.length * 6; // 6 numbers per draw

  // Count frequency of each number
  data.forEach(result => {
    result.result.forEach(number => {
      frequency[number] = (frequency[number] || 0) + 1;
    });
  });

  // Convert to array and calculate percentages
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

export function calculateStatistics(data: LotteryResult[]): LotteryStatistics {
  const allFrequency = calculateNumberFrequency(data);
  
  // Get data for different time periods
  const now = new Date();
  const last30Days = data.filter(result => {
    const resultDate = new Date(result.date);
    const diffTime = now.getTime() - resultDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });
  
  const last60Days = data.filter(result => {
    const resultDate = new Date(result.date);
    const diffTime = now.getTime() - resultDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60;
  });
  
  const last90Days = data.filter(result => {
    const resultDate = new Date(result.date);
    const diffTime = now.getTime() - resultDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  });

  return {
    totalDraws: data.length,
    mostFrequent: allFrequency.slice(0, 10),
    leastFrequent: allFrequency.slice(-10).reverse(),
    numberDistribution: allFrequency,
    recentTrends: {
      last30Days: calculateNumberFrequency(last30Days),
      last60Days: calculateNumberFrequency(last60Days),
      last90Days: calculateNumberFrequency(last90Days),
    },
  };
}

// Suggestion algorithms
export const suggestionAlgorithms: SuggestionAlgorithm[] = [
  {
    name: 'Hot Numbers',
    description: 'Based on most frequently drawn numbers',
    generate: (data: LotteryResult[]) => {
      const frequency = calculateNumberFrequency(data);
      return frequency.slice(0, 6).map(f => f.number);
    },
  },
  {
    name: 'Cold Numbers',
    description: 'Based on least frequently drawn numbers',
    generate: (data: LotteryResult[]) => {
      const frequency = calculateNumberFrequency(data);
      return frequency.slice(-6).map(f => f.number).reverse();
    },
  },
  {
    name: 'Balanced Mix',
    description: 'Combination of hot and cold numbers',
    generate: (data: LotteryResult[]) => {
      const frequency = calculateNumberFrequency(data);
      const hot = frequency.slice(0, 3).map(f => f.number);
      const cold = frequency.slice(-3).map(f => f.number).reverse();
      return [...hot, ...cold].sort((a, b) => a - b);
    },
  },
  {
    name: 'Recent Trends',
    description: 'Based on numbers trending in last 30 days',
    generate: (data: LotteryResult[]) => {
      const stats = calculateStatistics(data);
      return stats.recentTrends.last30Days.slice(0, 6).map(f => f.number);
    },
  },
  {
    name: 'Random Selection',
    description: 'Completely random numbers',
    generate: () => {
      const numbers: number[] = [];
      const used = new Set<number>();
      
      while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 55) + 1;
        if (!used.has(num)) {
          numbers.push(num);
          used.add(num);
        }
      }
      
      return numbers.sort((a, b) => a - b);
    },
  },
  {
    name: 'Mathematical Pattern',
    description: 'Based on mathematical distribution patterns',
    generate: (data: LotteryResult[]) => {
      const frequency = calculateNumberFrequency(data);
      const avgFrequency = frequency.reduce((sum, f) => sum + f.count, 0) / frequency.length;
      
      // Select numbers close to average frequency
      const balanced = frequency.filter(f => 
        Math.abs(f.count - avgFrequency) <= avgFrequency * 0.2
      );
      
      if (balanced.length >= 6) {
        return balanced.slice(0, 6).map(f => f.number);
      }
      
      // Fallback to top numbers if not enough balanced numbers
      return frequency.slice(0, 6).map(f => f.number);
    },
  },
];

export function generateSuggestions(data: LotteryResult[], algorithmName?: string) {
  const algorithm = algorithmName 
    ? suggestionAlgorithms.find(a => a.name === algorithmName)
    : suggestionAlgorithms[0];
  
  if (!algorithm) {
    throw new Error('Algorithm not found');
  }
  
  const numbers = algorithm.generate(data);
  const stats = calculateStatistics(data);
  
  // Calculate confidence based on frequency of suggested numbers
  const avgFrequency = stats.numberDistribution.reduce((sum, f) => sum + f.count, 0) / stats.numberDistribution.length;
  const suggestedFrequencies = numbers.map(num => 
    stats.numberDistribution.find(f => f.number === num)?.count || 0
  );
  const avgSuggestedFreq = suggestedFrequencies.reduce((sum, f) => sum + f, 0) / suggestedFrequencies.length;
  const confidence = Math.min(100, Math.max(0, (avgSuggestedFreq / avgFrequency) * 50));
  
  return {
    numbers,
    algorithm: algorithm.name,
    confidence: Math.round(confidence),
    reasoning: algorithm.description,
  };
}
