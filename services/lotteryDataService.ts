import { LotteryType, DrawResult } from '../types.ts';
import { getInitialHistory } from './initialData.ts';
import { fetchRealLotteryData, isRealDataAvailable, getDataSourceInfo } from './vietlottApiService.ts';

/**
 * Enhanced lottery data service that provides both real and fallback data
 */
export class LotteryDataService {
  private cache: Map<string, { data: DrawResult[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Gets lottery data with real data as priority, fallback to initial data
   * @param lotteryType The type of lottery
   * @param useRealData Whether to attempt fetching real data (default: true)
   * @param limit Maximum number of results to return
   * @returns Promise<DrawResult[]>
   */
  async getLotteryData(
    lotteryType: LotteryType,
    useRealData: boolean = true,
    limit: number = 50
  ): Promise<DrawResult[]> {
    const cacheKey = `${lotteryType}_${useRealData}_${limit}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Using cached data for ${lotteryType}`);
      return cached.data;
    }

    let data: DrawResult[] = [];

    if (useRealData && isRealDataAvailable(lotteryType)) {
      try {
        console.log(`Attempting to fetch real data for ${lotteryType}`);
        data = await fetchRealLotteryData(lotteryType, limit);

        if (data.length > 0) {
          console.log(`✅ Successfully loaded ${data.length} real lottery results for ${lotteryType}`);
          this.cache.set(cacheKey, { data, timestamp: Date.now() });
          return data;
        }
      } catch (error) {
        console.warn(`⚠️ Failed to fetch real data for ${lotteryType}, falling back to initial data:`, error);
      }
    }

    // Fallback to initial data
    console.log(`Using fallback initial data for ${lotteryType}`);
    data = getInitialHistory(lotteryType).slice(0, limit);
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }

  /**
   * Forces a refresh of data from the real source
   */
  async refreshData(lotteryType: LotteryType, limit: number = 50): Promise<DrawResult[]> {
    // Clear cache for this lottery type
    const keys = Array.from(this.cache.keys()).filter(key => key.startsWith(lotteryType));
    keys.forEach(key => this.cache.delete(key));

    // Fetch fresh data
    return this.getLotteryData(lotteryType, true, limit);
  }

  /**
   * Gets data source information
   */
  getDataSourceInfo() {
    return getDataSourceInfo();
  }

  /**
   * Checks if real data is being used
   */
  async isUsingRealData(lotteryType: LotteryType): Promise<boolean> {
    if (!isRealDataAvailable(lotteryType)) {
      return false;
    }

    try {
      const data = await fetchRealLotteryData(lotteryType, 1);
      return data.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Clears all cached data
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Lottery data cache cleared');
  }

  /**
   * Gets cache statistics
   */
  getCacheStats() {
    return {
      entries: this.cache.size,
      keys: Array.from(this.cache.keys()),
      cacheDuration: this.CACHE_DURATION
    };
  }
}

// Export singleton instance
export const lotteryDataService = new LotteryDataService();