// Simple test script to verify API functionality
const axios = require('axios');

async function testGitHubAPI() {
  try {
    console.log('Testing GitHub API access...');
    
    const url = 'https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data/power655.jsonl';
    console.log(`Fetching from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'VietlottAnalyzer-Test/1.0.0',
      },
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response size: ${response.data.length} characters`);
    
    // Parse first few lines
    const lines = response.data.trim().split('\n');
    console.log(`Total lines: ${lines.length}`);
    
    const results = [];
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (line.trim()) {
        try {
          const parsed = JSON.parse(line);
          results.push({
            date: parsed.date,
            period: parsed.period,
            result: parsed.result,
            powerNumber: parsed.powerNumber
          });
        } catch (parseError) {
          console.warn(`Failed to parse line ${i}:`, line);
        }
      }
    }
    
    console.log('Sample results:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. Date: ${result.date}, Period: ${result.period}, Numbers: [${result.result.join(', ')}], Power: ${result.powerNumber}`);
    });
    
    console.log('\n✅ GitHub API test successful!');
    return true;
    
  } catch (error) {
    console.error('❌ GitHub API test failed:', error.message);
    return false;
  }
}

async function testMega645API() {
  try {
    console.log('\nTesting Mega 6/45 API access...');
    
    const url = 'https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data/power645.jsonl';
    console.log(`Fetching from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'VietlottAnalyzer-Test/1.0.0',
      },
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response size: ${response.data.length} characters`);
    
    // Parse first few lines
    const lines = response.data.trim().split('\n');
    console.log(`Total lines: ${lines.length}`);
    
    const results = [];
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i];
      if (line.trim()) {
        try {
          const parsed = JSON.parse(line);
          results.push({
            date: parsed.date,
            period: parsed.period,
            result: parsed.result
          });
        } catch (parseError) {
          console.warn(`Failed to parse line ${i}:`, line);
        }
      }
    }
    
    console.log('Sample Mega 6/45 results:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. Date: ${result.date}, Period: ${result.period}, Numbers: [${result.result.join(', ')}]`);
    });
    
    console.log('\n✅ Mega 6/45 API test successful!');
    return true;
    
  } catch (error) {
    console.error('❌ Mega 6/45 API test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  const power655Success = await testGitHubAPI();
  const mega645Success = await testMega645API();
  
  console.log('\n📊 Test Results:');
  console.log(`Power 6/55: ${power655Success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Mega 6/45: ${mega645Success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (power655Success && mega645Success) {
    console.log('\n🎉 All tests passed! The API integration should work in the mobile app.');
  } else {
    console.log('\n⚠️ Some tests failed. Check your internet connection and try again.');
  }
}

runTests().catch(console.error);
