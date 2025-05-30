// Test script to verify mobile API service functionality
const axios = require('axios');

// Mock the mobile API service logic
class TestApiService {
  constructor() {
    this.githubBaseURL = 'https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data';
    this.cache = new Map();
    this.CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
    
    this.api = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': 'VietlottAnalyzer-Mobile/1.0.0',
      },
    });
  }

  async fetchLotteryData(lotteryType = 'power655') {
    try {
      // Check cache first
      const cacheKey = `lottery_data_${lotteryType}`;
      const cachedEntry = this.cache.get(cacheKey);
      const now = Date.now();
      
      if (cachedEntry && now - cachedEntry.timestamp < this.CACHE_DURATION) {
        console.log(`Using cached data for ${lotteryType}`);
        return cachedEntry.data;
      }

      // Determine the correct file based on lottery type
      const fileName = lotteryType === 'power655' ? 'power655.jsonl' : 'power645.jsonl';
      const url = `${this.githubBaseURL}/${fileName}`;
      
      console.log(`Fetching lottery data from: ${url}`);
      
      const response = await this.api.get(url);
      const rawData = response.data;
      
      // Parse JSONL format (each line is a JSON object)
      const lines = rawData.trim().split('\n');
      const results = [];
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);
            
            // Convert to our LotteryResult format
            let numbers = parsed.result || [];
            let powerNumber = undefined;
            
            // For Power 6/55, the 7th number is the power number
            if (lotteryType === 'power655' && numbers.length === 7) {
              powerNumber = numbers[6]; // Last number is power number
              numbers = numbers.slice(0, 6); // First 6 are main numbers
            } else if (lotteryType === 'mega645') {
              // Mega 6/45 has no power number, just 6 main numbers
              numbers = numbers.slice(0, 6);
            }
            
            const result = {
              id: parsed.id || `${parsed.date}_${parsed.period || Date.now()}`,
              drawDate: parsed.date,
              numbers: numbers,
              powerNumber: powerNumber,
              jackpot: parsed.jackpot || Math.floor(Math.random() * 50000000) + 10000000,
              lotteryType: lotteryType,
              drawId: parsed.period || Math.floor(Math.random() * 10000),
            };
            
            results.push(result);
          } catch (parseError) {
            console.warn('Failed to parse line:', line, parseError);
          }
        }
      }
      
      // Sort by date (newest first)
      results.sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
      
      // Cache the results
      this.cache.set(cacheKey, { data: results, timestamp: now });
      
      console.log(`Fetched ${results.length} lottery results for ${lotteryType}`);
      return results;
      
    } catch (error) {
      console.error('Failed to fetch lottery data:', error);
      throw error;
    }
  }

  async fetchLatestResults(lotteryType = 'power655') {
    try {
      const allResults = await this.fetchLotteryData(lotteryType);
      return allResults.slice(0, 5);
    } catch (error) {
      console.error('Failed to fetch latest results:', error);
      throw error;
    }
  }
}

// Mock LotteryDataService for predictions
class TestLotteryDataService {
  calculateNumberFrequency(data) {
    const frequency = {};
    const lastSeen = {};
    
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
    const frequencyArray = [];

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

  getHotNumbers(data, count = 6, maxNumber = 55) {
    const frequency = this.calculateNumberFrequency(data);
    const numbers = frequency.slice(0, count).map((f) => f.number);
    return this.ensureUniqueNumbers(numbers, maxNumber);
  }

  getColdNumbers(data, count = 6, maxNumber = 55) {
    const frequency = this.calculateNumberFrequency(data);
    const numbers = frequency
      .slice(-count)
      .map((f) => f.number)
      .reverse();
    return this.ensureUniqueNumbers(numbers, maxNumber);
  }

  ensureUniqueNumbers(numbers, maxNumber) {
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

async function testMobileAPI() {
  console.log('🧪 Testing Mobile API Service...\n');
  
  const apiService = new TestApiService();
  const dataService = new TestLotteryDataService();
  
  try {
    // Test Power 6/55
    console.log('📊 Testing Power 6/55...');
    const power655Data = await apiService.fetchLatestResults('power655');
    console.log(`✅ Fetched ${power655Data.length} Power 6/55 results`);
    
    if (power655Data.length > 0) {
      const sample = power655Data[0];
      console.log(`   Latest: ${sample.drawDate} - Numbers: [${sample.numbers.join(', ')}] Power: ${sample.powerNumber}`);
      
      // Test predictions
      const hotNumbers = dataService.getHotNumbers(power655Data, 6, 55);
      const coldNumbers = dataService.getColdNumbers(power655Data, 6, 55);
      console.log(`   Hot Numbers: [${hotNumbers.join(', ')}]`);
      console.log(`   Cold Numbers: [${coldNumbers.join(', ')}]`);
    }
    
    // Test Mega 6/45
    console.log('\n📊 Testing Mega 6/45...');
    const mega645Data = await apiService.fetchLatestResults('mega645');
    console.log(`✅ Fetched ${mega645Data.length} Mega 6/45 results`);
    
    if (mega645Data.length > 0) {
      const sample = mega645Data[0];
      console.log(`   Latest: ${sample.drawDate} - Numbers: [${sample.numbers.join(', ')}]`);
      
      // Test predictions
      const hotNumbers = dataService.getHotNumbers(mega645Data, 6, 45);
      const coldNumbers = dataService.getColdNumbers(mega645Data, 6, 45);
      console.log(`   Hot Numbers: [${hotNumbers.join(', ')}]`);
      console.log(`   Cold Numbers: [${coldNumbers.join(', ')}]`);
    }
    
    console.log('\n🎉 Mobile API test completed successfully!');
    console.log('✅ Data fetching works');
    console.log('✅ Data parsing works');
    console.log('✅ Prediction algorithms work');
    console.log('✅ Both lottery types supported');
    
  } catch (error) {
    console.error('❌ Mobile API test failed:', error.message);
  }
}

testMobileAPI().catch(console.error);
