/**
 * Test script to verify real lottery data integration
 * Run this to test if the real data fetching works correctly
 */

import { fetchRealLotteryData, fetchLatestDraw, getDataSourceInfo } from './services/vietlottApiService.ts';
import { lotteryDataService } from './services/lotteryDataService.ts';
import { LOTTERY_TYPES } from './constants.ts';

async function testRealDataIntegration() {
  console.log('🧪 Testing Real Lottery Data Integration\n');

  // Test data source info
  console.log('📊 Data Source Information:');
  const sourceInfo = getDataSourceInfo();
  console.log(JSON.stringify(sourceInfo, null, 2));
  console.log('');

  // Test Power 6/55 data
  console.log('🎯 Testing Power 6/55 Data:');
  try {
    const powerData = await fetchRealLotteryData(LOTTERY_TYPES.POWER, 5);
    console.log(`✅ Successfully fetched ${powerData.length} Power 6/55 results`);
    console.log('Latest result:', powerData[0]);
    console.log('');
  } catch (error) {
    console.error('❌ Failed to fetch Power 6/55 data:', error);
  }

  // Test Mega 6/45 data
  console.log('🎯 Testing Mega 6/45 Data:');
  try {
    const megaData = await fetchRealLotteryData(LOTTERY_TYPES.MEGA, 5);
    console.log(`✅ Successfully fetched ${megaData.length} Mega 6/45 results`);
    console.log('Latest result:', megaData[0]);
    console.log('');
  } catch (error) {
    console.error('❌ Failed to fetch Mega 6/45 data:', error);
  }

  // Test latest draw function
  console.log('🎯 Testing Latest Draw Function:');
  try {
    const latestPower = await fetchLatestDraw(LOTTERY_TYPES.POWER);
    const latestMega = await fetchLatestDraw(LOTTERY_TYPES.MEGA);
    
    console.log('Latest Power 6/55:', latestPower);
    console.log('Latest Mega 6/45:', latestMega);
    console.log('');
  } catch (error) {
    console.error('❌ Failed to fetch latest draws:', error);
  }

  // Test lottery data service
  console.log('🎯 Testing Lottery Data Service:');
  try {
    const serviceData = await lotteryDataService.getLotteryData(LOTTERY_TYPES.POWER, true, 10);
    console.log(`✅ Service returned ${serviceData.length} results`);
    
    const isUsingReal = await lotteryDataService.isUsingRealData(LOTTERY_TYPES.POWER);
    console.log(`Using real data: ${isUsingReal}`);
    
    const cacheStats = lotteryDataService.getCacheStats();
    console.log('Cache stats:', cacheStats);
    console.log('');
  } catch (error) {
    console.error('❌ Failed to test lottery data service:', error);
  }

  console.log('🎉 Real data integration test completed!');
}

// Run the test if this file is executed directly
if (import.meta.main) {
  testRealDataIntegration().catch(console.error);
}

export { testRealDataIntegration };
