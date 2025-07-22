/**
 * Automation Setup Script
 * Run this script to configure the automated lottery system
 */

// Check if running in browser environment
if (typeof window !== 'undefined') {
  console.log('🤖 Vietlott AI Predictor - Automation Setup');
  console.log('==========================================');

  // Configuration object
  const automationConfig = {
    email: {
      enabled: false,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpSecure: false,
      fromEmail: 'noreply@vietlott-ai.com',
      fromName: 'Vietlott AI Predictor'
    },
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

  // Setup functions
  window.setupAutomation = {
    
    // Configure email settings
    configureEmail: function(smtpUser, smtpPassword) {
      if (!smtpUser || !smtpPassword) {
        console.error('❌ SMTP credentials required');
        return false;
      }

      // Store credentials securely (in production, use proper encryption)
      localStorage.setItem('smtpUser', smtpUser);
      localStorage.setItem('smtpPassword', smtpPassword);
      
      automationConfig.email.enabled = true;
      localStorage.setItem('automationConfig', JSON.stringify(automationConfig));
      
      console.log('✅ Email configuration saved');
      return true;
    },

    // Enable automation
    enableAutomation: function() {
      const config = JSON.parse(localStorage.getItem('automationConfig') || '{}');
      config.automation = { ...automationConfig.automation, enabled: true };
      localStorage.setItem('automationConfig', JSON.stringify(config));
      
      console.log('✅ Automation enabled');
      return true;
    },

    // Test email configuration
    testEmail: async function() {
      const smtpUser = localStorage.getItem('smtpUser');
      const smtpPassword = localStorage.getItem('smtpPassword');
      
      if (!smtpUser || !smtpPassword) {
        console.error('❌ Email not configured. Run configureEmail() first.');
        return false;
      }

      console.log('📧 Testing email configuration...');
      console.log('✅ Email test completed (simulated)');
      return true;
    },

    // Get current configuration
    getConfig: function() {
      const config = JSON.parse(localStorage.getItem('automationConfig') || '{}');
      console.log('Current Configuration:', config);
      return config;
    },

    // Reset configuration
    reset: function() {
      localStorage.removeItem('automationConfig');
      localStorage.removeItem('smtpUser');
      localStorage.removeItem('smtpPassword');
      console.log('🔄 Configuration reset');
    },

    // Quick setup wizard
    quickSetup: function(email, password, geminiKey) {
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

      console.log('🎉 Quick setup completed!');
      console.log('📋 Next steps:');
      console.log('   1. Open Admin Dashboard in the app');
      console.log('   2. Start automation');
      console.log('   3. Add email subscribers');
      
      return true;
    }
  };

  // Display setup instructions
  console.log('📋 Setup Instructions:');
  console.log('');
  console.log('1. Quick Setup (recommended):');
  console.log('   setupAutomation.quickSetup("your-email@gmail.com", "app-password", "gemini-key")');
  console.log('');
  console.log('2. Manual Setup:');
  console.log('   setupAutomation.configureEmail("your-email@gmail.com", "app-password")');
  console.log('   setupAutomation.enableAutomation()');
  console.log('');
  console.log('3. Test Configuration:');
  console.log('   setupAutomation.testEmail()');
  console.log('   setupAutomation.getConfig()');
  console.log('');
  console.log('4. Reset if needed:');
  console.log('   setupAutomation.reset()');
  console.log('');
  console.log('📧 Gmail Setup:');
  console.log('   1. Enable 2-Factor Authentication');
  console.log('   2. Generate App Password (16 characters)');
  console.log('   3. Use app password, not your regular password');
  console.log('');
  console.log('🔑 Gemini API Key:');
  console.log('   Get from: https://makersuite.google.com/app/apikey');

} else {
  // Node.js environment setup
  console.log('Node.js environment detected');
  console.log('Use the browser console for interactive setup');
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    automationConfig: {
      email: {
        enabled: false,
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpSecure: false,
        fromEmail: 'noreply@vietlott-ai.com',
        fromName: 'Vietlott AI Predictor'
      },
      automation: {
        enabled: false,
        analysisTime: '08:00',
        predictionTime: '10:00',
        emailTime: '12:00',
        timezone: 'Asia/Ho_Chi_Minh',
        retryAttempts: 3,
        retryDelay: 30
      }
    }
  };
}
