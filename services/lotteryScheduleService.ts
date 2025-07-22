import { LotteryType } from '../types';
import { LOTTERY_TYPES } from '../constants';

/**
 * Vietnamese Lottery Schedule Service
 * Manages the weekly schedule for Power 6/55 and Mega 6/45 lotteries
 */

export interface LotterySchedule {
  lotteryType: LotteryType;
  drawTime: string; // HH:MM format
  timezone: string;
}

export interface DailySchedule {
  date: string; // YYYY-MM-DD format
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  lotteries: LotterySchedule[];
  hasDraws: boolean;
}

/**
 * Vietnamese lottery schedule based on official Vietlott schedule
 * Power 6/55: Tuesday, Thursday, Saturday at 18:00 (GMT+7)
 * Mega 6/45: Monday, Wednesday, Sunday at 18:00 (GMT+7)
 */
const WEEKLY_SCHEDULE: Record<number, LotterySchedule[]> = {
  0: [{ lotteryType: LOTTERY_TYPES.MEGA, drawTime: '18:00', timezone: 'Asia/Ho_Chi_Minh' }], // Sunday
  1: [{ lotteryType: LOTTERY_TYPES.MEGA, drawTime: '18:00', timezone: 'Asia/Ho_Chi_Minh' }], // Monday
  2: [{ lotteryType: LOTTERY_TYPES.POWER, drawTime: '18:00', timezone: 'Asia/Ho_Chi_Minh' }], // Tuesday
  3: [{ lotteryType: LOTTERY_TYPES.MEGA, drawTime: '18:00', timezone: 'Asia/Ho_Chi_Minh' }], // Wednesday
  4: [{ lotteryType: LOTTERY_TYPES.POWER, drawTime: '18:00', timezone: 'Asia/Ho_Chi_Minh' }], // Thursday
  5: [], // Friday - No draws
  6: [{ lotteryType: LOTTERY_TYPES.POWER, drawTime: '18:00', timezone: 'Asia/Ho_Chi_Minh' }], // Saturday
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class LotteryScheduleService {
  /**
   * Get the lottery schedule for a specific date
   */
  getScheduleForDate(date: Date): DailySchedule {
    const dayOfWeek = date.getDay();
    const lotteries = WEEKLY_SCHEDULE[dayOfWeek] || [];
    
    return {
      date: this.formatDate(date),
      dayOfWeek,
      dayName: DAY_NAMES[dayOfWeek],
      lotteries: [...lotteries],
      hasDraws: lotteries.length > 0
    };
  }

  /**
   * Get today's lottery schedule
   */
  getTodaySchedule(): DailySchedule {
    return this.getScheduleForDate(new Date());
  }

  /**
   * Get tomorrow's lottery schedule
   */
  getTomorrowSchedule(): DailySchedule {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getScheduleForDate(tomorrow);
  }

  /**
   * Get the next lottery draw information
   */
  getNextDraw(): { date: Date; schedule: DailySchedule } | null {
    const today = new Date();
    
    // Check if there's a draw today that hasn't happened yet
    const todaySchedule = this.getTodaySchedule();
    if (todaySchedule.hasDraws) {
      const drawTime = this.getDrawDateTime(today, todaySchedule.lotteries[0].drawTime);
      if (drawTime > today) {
        return { date: today, schedule: todaySchedule };
      }
    }

    // Look for the next draw in the coming days
    for (let i = 1; i <= 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() + i);
      const schedule = this.getScheduleForDate(checkDate);
      
      if (schedule.hasDraws) {
        return { date: checkDate, schedule };
      }
    }

    return null;
  }

  /**
   * Get the previous lottery draw information
   */
  getPreviousDraw(): { date: Date; schedule: DailySchedule } | null {
    const today = new Date();
    
    // Check if there was a draw today that already happened
    const todaySchedule = this.getTodaySchedule();
    if (todaySchedule.hasDraws) {
      const drawTime = this.getDrawDateTime(today, todaySchedule.lotteries[0].drawTime);
      if (drawTime <= today) {
        return { date: today, schedule: todaySchedule };
      }
    }

    // Look for the previous draw in the past days
    for (let i = 1; i <= 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const schedule = this.getScheduleForDate(checkDate);
      
      if (schedule.hasDraws) {
        return { date: checkDate, schedule };
      }
    }

    return null;
  }

  /**
   * Check if a specific lottery type has a draw on a given date
   */
  hasDrawOnDate(date: Date, lotteryType: LotteryType): boolean {
    const schedule = this.getScheduleForDate(date);
    return schedule.lotteries.some(lottery => lottery.lotteryType === lotteryType);
  }

  /**
   * Get all draw dates for a specific lottery type in a date range
   */
  getDrawDatesInRange(startDate: Date, endDate: Date, lotteryType?: LotteryType): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const schedule = this.getScheduleForDate(current);
      
      if (schedule.hasDraws) {
        if (!lotteryType || schedule.lotteries.some(l => l.lotteryType === lotteryType)) {
          dates.push(new Date(current));
        }
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Get weekly schedule summary
   */
  getWeeklySchedule(): Record<string, LotterySchedule[]> {
    const schedule: Record<string, LotterySchedule[]> = {};
    
    DAY_NAMES.forEach((dayName, index) => {
      schedule[dayName] = WEEKLY_SCHEDULE[index] || [];
    });
    
    return schedule;
  }

  /**
   * Check if the current time is before the draw time for today
   */
  isBeforeDrawTime(drawTime: string = '18:00'): boolean {
    const now = new Date();
    const today = new Date();
    const [hours, minutes] = drawTime.split(':').map(Number);
    
    today.setHours(hours, minutes, 0, 0);
    
    return now < today;
  }

  /**
   * Get the exact draw date and time
   */
  private getDrawDateTime(date: Date, drawTime: string): Date {
    const [hours, minutes] = drawTime.split(':').map(Number);
    const drawDateTime = new Date(date);
    drawDateTime.setHours(hours, minutes, 0, 0);
    return drawDateTime;
  }

  /**
   * Format date as YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get time until next draw in milliseconds
   */
  getTimeUntilNextDraw(): number | null {
    const nextDraw = this.getNextDraw();
    if (!nextDraw) return null;
    
    const drawDateTime = this.getDrawDateTime(nextDraw.date, nextDraw.schedule.lotteries[0].drawTime);
    return drawDateTime.getTime() - Date.now();
  }

  /**
   * Get human-readable time until next draw
   */
  getTimeUntilNextDrawFormatted(): string | null {
    const timeMs = this.getTimeUntilNextDraw();
    if (!timeMs || timeMs <= 0) return null;
    
    const hours = Math.floor(timeMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h ${minutes}m`;
    }
    
    return `${hours}h ${minutes}m`;
  }
}

// Export singleton instance
export const lotteryScheduleService = new LotteryScheduleService();
