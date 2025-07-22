import { LotteryType } from '../types.ts';
import { lotteryScheduleService } from './lotteryScheduleService.ts';
import { lotteryDataService } from './lotteryDataService.ts';
import { predictionAnalysisService } from './predictionAnalysisService.ts';
import { enhancedPredictionService } from './enhancedPredictionService.ts';
import { emailNotificationService } from './emailNotificationService.ts';

/**
 * Automated Scheduler Service
 * Manages the daily automation workflow for lottery predictions and email notifications
 */

export interface AutomationTask {
  id: string;
  type: 'analysis' | 'prediction' | 'email' | 'data_refresh';
  lotteryType?: LotteryType;
  scheduledTime: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  lastRun?: string;
  nextRun?: string;
  error?: string;
  result?: any;
}

export interface AutomationConfig {
  enabled: boolean;
  analysisTime: string; // HH:MM format - when to analyze previous results
  predictionTime: string; // HH:MM format - when to generate predictions
  emailTime: string; // HH:MM format - when to send emails
  timezone: string;
  retryAttempts: number;
  retryDelay: number; // minutes
}

export interface DailyWorkflowResult {
  date: string;
  lotteryType: LotteryType;
  tasks: {
    dataRefresh: { success: boolean; error?: string };
    resultAnalysis: { success: boolean; accuracy?: any; error?: string };
    predictionGeneration: { success: boolean; prediction?: any; error?: string };
    emailDelivery: { success: boolean; sent: number; failed: number; error?: string };
  };
  totalDuration: number; // milliseconds
  success: boolean;
}

export class AutomatedSchedulerService {
  private config: AutomationConfig = {
    enabled: false,
    analysisTime: '08:00',
    predictionTime: '10:00',
    emailTime: '12:00',
    timezone: 'Asia/Ho_Chi_Minh',
    retryAttempts: 3,
    retryDelay: 30
  };

  private scheduledTasks: AutomationTask[] = [];
  private isRunning = false;
  private intervalId: number | null = null;

  /**
   * Initialize the automation service
   */
  initialize(config: Partial<AutomationConfig> = {}): void {
    this.config = { ...this.config, ...config };
    this.loadConfiguration();
    
    if (this.config.enabled) {
      this.start();
    }
  }

  /**
   * Start the automation scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.log('Automation scheduler is already running');
      return;
    }

    this.isRunning = true;
    console.log('🤖 Starting automated lottery prediction scheduler');

    // Check every minute for scheduled tasks
    this.intervalId = setInterval(() => {
      this.checkAndExecuteTasks();
    }, 60000) as unknown as number;

    // Schedule today's tasks if not already scheduled
    this.scheduleDailyTasks();
  }

  /**
   * Stop the automation scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('🛑 Stopped automated lottery prediction scheduler');
  }

  /**
   * Execute the complete daily workflow for a lottery type
   */
  async executeDailyWorkflow(lotteryType: LotteryType): Promise<DailyWorkflowResult> {
    const startTime = Date.now();
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`🚀 Starting daily workflow for ${lotteryType} on ${today}`);

    const result: DailyWorkflowResult = {
      date: today,
      lotteryType,
      tasks: {
        dataRefresh: { success: false },
        resultAnalysis: { success: false },
        predictionGeneration: { success: false },
        emailDelivery: { success: false, sent: 0, failed: 0 }
      },
      totalDuration: 0,
      success: false
    };

    try {
      // Step 1: Refresh lottery data
      console.log('📊 Refreshing lottery data...');
      result.tasks.dataRefresh = await this.executeDataRefresh(lotteryType);

      // Step 2: Analyze previous results (if available)
      console.log('🔍 Analyzing previous results...');
      result.tasks.resultAnalysis = await this.executeResultAnalysis(lotteryType);

      // Step 3: Generate new prediction
      console.log('🎯 Generating new prediction...');
      result.tasks.predictionGeneration = await this.executePredictionGeneration(lotteryType);

      // Step 4: Send email notifications
      if (result.tasks.predictionGeneration.success) {
        console.log('📧 Sending email notifications...');
        result.tasks.emailDelivery = await this.executeEmailDelivery(
          lotteryType, 
          result.tasks.predictionGeneration.prediction
        );
      }

      // Calculate overall success
      result.success = result.tasks.dataRefresh.success && 
                      result.tasks.predictionGeneration.success;

    } catch (error) {
      console.error('❌ Daily workflow failed:', error);
      result.success = false;
    }

    result.totalDuration = Date.now() - startTime;
    
    console.log(`✅ Daily workflow completed for ${lotteryType} in ${result.totalDuration}ms`);
    this.logWorkflowResult(result);

    return result;
  }

  /**
   * Schedule daily tasks based on lottery schedule
   */
  scheduleDailyTasks(): void {
    const today = new Date();
    const schedule = lotteryScheduleService.getScheduleForDate(today);

    if (!schedule.hasDraws) {
      console.log('📅 No lottery draws scheduled for today');
      return;
    }

    for (const lottery of schedule.lotteries) {
      this.scheduleTasksForLottery(lottery.lotteryType, today);
    }
  }

  /**
   * Schedule tasks for a specific lottery type
   */
  private scheduleTasksForLottery(lotteryType: LotteryType, date: Date): void {
    const dateStr = date.toISOString().split('T')[0];

    // Schedule analysis task (morning)
    this.addTask({
      id: `analysis_${lotteryType}_${dateStr}`,
      type: 'analysis',
      lotteryType,
      scheduledTime: this.config.analysisTime,
      status: 'pending'
    });

    // Schedule prediction task
    this.addTask({
      id: `prediction_${lotteryType}_${dateStr}`,
      type: 'prediction',
      lotteryType,
      scheduledTime: this.config.predictionTime,
      status: 'pending'
    });

    // Schedule email task
    this.addTask({
      id: `email_${lotteryType}_${dateStr}`,
      type: 'email',
      lotteryType,
      scheduledTime: this.config.emailTime,
      status: 'pending'
    });

    console.log(`📋 Scheduled tasks for ${lotteryType} on ${dateStr}`);
  }

  /**
   * Check and execute pending tasks
   */
  private async checkAndExecuteTasks(): Promise<void> {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const pendingTasks = this.scheduledTasks.filter(task => 
      task.status === 'pending' && 
      task.scheduledTime <= currentTime
    );

    for (const task of pendingTasks) {
      await this.executeTask(task);
    }
  }

  /**
   * Execute a specific task
   */
  private async executeTask(task: AutomationTask): Promise<void> {
    task.status = 'running';
    task.lastRun = new Date().toISOString();

    try {
      console.log(`🔄 Executing task: ${task.id}`);

      switch (task.type) {
        case 'analysis':
          if (task.lotteryType) {
            task.result = await this.executeResultAnalysis(task.lotteryType);
          }
          break;
        case 'prediction':
          if (task.lotteryType) {
            task.result = await this.executePredictionGeneration(task.lotteryType);
          }
          break;
        case 'email':
          if (task.lotteryType) {
            // Find the prediction from earlier task
            const predictionTask = this.scheduledTasks.find(t => 
              t.type === 'prediction' && 
              t.lotteryType === task.lotteryType && 
              t.status === 'completed'
            );
            
            if (predictionTask?.result?.prediction) {
              task.result = await this.executeEmailDelivery(task.lotteryType, predictionTask.result.prediction);
            }
          }
          break;
        case 'data_refresh':
          if (task.lotteryType) {
            task.result = await this.executeDataRefresh(task.lotteryType);
          }
          break;
      }

      task.status = 'completed';
      console.log(`✅ Task completed: ${task.id}`);

    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Task failed: ${task.id}`, error);
    }

    this.saveTasks();
  }

  /**
   * Execute data refresh task
   */
  private async executeDataRefresh(lotteryType: LotteryType): Promise<any> {
    try {
      await lotteryDataService.refreshData(lotteryType, 100);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Execute result analysis task
   */
  private async executeResultAnalysis(lotteryType: LotteryType): Promise<any> {
    try {
      predictionAnalysisService.loadAccuracyHistory();
      const metrics = predictionAnalysisService.getAccuracyMetrics();
      const insights = predictionAnalysisService.generateInsights(lotteryType);
      
      return { 
        success: true, 
        accuracy: metrics,
        insights: insights.length 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Execute prediction generation task
   */
  private async executePredictionGeneration(lotteryType: LotteryType): Promise<any> {
    try {
      const prediction = await enhancedPredictionService.generateEnhancedPrediction(lotteryType);
      
      return { 
        success: true, 
        prediction,
        confidence: prediction.confidence 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Execute email delivery task
   */
  private async executeEmailDelivery(lotteryType: LotteryType, prediction: any): Promise<any> {
    try {
      const results = await emailNotificationService.sendDailyPredictions(lotteryType, prediction);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      return { 
        success: true, 
        sent: successful,
        failed: failed,
        totalRecipients: results.length 
      };
    } catch (error) {
      return { 
        success: false, 
        sent: 0,
        failed: 0,
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Add a new task to the schedule
   */
  private addTask(task: Omit<AutomationTask, 'nextRun'>): void {
    const existingIndex = this.scheduledTasks.findIndex(t => t.id === task.id);
    
    if (existingIndex !== -1) {
      this.scheduledTasks[existingIndex] = { ...task, nextRun: this.calculateNextRun(task.scheduledTime) };
    } else {
      this.scheduledTasks.push({ ...task, nextRun: this.calculateNextRun(task.scheduledTime) });
    }
    
    this.saveTasks();
  }

  /**
   * Calculate next run time for a task
   */
  private calculateNextRun(scheduledTime: string): string {
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    
    const nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun.toISOString();
  }

  /**
   * Get automation status
   */
  getStatus(): {
    isRunning: boolean;
    config: AutomationConfig;
    pendingTasks: number;
    completedTasks: number;
    failedTasks: number;
    nextTask?: AutomationTask;
  } {
    const pending = this.scheduledTasks.filter(t => t.status === 'pending').length;
    const completed = this.scheduledTasks.filter(t => t.status === 'completed').length;
    const failed = this.scheduledTasks.filter(t => t.status === 'failed').length;
    
    const nextTask = this.scheduledTasks
      .filter(t => t.status === 'pending')
      .sort((a, b) => (a.nextRun || '').localeCompare(b.nextRun || ''))[0];

    return {
      isRunning: this.isRunning,
      config: this.config,
      pendingTasks: pending,
      completedTasks: completed,
      failedTasks: failed,
      nextTask
    };
  }

  /**
   * Update automation configuration
   */
  updateConfig(updates: Partial<AutomationConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfiguration();
    
    if (updates.enabled !== undefined) {
      if (updates.enabled && !this.isRunning) {
        this.start();
      } else if (!updates.enabled && this.isRunning) {
        this.stop();
      }
    }
  }

  /**
   * Log workflow result
   */
  private logWorkflowResult(result: DailyWorkflowResult): void {
    try {
      const logs = this.getWorkflowLogs();
      logs.push(result);
      
      // Keep only last 30 days of logs
      const filtered = logs.slice(-30);
      localStorage.setItem('automationWorkflowLogs', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to log workflow result:', error);
    }
  }

  /**
   * Get workflow logs
   */
  getWorkflowLogs(): DailyWorkflowResult[] {
    try {
      const stored = localStorage.getItem('automationWorkflowLogs');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load workflow logs:', error);
      return [];
    }
  }

  /**
   * Load configuration from storage
   */
  private loadConfiguration(): void {
    try {
      const stored = localStorage.getItem('automationConfig');
      if (stored) {
        this.config = { ...this.config, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load automation config:', error);
    }
  }

  /**
   * Save configuration to storage
   */
  private saveConfiguration(): void {
    try {
      localStorage.setItem('automationConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save automation config:', error);
    }
  }

  /**
   * Load tasks from storage
   */
  private loadTasks(): void {
    try {
      const stored = localStorage.getItem('automationTasks');
      if (stored) {
        this.scheduledTasks = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load automation tasks:', error);
      this.scheduledTasks = [];
    }
  }

  /**
   * Save tasks to storage
   */
  private saveTasks(): void {
    try {
      localStorage.setItem('automationTasks', JSON.stringify(this.scheduledTasks));
    } catch (error) {
      console.error('Failed to save automation tasks:', error);
    }
  }
}

// Export singleton instance
export const automatedSchedulerService = new AutomatedSchedulerService();
