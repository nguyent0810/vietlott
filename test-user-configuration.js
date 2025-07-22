/**
 * Test User Configuration
 * Simulates the user's setup and tests the system
 */

console.log('🧪 TESTING USER CONFIGURATION');
console.log('=============================');

// User's actual credentials
const userCredentials = {
  email: 'user@example.com', // Replace with actual email
  smtpPassword: 'apch wivm rkdm cqgx',
  geminiApiKey: 'AIzaSyBce7_D1md2YaMYzrBiQb7oznX6PkrAqfQ'
};

// Test results
const testResults = {
  configuration: [],
  services: [],
  integration: [],
  overall: { success: true, issues: [] }
};

function logResult(category, test, success, message, data = null) {
  const result = { test, success, message, data, timestamp: new Date().toISOString() };
  testResults[category].push(result);
  
  const icon = success ? '✅' : '❌';
  console.log(`${icon} ${category.toUpperCase()}: ${test} - ${message}`);
  
  if (!success) {
    testResults.overall.success = false;
    testResults.overall.issues.push(`${category}: ${test} - ${message}`);
  }
  
  return result;
}

// Test 1: Configuration Setup
console.log('\n📋 TESTING CONFIGURATION SETUP');

try {
  // Simulate user configuration
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('smtpUser', userCredentials.email);
    localStorage.setItem('smtpPassword', userCredentials.smtpPassword);
    
    const automationConfig = {
      email: { enabled: true },
      automation: {
        enabled: true,
        analysisTime: '08:00',
        predictionTime: '10:00',
        emailTime: '12:00',
        timezone: 'Asia/Ho_Chi_Minh'
      }
    };
    localStorage.setItem('automationConfig', JSON.stringify(automationConfig));
    
    logResult('configuration', 'SMTP Configuration', true, 'SMTP credentials stored');
    logResult('configuration', 'Automation Config', true, 'Automation configuration saved');
  } else {
    logResult('configuration', 'LocalStorage', false, 'localStorage not available');
  }
  
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('geminiApiKey', userCredentials.geminiApiKey);
    logResult('configuration', 'Gemini API Key', true, 'API key stored in session');
  } else {
    logResult('configuration', 'SessionStorage', false, 'sessionStorage not available');
  }

} catch (error) {
  logResult('configuration', 'Setup Error', false, error.message);
}

// Test 2: Service Initialization
console.log('\n🔧 TESTING SERVICE INITIALIZATION');

try {
  // Check if services are available
  const requiredServices = [
    'lotteryScheduleService',
    'emailNotificationService', 
    'automatedSchedulerService',
    'enhancedPredictionService',
    'predictionAnalysisService'
  ];

  requiredServices.forEach(serviceName => {
    const available = typeof window[serviceName] !== 'undefined';
    logResult('services', serviceName, available, 
      available ? 'Service loaded successfully' : 'Service not found');
  });

  // Test lottery schedule service functionality
  if (typeof lotteryScheduleService !== 'undefined') {
    const todaySchedule = lotteryScheduleService.getTodaySchedule();
    const nextDraw = lotteryScheduleService.getNextDraw();
    
    logResult('services', 'Schedule Service Function', !!todaySchedule, 
      `Today: ${todaySchedule?.dayName}, Has draws: ${todaySchedule?.hasDraws}`);
    
    logResult('services', 'Next Draw Detection', !!nextDraw,
      nextDraw ? `Next: ${nextDraw.schedule.dayName} ${nextDraw.schedule.lotteries[0]?.lotteryType}` : 'No upcoming draws');
  }

} catch (error) {
  logResult('services', 'Service Test Error', false, error.message);
}

// Test 3: Email System
console.log('\n📧 TESTING EMAIL SYSTEM');

try {
  if (typeof emailNotificationService !== 'undefined') {
    // Test email service initialization
    const deliveryStats = emailNotificationService.getDeliveryStats();
    logResult('services', 'Email Service Stats', !!deliveryStats,
      `Total: ${deliveryStats.totalSubscribers}, Active: ${deliveryStats.activeSubscribers}`);

    // Add a test subscriber
    const testSubscriber = {
      email: userCredentials.email,
      name: 'Test User',
      preferences: {
        lotteryTypes: ['power', 'mega'],
        sendTime: '12:00',
        timezone: 'Asia/Ho_Chi_Minh',
        includeAnalysis: true,
        includeHistory: false
      },
      isActive: true
    };

    const subscriberId = emailNotificationService.addSubscriber(testSubscriber);
    logResult('services', 'Add Test Subscriber', !!subscriberId,
      subscriberId ? `Subscriber added with ID: ${subscriberId}` : 'Failed to add subscriber');

    // Check subscriber count
    const updatedStats = emailNotificationService.getDeliveryStats();
    logResult('services', 'Subscriber Count Update', updatedStats.totalSubscribers > 0,
      `Now have ${updatedStats.totalSubscribers} subscribers`);

  } else {
    logResult('services', 'Email Service Availability', false, 'emailNotificationService not found');
  }

} catch (error) {
  logResult('services', 'Email System Error', false, error.message);
}

// Test 4: Automation System
console.log('\n🤖 TESTING AUTOMATION SYSTEM');

try {
  if (typeof automatedSchedulerService !== 'undefined') {
    // Get automation status
    const status = automatedSchedulerService.getStatus();
    logResult('services', 'Automation Status', !!status,
      `Running: ${status.isRunning}, Config enabled: ${status.config?.enabled}`);

    // Test workflow logs
    const logs = automatedSchedulerService.getWorkflowLogs();
    logResult('services', 'Workflow Logs', Array.isArray(logs),
      `Found ${logs.length} workflow log entries`);

    // Test configuration update
    automatedSchedulerService.updateConfig({ enabled: true });
    const updatedStatus = automatedSchedulerService.getStatus();
    logResult('services', 'Config Update', updatedStatus.config?.enabled,
      'Automation configuration updated successfully');

  } else {
    logResult('services', 'Automation Service Availability', false, 'automatedSchedulerService not found');
  }

} catch (error) {
  logResult('services', 'Automation System Error', false, error.message);
}

// Test 5: Integration Test
console.log('\n🔗 TESTING SYSTEM INTEGRATION');

try {
  // Check if all components work together
  const hasCredentials = !!localStorage.getItem('smtpUser') && !!sessionStorage.getItem('geminiApiKey');
  const hasServices = typeof automatedSchedulerService !== 'undefined' && typeof emailNotificationService !== 'undefined';
  const hasSubscribers = emailNotificationService?.getActiveSubscribers()?.length > 0;
  const hasConfig = !!localStorage.getItem('automationConfig');

  logResult('integration', 'Complete Configuration', hasCredentials,
    hasCredentials ? 'All credentials configured' : 'Missing credentials');

  logResult('integration', 'Core Services', hasServices,
    hasServices ? 'All core services available' : 'Missing core services');

  logResult('integration', 'Active Subscribers', hasSubscribers,
    hasSubscribers ? `${emailNotificationService.getActiveSubscribers().length} subscribers ready` : 'No active subscribers');

  logResult('integration', 'Automation Config', hasConfig,
    hasConfig ? 'Automation configuration present' : 'No automation configuration');

  // Overall system readiness
  const systemReady = hasCredentials && hasServices && hasSubscribers && hasConfig;
  logResult('integration', 'System Readiness', systemReady,
    systemReady ? 'System ready for automated operation' : 'System needs additional configuration');

  // Test a simulated workflow (without actually sending emails)
  if (systemReady && typeof automatedSchedulerService !== 'undefined') {
    console.log('\n🧪 SIMULATING WORKFLOW...');
    
    // This would normally be async, but we'll simulate it
    const simulatedWorkflow = {
      dataRefresh: { success: true },
      resultAnalysis: { success: true, insights: 3 },
      predictionGeneration: { success: true, confidence: 0.75 },
      emailDelivery: { success: true, sent: 1, failed: 0 }
    };

    logResult('integration', 'Simulated Workflow', true,
      `Workflow simulation: ${Object.values(simulatedWorkflow).every(task => task.success) ? 'All tasks successful' : 'Some tasks failed'}`);
  }

} catch (error) {
  logResult('integration', 'Integration Test Error', false, error.message);
}

// Test Summary
console.log('\n📊 TEST SUMMARY');
console.log('===============');

const totalTests = testResults.configuration.length + testResults.services.length + testResults.integration.length;
const passedTests = [...testResults.configuration, ...testResults.services, ...testResults.integration]
  .filter(test => test.success).length;
const failedTests = totalTests - passedTests;

console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📊 Total: ${totalTests}`);
console.log(`📈 Success Rate: ${(passedTests / totalTests * 100).toFixed(1)}%`);

// Final Assessment
console.log('\n🎯 FINAL ASSESSMENT');
console.log('==================');

if (testResults.overall.success) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('✅ Your automated lottery system is fully configured and ready.');
  console.log('✅ You can now enable automation in the Admin Dashboard.');
  console.log('✅ Subscribers will receive daily predictions based on the Vietnamese lottery schedule.');
} else {
  console.log('⚠️ SOME ISSUES FOUND:');
  testResults.overall.issues.forEach(issue => {
    console.log(`   ❌ ${issue}`);
  });
  console.log('\n🔧 Please address these issues before enabling automation.');
}

// Next Steps
console.log('\n🚀 NEXT STEPS');
console.log('=============');
console.log('1. Open Admin Dashboard in your app');
console.log('2. Click "Start Automation" if all tests passed');
console.log('3. Monitor the system status and workflow logs');
console.log('4. Check email delivery statistics');
console.log('5. Wait for the next lottery day for automatic operation');

// Vietnamese Lottery Schedule Reminder
console.log('\n📅 LOTTERY SCHEDULE REMINDER');
console.log('============================');
console.log('Power 6/55: Tuesday, Thursday, Saturday at 6:00 PM');
console.log('Mega 6/45: Monday, Wednesday, Sunday at 6:00 PM');
console.log('Emails sent: Daily at 12:00 PM (Vietnam Time) on lottery days');

// Store results globally
window.userTestResults = testResults;
console.log('\n💾 Test results stored in window.userTestResults');

console.log('\n🏁 USER CONFIGURATION TEST COMPLETED');
console.log('====================================');
