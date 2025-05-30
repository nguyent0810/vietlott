import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  LotteryResult, 
  UserPrediction, 
  AppSettings, 
  NotificationSettings,
  STORAGE_KEYS,
  LotteryType 
} from '../types/lottery';

class StorageService {
  // Generic storage methods
  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  }

  private async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  private async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  // App Settings
  async getAppSettings(): Promise<AppSettings> {
    const settings = await this.getItem<AppSettings>(STORAGE_KEYS.APP_SETTINGS);
    return settings || {
      preferredLotteryType: 'power655',
      notificationsEnabled: true,
      darkMode: false,
      autoRefresh: true,
      refreshInterval: 30,
      language: 'vi',
      biometricEnabled: false,
    };
  }

  async saveAppSettings(settings: AppSettings): Promise<void> {
    await this.setItem(STORAGE_KEYS.APP_SETTINGS, settings);
  }

  // Notification Settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    const settings = await this.getItem<NotificationSettings>(STORAGE_KEYS.NOTIFICATION_SETTINGS);
    return settings || {
      newResults: true,
      predictionUpdates: true,
      weeklyAnalysis: true,
      soundEnabled: true,
      vibrationEnabled: true,
    };
  }

  async saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    await this.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }

  // User Predictions
  async getUserPredictions(): Promise<UserPrediction[]> {
    const predictions = await this.getItem<UserPrediction[]>(STORAGE_KEYS.USER_PREDICTIONS);
    return predictions || [];
  }

  async savePrediction(prediction: UserPrediction): Promise<void> {
    const predictions = await this.getUserPredictions();
    predictions.unshift(prediction); // Add to beginning
    
    // Keep only last 100 predictions
    const trimmed = predictions.slice(0, 100);
    await this.setItem(STORAGE_KEYS.USER_PREDICTIONS, trimmed);
  }

  async updatePrediction(predictionId: string, updates: Partial<UserPrediction>): Promise<void> {
    const predictions = await this.getUserPredictions();
    const index = predictions.findIndex(p => p.id === predictionId);
    
    if (index !== -1) {
      predictions[index] = { ...predictions[index], ...updates };
      await this.setItem(STORAGE_KEYS.USER_PREDICTIONS, predictions);
    }
  }

  async deletePrediction(predictionId: string): Promise<void> {
    const predictions = await this.getUserPredictions();
    const filtered = predictions.filter(p => p.id !== predictionId);
    await this.setItem(STORAGE_KEYS.USER_PREDICTIONS, filtered);
  }

  // Cached Results
  async getCachedResults(lotteryType: LotteryType): Promise<LotteryResult[]> {
    const cacheKey = `${STORAGE_KEYS.CACHED_RESULTS}_${lotteryType}`;
    const cached = await this.getItem<{
      data: LotteryResult[];
      timestamp: number;
    }>(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    
    return [];
  }

  async saveCachedResults(lotteryType: LotteryType, results: LotteryResult[]): Promise<void> {
    const cacheKey = `${STORAGE_KEYS.CACHED_RESULTS}_${lotteryType}`;
    await this.setItem(cacheKey, {
      data: results,
      timestamp: Date.now(),
    });
  }

  // Last Sync Time
  async getLastSync(): Promise<Date | null> {
    const timestamp = await this.getItem<number>(STORAGE_KEYS.LAST_SYNC);
    return timestamp ? new Date(timestamp) : null;
  }

  async updateLastSync(): Promise<void> {
    await this.setItem(STORAGE_KEYS.LAST_SYNC, Date.now());
  }

  // Algorithm Performance Tracking
  async getAlgorithmPerformance(): Promise<Record<string, {
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number;
    lastUpdated: string;
  }>> {
    const performance = await this.getItem<Record<string, any>>(STORAGE_KEYS.ALGORITHM_PERFORMANCE);
    return performance || {};
  }

  async updateAlgorithmPerformance(
    algorithmId: string, 
    isCorrect: boolean
  ): Promise<void> {
    const performance = await this.getAlgorithmPerformance();
    
    if (!performance[algorithmId]) {
      performance[algorithmId] = {
        totalPredictions: 0,
        correctPredictions: 0,
        accuracy: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    
    performance[algorithmId].totalPredictions++;
    if (isCorrect) {
      performance[algorithmId].correctPredictions++;
    }
    
    performance[algorithmId].accuracy = 
      (performance[algorithmId].correctPredictions / performance[algorithmId].totalPredictions) * 100;
    performance[algorithmId].lastUpdated = new Date().toISOString();
    
    await this.setItem(STORAGE_KEYS.ALGORITHM_PERFORMANCE, performance);
  }

  // Utility methods
  private isCacheValid(timestamp: number, maxAge: number = 30 * 60 * 1000): boolean {
    return Date.now() - timestamp < maxAge; // 30 minutes default
  }

  // Clear all data (for logout or reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_PREDICTIONS,
        STORAGE_KEYS.CACHED_RESULTS + '_power655',
        STORAGE_KEYS.CACHED_RESULTS + '_mega645',
        STORAGE_KEYS.LAST_SYNC,
        STORAGE_KEYS.ALGORITHM_PERFORMANCE,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Export data for backup
  async exportUserData(): Promise<{
    predictions: UserPrediction[];
    settings: AppSettings;
    notificationSettings: NotificationSettings;
    algorithmPerformance: Record<string, any>;
  }> {
    const [predictions, settings, notificationSettings, algorithmPerformance] = await Promise.all([
      this.getUserPredictions(),
      this.getAppSettings(),
      this.getNotificationSettings(),
      this.getAlgorithmPerformance(),
    ]);

    return {
      predictions,
      settings,
      notificationSettings,
      algorithmPerformance,
    };
  }

  // Import data from backup
  async importUserData(data: {
    predictions?: UserPrediction[];
    settings?: AppSettings;
    notificationSettings?: NotificationSettings;
    algorithmPerformance?: Record<string, any>;
  }): Promise<void> {
    const promises: Promise<void>[] = [];

    if (data.predictions) {
      promises.push(this.setItem(STORAGE_KEYS.USER_PREDICTIONS, data.predictions));
    }
    if (data.settings) {
      promises.push(this.setItem(STORAGE_KEYS.APP_SETTINGS, data.settings));
    }
    if (data.notificationSettings) {
      promises.push(this.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, data.notificationSettings));
    }
    if (data.algorithmPerformance) {
      promises.push(this.setItem(STORAGE_KEYS.ALGORITHM_PERFORMANCE, data.algorithmPerformance));
    }

    await Promise.all(promises);
  }

  // Get storage usage info
  async getStorageInfo(): Promise<{
    totalKeys: number;
    estimatedSize: string;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => 
        Object.values(STORAGE_KEYS).some(storageKey => 
          key.includes(storageKey)
        )
      );

      // Estimate size (rough calculation)
      let totalSize = 0;
      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      const sizeInKB = (totalSize / 1024).toFixed(2);
      
      return {
        totalKeys: appKeys.length,
        estimatedSize: `${sizeInKB} KB`,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        totalKeys: 0,
        estimatedSize: '0 KB',
      };
    }
  }
}

export default new StorageService();
