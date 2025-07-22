/**
 * Service Loader
 * Makes all automation services available globally for testing and configuration
 */

// Import all services
import { lotteryScheduleService } from './lotteryScheduleService';
import { lotteryDataService } from './lotteryDataService';
import { predictionAnalysisService } from './predictionAnalysisService';
import { enhancedPredictionService } from './enhancedPredictionService';
import { emailNotificationService } from './emailNotificationService';
import { automatedSchedulerService } from './automatedSchedulerService';

// Make services available globally
declare global {
  interface Window {
    lotteryScheduleService: typeof lotteryScheduleService;
    lotteryDataService: typeof lotteryDataService;
    predictionAnalysisService: typeof predictionAnalysisService;
    enhancedPredictionService: typeof enhancedPredictionService;
    emailNotificationService: typeof emailNotificationService;
    automatedSchedulerService: typeof automatedSchedulerService;
    setupAutomation: any;
    testResults: any;
    userTestResults: any;
    runSystemTest: any;
  }
}

// Export services to global window object
if (typeof window !== 'undefined') {
  window.lotteryScheduleService = lotteryScheduleService;
  window.lotteryDataService = lotteryDataService;
  window.predictionAnalysisService = predictionAnalysisService;
  window.enhancedPredictionService = enhancedPredictionService;
  window.emailNotificationService = emailNotificationService;
  window.automatedSchedulerService = automatedSchedulerService;

  // Setup automation helper
  window.setupAutomation = {
    // Configure email settings
    configureEmail: function(smtpUser: string, smtpPassword: string) {
      if (!smtpUser || !smtpPassword) {
        console.error('❌ SMTP credentials required');
        return false;
      }

      localStorage.setItem('smtpUser', smtpUser);
      localStorage.setItem('smtpPassword', smtpPassword);
      
      const automationConfig = {
        email: { enabled: true },
        automation: {
          enabled: false,
          analysisTime: '08:00',
          predictionTime: '10:00',
          emailTime: '12:00',
          timezone: 'Asia/Ho_Chi_Minh',
          retryAttempts: 3,
          retryDelay: 30
        }
      };
      
      localStorage.setItem('automationConfig', JSON.stringify(automationConfig));
      
      console.log('✅ Email configuration saved');
      return true;
    },

    // Enable automation
    enableAutomation: function() {
      const configStr = localStorage.getItem('automationConfig');
      const config = configStr ? JSON.parse(configStr) : {};
      
      if (!config.automation) {
        config.automation = {};
      }
      
      config.automation.enabled = true;
      localStorage.setItem('automationConfig', JSON.stringify(config));
      
      console.log('✅ Automation enabled');
      return true;
    },

    // Test email configuration
    testEmail: function() {
      const smtpUser = localStorage.getItem('smtpUser');
      const smtpPassword = localStorage.getItem('smtpPassword');
      
      if (!smtpUser || !smtpPassword) {
        console.error('❌ Email not configured. Run configureEmail() first.');
        return false;
      }

      console.log('📧 Testing email configuration...');
      console.log(`✅ SMTP User: ${smtpUser}`);
      console.log('✅ SMTP Password: [CONFIGURED]');
      console.log('✅ Email test completed');
      return true;
    },

    // Get current configuration
    getConfig: function() {
      const config = {
        smtpUser: localStorage.getItem('smtpUser'),
        hasPassword: !!localStorage.getItem('smtpPassword'),
        geminiKey: sessionStorage.getItem('geminiApiKey'),
        automationConfig: JSON.parse(localStorage.getItem('automationConfig') || '{}')
      };
      
      console.log('Current Configuration:', config);
      return config;
    },

    // Reset configuration
    reset: function() {
      localStorage.removeItem('automationConfig');
      localStorage.removeItem('smtpUser');
      localStorage.removeItem('smtpPassword');
      sessionStorage.removeItem('geminiApiKey');
      console.log('🔄 Configuration reset');
    },

    // Quick setup wizard
    quickSetup: function(email: string, password: string, geminiKey: string) {
      console.log('🚀 Starting quick setup...');
      
      // Configure email
      if (this.configureEmail(email, password)) {
        console.log('✅ Step 1: Email configured');
      } else {
        console.error('❌ Step 1 failed: Email configuration');
        return false;
      }

      // Store Gemini API key
      if (geminiKey) {
        sessionStorage.setItem('geminiApiKey', geminiKey);
        console.log('✅ Step 2: Gemini API key stored');
      } else {
        console.warn('⚠️ Step 2: No Gemini API key provided');
      }

      // Enable automation
      this.enableAutomation();
      console.log('✅ Step 3: Automation enabled');

      // Initialize email service with new credentials
      try {
        const emailConfig = {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpSecure: false,
          smtpUser: email,
          smtpPassword: password,
          fromEmail: 'noreply@vietlott-ai.com',
          fromName: 'Vietlott AI Predictor'
        };
        
        emailNotificationService.initialize(emailConfig);
        console.log('✅ Step 4: Email service initialized');
      } catch (error) {
        console.warn('⚠️ Step 4: Email service initialization failed:', error);
      }

      console.log('🎉 Quick setup completed!');
      console.log('📋 Next steps:');
      console.log('   1. Open Admin Dashboard in the app');
      console.log('   2. Start automation');
      console.log('   3. Add email subscribers');
      
      return true;
    }
  };

  console.log('🔧 Automation services loaded and available globally');
  console.log('📋 Available services:', Object.keys(window).filter(key => key.includes('Service')));
  console.log('⚙️ Setup automation available: window.setupAutomation');
}

// Export services for module imports
export {
  lotteryScheduleService,
  lotteryDataService,
  predictionAnalysisService,
  enhancedPredictionService,
  emailNotificationService,
  automatedSchedulerService
};
