import { emailNotificationService } from './emailNotificationService';
import { automatedSchedulerService } from './automatedSchedulerService';

export const startupServices = () => {
  // Initialize email service
  const smtpUser = localStorage.getItem('smtpUser') || import.meta.env.VITE_SMTP_USER || '';
  const smtpPassword = localStorage.getItem('smtpPassword') || import.meta.env.VITE_SMTP_PASSWORD || '';

  const emailConfig = {
    smtpHost: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
    smtpSecure: false,
    smtpUser,
    smtpPassword,
    fromEmail: import.meta.env.VITE_FROM_EMAIL || 'noreply@vietlott-ai.com',
    fromName: import.meta.env.VITE_FROM_NAME || 'Vietlott AI Predictor'
  };

  if (emailConfig.smtpUser && emailConfig.smtpPassword) {
    emailNotificationService.initialize(emailConfig);
    console.log('✅ Email service initialized');
  } else {
    console.log('⚠️ Email service not initialized - missing SMTP credentials');
  }

  // Initialize automation scheduler
  automatedSchedulerService.initialize({
    enabled: false,
    analysisTime: '08:00',
    predictionTime: '10:00',
    emailTime: '12:00',
    timezone: 'Asia/Ho_Chi_Minh',
    retryAttempts: 3,
    retryDelay: 30
  });
};
