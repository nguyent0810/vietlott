/**
 * Simple System Test - Can be run in Node.js or browser
 * Tests the basic functionality of the automation system
 */

// Test configuration
const testConfig = {
  expectedCredentials: {
    smtpUser: 'apch wivm rkdm cqgx',
    geminiKey: 'AIzaSyBce7_D1md2YaMYzrBiQb7oznX6PkrAqfQ'
  },
  expectedServices: [
    'lotteryScheduleService',
    'lotteryDataService', 
    'predictionAnalysisService',
    'enhancedPredictionService',
    'emailNotificationService',
    'automatedSchedulerService'
  ]
};

// Test results
const results = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: { passed: 0, failed: 0, total: 0 }
};

// Helper function to run a test
function runTest(name, testFunction) {
  try {
    const result = testFunction();
    const passed = !!result.success;
    
    results.tests.push({
      name,
      passed,
      details: result.details || '',
      data: result.data || null
    });
    
    if (passed) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
    results.summary.total++;
    
    console.log(`${passed ? '✅' : '❌'} ${name}: ${result.details}`);
    
    return result;
  } catch (error) {
    results.tests.push({
      name,
      passed: false,
      details: `Error: ${error.message}`,
      data: null
    });
    
    results.summary.failed++;
    results.summary.total++;
    
    console.log(`❌ ${name}: Error - ${error.message}`);
    
    return { success: false, details: error.message };
  }
}

// Test functions
const tests = {
  
  // Test 1: Check if we're in browser environment
  browserEnvironment: () => {
    const isBrowser = typeof window !== 'undefined';
    return {
      success: isBrowser,
      details: isBrowser ? 'Running in browser environment' : 'Not in browser environment',
      data: { userAgent: isBrowser ? navigator.userAgent : 'N/A' }
    };
  },

  // Test 2: Check stored credentials
  storedCredentials: () => {
    if (typeof localStorage === 'undefined') {
      return { success: false, details: 'localStorage not available' };
    }
    
    const smtpUser = localStorage.getItem('smtpUser');
    const smtpPassword = localStorage.getItem('smtpPassword');
    const geminiKey = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('geminiApiKey') : null;
    
    const hasSmtp = !!smtpUser && !!smtpPassword;
    const hasGemini = !!geminiKey;
    
    return {
      success: hasSmtp && hasGemini,
      details: `SMTP: ${hasSmtp ? 'configured' : 'missing'}, Gemini: ${hasGemini ? 'configured' : 'missing'}`,
      data: {
        smtpUser: smtpUser || 'not set',
        hasPassword: !!smtpPassword,
        geminiKeyPrefix: geminiKey ? geminiKey.substring(0, 10) + '...' : 'not set'
      }
    };
  },

  // Test 3: Check automation configuration
  automationConfig: () => {
    if (typeof localStorage === 'undefined') {
      return { success: false, details: 'localStorage not available' };
    }
    
    const configStr = localStorage.getItem('automationConfig');
    const config = configStr ? JSON.parse(configStr) : {};
    
    const hasConfig = Object.keys(config).length > 0;
    
    return {
      success: hasConfig,
      details: hasConfig ? `Configuration found with ${Object.keys(config).length} keys` : 'No automation configuration found',
      data: config
    };
  },

  // Test 4: Check service availability
  serviceAvailability: () => {
    if (typeof window === 'undefined') {
      return { success: false, details: 'Window object not available' };
    }
    
    const availableServices = [];
    const missingServices = [];
    
    testConfig.expectedServices.forEach(serviceName => {
      if (typeof window[serviceName] !== 'undefined') {
        availableServices.push(serviceName);
      } else {
        missingServices.push(serviceName);
      }
    });
    
    const allAvailable = missingServices.length === 0;
    
    return {
      success: allAvailable,
      details: `${availableServices.length}/${testConfig.expectedServices.length} services available`,
      data: {
        available: availableServices,
        missing: missingServices
      }
    };
  },

  // Test 5: Test lottery schedule service
  lotterySchedule: () => {
    if (typeof lotteryScheduleService === 'undefined') {
      return { success: false, details: 'lotteryScheduleService not available' };
    }
    
    try {
      const todaySchedule = lotteryScheduleService.getTodaySchedule();
      const nextDraw = lotteryScheduleService.getNextDraw();
      
      return {
        success: !!todaySchedule,
        details: `Today: ${todaySchedule.dayName}, Has draws: ${todaySchedule.hasDraws}`,
        data: {
          today: todaySchedule,
          nextDraw: nextDraw ? {
            date: nextDraw.date,
            lotteryType: nextDraw.schedule.lotteries[0]?.lotteryType
          } : null
        }
      };
    } catch (error) {
      return { success: false, details: `Schedule service error: ${error.message}` };
    }
  },

  // Test 6: Test email service
  emailService: () => {
    if (typeof emailNotificationService === 'undefined') {
      return { success: false, details: 'emailNotificationService not available' };
    }
    
    try {
      const stats = emailNotificationService.getDeliveryStats();
      const subscribers = emailNotificationService.getActiveSubscribers();
      
      return {
        success: true,
        details: `${stats.totalSubscribers} total subscribers, ${stats.activeSubscribers} active`,
        data: {
          stats,
          subscriberCount: subscribers.length,
          subscribers: subscribers.map(s => ({
            email: s.email,
            lotteryTypes: s.preferences.lotteryTypes
          }))
        }
      };
    } catch (error) {
      return { success: false, details: `Email service error: ${error.message}` };
    }
  },

  // Test 7: Test automation service
  automationService: () => {
    if (typeof automatedSchedulerService === 'undefined') {
      return { success: false, details: 'automatedSchedulerService not available' };
    }
    
    try {
      const status = automatedSchedulerService.getStatus();
      const logs = automatedSchedulerService.getWorkflowLogs();
      
      return {
        success: !!status,
        details: `Running: ${status.isRunning}, Pending: ${status.pendingTasks}, Completed: ${status.completedTasks}`,
        data: {
          status,
          logCount: logs.length,
          recentLogs: logs.slice(-3)
        }
      };
    } catch (error) {
      return { success: false, details: `Automation service error: ${error.message}` };
    }
  }
};

// Run all tests
function runAllTests() {
  console.log('🧪 RUNNING AUTOMATED LOTTERY SYSTEM TESTS');
  console.log('==========================================');
  console.log(`Timestamp: ${results.timestamp}`);
  console.log('');

  // Execute all tests
  Object.entries(tests).forEach(([testName, testFunction]) => {
    runTest(testName, testFunction);
  });

  // Print summary
  console.log('');
  console.log('📊 TEST SUMMARY');
  console.log('===============');
  console.log(`✅ Passed: ${results.summary.passed}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log(`📊 Total: ${results.summary.total}`);
  
  const successRate = results.summary.total > 0 ? 
    (results.summary.passed / results.summary.total * 100).toFixed(1) : 0;
  console.log(`📈 Success Rate: ${successRate}%`);

  // Recommendations
  console.log('');
  console.log('💡 RECOMMENDATIONS');
  console.log('==================');
  
  if (results.summary.failed === 0) {
    console.log('🎉 All tests passed! System is ready for automation.');
  } else {
    console.log('🔧 Issues found. Please address:');
    results.tests.filter(t => !t.passed).forEach(test => {
      console.log(`   ❌ ${test.name}: ${test.details}`);
    });
  }

  return results;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  // Wait a moment for services to load
  setTimeout(() => {
    window.testResults = runAllTests();
  }, 1000);
} else {
  // Export for Node.js
  module.exports = { runAllTests, tests, results };
}

// Make available globally
if (typeof window !== 'undefined') {
  window.runSystemTest = runAllTests;
}
