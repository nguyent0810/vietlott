import { LotteryType } from '../types.ts';
import { EnhancedPrediction } from './enhancedPredictionService.ts';
import { lotteryScheduleService } from './lotteryScheduleService.ts';

/**
 * Email Notification Service
 * Handles sending daily lottery predictions via email
 */

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  preferences: {
    lotteryTypes: LotteryType[];
    sendTime: string; // HH:MM format
    timezone: string;
    includeAnalysis: boolean;
    includeHistory: boolean;
  };
  subscriptionDate: string;
  isActive: boolean;
  lastEmailSent?: string;
}

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

export class EmailNotificationService {
  private subscribers: EmailSubscriber[] = [];
  private emailConfig: EmailConfig | null = null;

  /**
   * Initialize email service with configuration
   */
  initialize(config: EmailConfig): void {
    this.emailConfig = config;
    this.loadSubscribers();
  }

  /**
   * Send daily prediction email to all active subscribers
   */
  async sendDailyPredictions(
    lotteryType: LotteryType,
    prediction: EnhancedPrediction
  ): Promise<EmailDeliveryResult[]> {
    if (!this.emailConfig) {
      throw new Error('Email service not initialized');
    }

    const relevantSubscribers = this.subscribers.filter(sub => 
      sub.isActive && 
      sub.preferences.lotteryTypes.includes(lotteryType)
    );

    const results: EmailDeliveryResult[] = [];

    for (const subscriber of relevantSubscribers) {
      try {
        const template = this.generateEmailTemplate(subscriber, lotteryType, prediction);
        const result = await this.sendEmail(subscriber.email, template);
        
        if (result.success) {
          subscriber.lastEmailSent = new Date().toISOString();
        }
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }

    this.saveSubscribers();
    return results;
  }

  /**
   * Add a new subscriber
   */
  addSubscriber(subscriber: Omit<EmailSubscriber, 'id' | 'subscriptionDate'>): string {
    const id = this.generateSubscriberId();
    const newSubscriber: EmailSubscriber = {
      ...subscriber,
      id,
      subscriptionDate: new Date().toISOString()
    };

    this.subscribers.push(newSubscriber);
    this.saveSubscribers();
    
    return id;
  }

  /**
   * Remove a subscriber
   */
  removeSubscriber(subscriberId: string): boolean {
    const index = this.subscribers.findIndex(sub => sub.id === subscriberId);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
      this.saveSubscribers();
      return true;
    }
    return false;
  }

  /**
   * Update subscriber preferences
   */
  updateSubscriber(subscriberId: string, updates: Partial<EmailSubscriber>): boolean {
    const subscriber = this.subscribers.find(sub => sub.id === subscriberId);
    if (subscriber) {
      Object.assign(subscriber, updates);
      this.saveSubscribers();
      return true;
    }
    return false;
  }

  /**
   * Get subscriber by email
   */
  getSubscriberByEmail(email: string): EmailSubscriber | null {
    return this.subscribers.find(sub => sub.email === email) || null;
  }

  /**
   * Get all active subscribers
   */
  getActiveSubscribers(): EmailSubscriber[] {
    return this.subscribers.filter(sub => sub.isActive);
  }

  /**
   * Generate email template for prediction
   */
  private generateEmailTemplate(
    subscriber: EmailSubscriber,
    lotteryType: LotteryType,
    prediction: EnhancedPrediction
  ): EmailTemplate {
    const schedule = lotteryScheduleService.getTodaySchedule();
    const lotteryName = lotteryType === 'power' ? 'Power 6/55' : 'Mega 6/45';
    
    const subject = `🎯 ${lotteryName} Prediction for ${schedule.date}`;
    
    const htmlContent = this.generateHtmlContent(subscriber, lotteryType, prediction, schedule);
    const textContent = this.generateTextContent(subscriber, lotteryType, prediction, schedule);

    return { subject, htmlContent, textContent };
  }

  /**
   * Generate HTML email content
   */
  private generateHtmlContent(
    subscriber: EmailSubscriber,
    lotteryType: LotteryType,
    prediction: EnhancedPrediction,
    schedule: any
  ): string {
    const lotteryName = lotteryType === 'power' ? 'Power 6/55' : 'Mega 6/45';
    const numbers = prediction.numbers.join(' - ');
    const specialNumber = prediction.specialNumber ? ` | Special: ${prediction.specialNumber}` : '';
    const confidence = (prediction.confidence * 100).toFixed(0);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${lotteryName} Prediction</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .prediction-box { background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
        .numbers { font-size: 24px; font-weight: bold; color: #495057; margin: 10px 0; }
        .confidence { background: #28a745; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin: 10px 0; }
        .insights { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 15px 0; }
        .methodology { background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 5px; padding: 15px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px; }
        ul { text-align: left; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 ${lotteryName} Prediction</h1>
        <p>AI-Powered Lottery Prediction for ${schedule.date}</p>
    </div>

    <div class="prediction-box">
        <h2>Today's Numbers</h2>
        <div class="numbers">${numbers}${specialNumber}</div>
        <div class="confidence">Confidence: ${confidence}%</div>
        <p><strong>Draw Time:</strong> ${schedule.lotteries[0]?.drawTime || '18:00'} (Vietnam Time)</p>
    </div>

    ${subscriber.preferences.includeAnalysis ? `
    <div class="insights">
        <h3>📊 Statistical Insights</h3>
        <ul>
            ${prediction.insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
    </div>

    <div class="methodology">
        <h3>🔬 Prediction Methodology</h3>
        <ul>
            ${prediction.methodology.map(method => `<li>${method}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div style="text-align: center; margin: 20px 0;">
        <p><strong>Good luck! 🍀</strong></p>
        <p style="font-size: 12px; color: #6c757d;">
            Remember: Lottery is a game of chance. Please play responsibly.
        </p>
    </div>

    <div class="footer">
        <p>Vietlott AI Predictor | <a href="#unsubscribe">Unsubscribe</a></p>
        <p>This prediction is generated using AI and statistical analysis for entertainment purposes.</p>
    </div>
</body>
</html>`;
  }

  /**
   * Generate plain text email content
   */
  private generateTextContent(
    subscriber: EmailSubscriber,
    lotteryType: LotteryType,
    prediction: EnhancedPrediction,
    schedule: any
  ): string {
    const lotteryName = lotteryType === 'power' ? 'Power 6/55' : 'Mega 6/45';
    const numbers = prediction.numbers.join(' - ');
    const specialNumber = prediction.specialNumber ? ` | Special: ${prediction.specialNumber}` : '';
    const confidence = (prediction.confidence * 100).toFixed(0);

    let content = `
🎯 ${lotteryName} PREDICTION FOR ${schedule.date}

TODAY'S NUMBERS: ${numbers}${specialNumber}
CONFIDENCE: ${confidence}%
DRAW TIME: ${schedule.lotteries[0]?.drawTime || '18:00'} (Vietnam Time)

`;

    if (subscriber.preferences.includeAnalysis) {
      content += `
📊 STATISTICAL INSIGHTS:
${prediction.insights.map(insight => `• ${insight}`).join('\n')}

🔬 PREDICTION METHODOLOGY:
${prediction.methodology.map(method => `• ${method}`).join('\n')}

`;
    }

    content += `
Good luck! 🍀

Remember: Lottery is a game of chance. Please play responsibly.

---
Vietlott AI Predictor
This prediction is generated using AI and statistical analysis for entertainment purposes.
`;

    return content;
  }

  /**
   * Send email using configured SMTP
   */
  private async sendEmail(to: string, template: EmailTemplate): Promise<EmailDeliveryResult> {
    // This is a placeholder implementation
    // In a real application, you would use a service like:
    // - Nodemailer for SMTP
    // - SendGrid API
    // - AWS SES
    // - Mailgun API
    
    try {
      // Simulate email sending
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${template.subject}`);
      
      // For demo purposes, we'll simulate success
      // In production, replace this with actual email sending logic
      
      return {
        success: true,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate unique subscriber ID
   */
  private generateSubscriberId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load subscribers from storage
   */
  private loadSubscribers(): void {
    try {
      const stored = localStorage.getItem('emailSubscribers');
      if (stored) {
        this.subscribers = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load subscribers:', error);
      this.subscribers = [];
    }
  }

  /**
   * Save subscribers to storage
   */
  private saveSubscribers(): void {
    try {
      localStorage.setItem('emailSubscribers', JSON.stringify(this.subscribers));
    } catch (error) {
      console.error('Failed to save subscribers:', error);
    }
  }

  /**
   * Get email delivery statistics
   */
  getDeliveryStats(): {
    totalSubscribers: number;
    activeSubscribers: number;
    lastDeliveryDate?: string;
    deliveryRate: number;
  } {
    const active = this.getActiveSubscribers();
    const lastDelivery = active
      .map(sub => sub.lastEmailSent)
      .filter(date => date)
      .sort()
      .pop();

    return {
      totalSubscribers: this.subscribers.length,
      activeSubscribers: active.length,
      lastDeliveryDate: lastDelivery,
      deliveryRate: active.length > 0 ? 1.0 : 0 // Simplified for demo
    };
  }
}

// Export singleton instance
export const emailNotificationService = new EmailNotificationService();
