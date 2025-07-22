/**
 * Comprehensive Test Suite for Automated Lottery System
 * Run this in browser console to test all components
 */

console.log('🧪 STARTING COMPREHENSIVE AUTOMATION SYSTEM TEST');
console.log('================================================');

// Test Results Storage
const testResults = {
  configuration: {},
  services: {},
  automation: {},
  email: {},
  predictions: {},
  overall: { passed: 0, failed: 0, warnings: 0 }
};

// Helper function to log test results
function logTest(category, testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const icon = passed ? '✅' : '❌';
  
  console.log(`${icon} ${category}: ${testName}`);
  if (details) console.log(`   ${details}`);
  
  if (!testResults[category]) testResults[category] = {};
  testResults[category][testName] = { passed, details };
  
  if (passed) {
    testResults.overall.passed++;
  } else {
    testResults.overall.failed++;
  }
}

function logWarning(category, testName, message) {
  console.log(`⚠️ WARNING ${category}: ${testName} - ${message}`);
  testResults.overall.warnings++;
}

// Test 1: Configuration Tests
console.log('\n📋 TESTING CONFIGURATION...');

try {
  // Check if setup script is loaded
  const hasSetupScript = typeof setupAutomation !== 'undefined';
  logTest('configuration', 'Setup Script Loaded', hasSetupScript, 
    hasSetupScript ? 'setupAutomation object available' : 'setupAutomation not found');

  // Check stored credentials
  const smtpUser = localStorage.getItem('smtpUser');
  const smtpPassword = localStorage.getItem('smtpPassword');
  const geminiKey = sessionStorage.getItem('geminiApiKey');
  
  logTest('configuration', 'SMTP User Configured', !!smtpUser, smtpUser || 'Not set');
  logTest('configuration', 'SMTP Password Configured', !!smtpPassword, 
    smtpPassword ? 'Password set (hidden)' : 'Not set');
  logTest('configuration', 'Gemini API Key Configured', !!geminiKey, 
    geminiKey ? `Key set: ${geminiKey.substring(0, 10)}...` : 'Not set');

  // Check automation config
  const automationConfig = JSON.parse(localStorage.getItem('automationConfig') || '{}');
  logTest('configuration', 'Automation Config Exists', Object.keys(automationConfig).length > 0,
    `Config keys: ${Object.keys(automationConfig).join(', ')}`);

} catch (error) {
  logTest('configuration', 'Configuration Test', false, `Error: ${error.message}`);
}

// Test 2: Service Availability Tests
console.log('\n🔧 TESTING SERVICES...');

try {
  // Check if services are available
  const services = [
    'lotteryScheduleService',
    'lotteryDataService', 
    'predictionAnalysisService',
    'enhancedPredictionService',
    'emailNotificationService',
    'automatedSchedulerService'
  ];

  services.forEach(serviceName => {
    const serviceAvailable = typeof window[serviceName] !== 'undefined';
    logTest('services', `${serviceName} Available`, serviceAvailable,
      serviceAvailable ? 'Service loaded' : 'Service not found in global scope');
  });

  // Test lottery schedule service
  if (typeof lotteryScheduleService !== 'undefined') {
    const todaySchedule = lotteryScheduleService.getTodaySchedule();
    logTest('services', 'Lottery Schedule Working', !!todaySchedule,
      `Today: ${todaySchedule.dayName}, Has draws: ${todaySchedule.hasDraws}`);
    
    const nextDraw = lotteryScheduleService.getNextDraw();
    logTest('services', 'Next Draw Detection', !!nextDraw,
      nextDraw ? `Next: ${nextDraw.schedule.dayName} ${nextDraw.schedule.lotteries[0]?.lotteryType}` : 'No upcoming draws');
  }

} catch (error) {
  logTest('services', 'Service Tests', false, `Error: ${error.message}`);
}

// Test 3: Email Service Tests
console.log('\n📧 TESTING EMAIL SERVICE...');

try {
  if (typeof emailNotificationService !== 'undefined') {
    // Test email service initialization
    const deliveryStats = emailNotificationService.getDeliveryStats();
    logTest('email', 'Email Service Stats', !!deliveryStats,
      `Subscribers: ${deliveryStats.totalSubscribers}, Active: ${deliveryStats.activeSubscribers}`);

    // Test subscriber management
    const activeSubscribers = emailNotificationService.getActiveSubscribers();
    logTest('email', 'Subscriber Management', Array.isArray(activeSubscribers),
      `Found ${activeSubscribers.length} active subscribers`);

    // Log subscriber details
    if (activeSubscribers.length > 0) {
      console.log('📋 Subscriber Details:');
      activeSubscribers.forEach((sub, index) => {
        console.log(`   ${index + 1}. ${sub.email} - Types: ${sub.preferences.lotteryTypes.join(', ')}`);
      });
    }
  } else {
    logTest('email', 'Email Service Available', false, 'emailNotificationService not found');
  }
} catch (error) {
  logTest('email', 'Email Service Tests', false, `Error: ${error.message}`);
}

// Test 4: Automation Service Tests
console.log('\n🤖 TESTING AUTOMATION SERVICE...');

try {
  if (typeof automatedSchedulerService !== 'undefined') {
    // Test automation status
    const status = automatedSchedulerService.getStatus();
    logTest('automation', 'Automation Status Available', !!status,
      `Running: ${status.isRunning}, Pending: ${status.pendingTasks}, Completed: ${status.completedTasks}`);

    // Test workflow logs
    const logs = automatedSchedulerService.getWorkflowLogs();
    logTest('automation', 'Workflow Logs Available', Array.isArray(logs),
      `Found ${logs.length} workflow log entries`);

    // Show recent workflow results
    if (logs.length > 0) {
      console.log('📊 Recent Workflow Results:');
      logs.slice(-3).forEach((log, index) => {
        console.log(`   ${index + 1}. ${log.date} ${log.lotteryType}: ${log.success ? '✅' : '❌'}`);
      });
    }
  } else {
    logTest('automation', 'Automation Service Available', false, 'automatedSchedulerService not found');
  }
} catch (error) {
  logTest('automation', 'Automation Service Tests', false, `Error: ${error.message}`);
}

// Test 5: Prediction System Tests
console.log('\n🎯 TESTING PREDICTION SYSTEM...');

try {
  if (typeof enhancedPredictionService !== 'undefined' && typeof lotteryDataService !== 'undefined') {
    // Test data availability
    console.log('🔄 Testing prediction generation...');
    
    // This is a simplified test - in reality we'd need to handle async operations
    logTest('predictions', 'Enhanced Prediction Service Available', true, 'Service loaded successfully');
    
    // Test prediction analysis service
    if (typeof predictionAnalysisService !== 'undefined') {
      predictionAnalysisService.loadAccuracyHistory();
      const metrics = predictionAnalysisService.getAccuracyMetrics();
      logTest('predictions', 'Accuracy Metrics Available', !!metrics,
        `Total predictions: ${metrics.totalPredictions}, Avg accuracy: ${(metrics.averageAccuracy * 100).toFixed(1)}%`);
    }
  } else {
    logTest('predictions', 'Prediction Services Available', false, 'Required services not found');
  }
} catch (error) {
  logTest('predictions', 'Prediction System Tests', false, `Error: ${error.message}`);
}

// Test 6: Integration Tests
console.log('\n🔗 TESTING SYSTEM INTEGRATION...');

try {
  // Test if all required components are working together
  const hasConfiguration = !!localStorage.getItem('smtpUser') && !!sessionStorage.getItem('geminiApiKey');
  const hasServices = typeof automatedSchedulerService !== 'undefined' && typeof emailNotificationService !== 'undefined';
  const hasSubscribers = emailNotificationService?.getActiveSubscribers()?.length > 0;
  
  logTest('integration', 'Complete Configuration', hasConfiguration,
    hasConfiguration ? 'All credentials configured' : 'Missing credentials');
  
  logTest('integration', 'All Services Loaded', hasServices,
    hasServices ? 'Core services available' : 'Missing core services');
  
  logTest('integration', 'Has Subscribers', hasSubscribers,
    hasSubscribers ? `${emailNotificationService.getActiveSubscribers().length} subscribers ready` : 'No subscribers found');

  // Overall system readiness
  const systemReady = hasConfiguration && hasServices && hasSubscribers;
  logTest('integration', 'System Ready for Automation', systemReady,
    systemReady ? 'All components ready for automated operation' : 'System needs configuration');

} catch (error) {
  logTest('integration', 'Integration Tests', false, `Error: ${error.message}`);
}

// Test Summary
console.log('\n📊 TEST SUMMARY');
console.log('===============');
console.log(`✅ Passed: ${testResults.overall.passed}`);
console.log(`❌ Failed: ${testResults.overall.failed}`);
console.log(`⚠️ Warnings: ${testResults.overall.warnings}`);

const successRate = (testResults.overall.passed / (testResults.overall.passed + testResults.overall.failed) * 100).toFixed(1);
console.log(`📈 Success Rate: ${successRate}%`);

// Recommendations
console.log('\n💡 RECOMMENDATIONS');
console.log('==================');

if (testResults.overall.failed === 0) {
  console.log('🎉 All tests passed! Your automation system is ready.');
  console.log('✅ You can now enable automation in the Admin Dashboard.');
} else {
  console.log('🔧 Some tests failed. Please address the following:');
  
  Object.entries(testResults).forEach(([category, tests]) => {
    if (typeof tests === 'object' && tests !== testResults.overall) {
      Object.entries(tests).forEach(([testName, result]) => {
        if (!result.passed) {
          console.log(`   ❌ ${category}: ${testName} - ${result.details}`);
        }
      });
    }
  });
}

// Next Steps
console.log('\n🚀 NEXT STEPS');
console.log('=============');
console.log('1. If tests passed: Enable automation in Admin Dashboard');
console.log('2. Monitor workflow logs for successful execution');
console.log('3. Check email delivery statistics');
console.log('4. Wait for next lottery day for automatic operation');

// Store results for later access
window.testResults = testResults;
console.log('\n💾 Test results stored in window.testResults for detailed review');

console.log('\n🏁 AUTOMATION SYSTEM TEST COMPLETED');
console.log('===================================');
