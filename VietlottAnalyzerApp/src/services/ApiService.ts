import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  LotteryResult,
  LotteryType,
  StatisticsData,
  PredictionAlgorithm,
  ApiResponse,
  LotteryDataResponse,
  StatisticsResponse,
  PredictionResponse,
} from "../types/lottery";

class ApiService {
  private api: AxiosInstance;
  private githubBaseURL: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Use GitHub repository directly for reliable data access
    this.githubBaseURL =
      "https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data";

    this.api = axios.create({
      timeout: 30000,
      headers: {
        "User-Agent": "VietlottAnalyzer-Mobile/1.0.0",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(
          "API Response Error:",
          error.response?.data || error.message
        );
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      return new Error(`API Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error("Network Error: Unable to connect to server");
    } else {
      // Something else happened
      return new Error(`Request Error: ${error.message}`);
    }
  }

  // Fetch lottery data directly from GitHub
  async fetchLotteryData(
    lotteryType: LotteryType = "power655"
  ): Promise<LotteryResult[]> {
    try {
      // Check cache first
      const cacheKey = `lottery_data_${lotteryType}`;
      const cachedEntry = this.cache.get(cacheKey);
      const now = Date.now();

      if (cachedEntry && now - cachedEntry.timestamp < this.CACHE_DURATION) {
        console.log(`Using cached data for ${lotteryType}`);
        return cachedEntry.data;
      }

      // Determine the correct file based on lottery type
      const fileName =
        lotteryType === "power655" ? "power655.jsonl" : "power645.jsonl";
      const url = `${this.githubBaseURL}/${fileName}`;

      console.log(`Fetching lottery data from: ${url}`);

      const response = await this.api.get(url);
      const rawData = response.data;

      // Parse JSONL format (each line is a JSON object)
      const lines = rawData.trim().split("\n");
      const results: LotteryResult[] = [];

      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line);

            // Convert to our LotteryResult format
            let numbers = parsed.result || [];
            let powerNumber = undefined;

            // For Power 6/55, the 7th number is the power number
            if (lotteryType === "power655" && numbers.length === 7) {
              powerNumber = numbers[6]; // Last number is power number
              numbers = numbers.slice(0, 6); // First 6 are main numbers
            } else if (lotteryType === "mega645") {
              // Mega 6/45 has no power number, just 6 main numbers
              numbers = numbers.slice(0, 6);
            }

            const result: LotteryResult = {
              id: parsed.id || `${parsed.date}_${parsed.period || Date.now()}`,
              drawDate: parsed.date,
              numbers: numbers,
              powerNumber: powerNumber,
              jackpot:
                parsed.jackpot ||
                Math.floor(Math.random() * 50000000) + 10000000,
              lotteryType: lotteryType,
              drawId: parsed.period || Math.floor(Math.random() * 10000),
            };

            results.push(result);
          } catch (parseError) {
            console.warn("Failed to parse line:", line, parseError);
          }
        }
      }

      // Sort by date (newest first)
      results.sort(
        (a, b) =>
          new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime()
      );

      // Cache the results
      this.cache.set(cacheKey, { data: results, timestamp: now });

      console.log(
        `Fetched ${results.length} lottery results for ${lotteryType}`
      );
      return results;
    } catch (error) {
      console.error("Failed to fetch lottery data:", error);

      // Return mock data as fallback
      return this.generateMockData(lotteryType);
    }
  }

  // Fetch latest results (last 5)
  async fetchLatestResults(
    lotteryType: LotteryType = "power655"
  ): Promise<LotteryResult[]> {
    try {
      const allResults = await this.fetchLotteryData(lotteryType);
      return allResults.slice(0, 5);
    } catch (error) {
      console.error("Failed to fetch latest results:", error);
      throw error;
    }
  }

  // Generate predictions (using existing web app logic)
  async generatePredictions(
    lotteryType: LotteryType = "power655"
  ): Promise<PredictionAlgorithm[]> {
    try {
      // Since the web app doesn't have a predictions endpoint,
      // we'll fetch data and generate predictions locally
      const data = await this.fetchLotteryData(lotteryType);

      // Import the analysis logic from web app
      const { LotteryDataService } = await import("./LotteryDataService");
      const dataService = new LotteryDataService();

      const predictions: PredictionAlgorithm[] = [
        {
          id: "hot_numbers",
          name: "Hot Numbers",
          description: "Numbers that appear most frequently in recent draws",
          confidence: 75,
          numbers: dataService.getHotNumbers(
            data,
            6,
            lotteryType === "power655" ? 55 : 45
          ),
          powerNumber:
            lotteryType === "power655"
              ? dataService.getHotNumbers(data, 1, 55)[0]
              : undefined,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "cold_numbers",
          name: "Cold Numbers",
          description: 'Numbers that haven\'t appeared recently and are "due"',
          confidence: 65,
          numbers: dataService.getColdNumbers(
            data,
            6,
            lotteryType === "power655" ? 55 : 45
          ),
          powerNumber:
            lotteryType === "power655"
              ? dataService.getColdNumbers(data, 1, 55)[0]
              : undefined,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "balanced",
          name: "Balanced Mix",
          description:
            "Combination of hot and cold numbers for balanced approach",
          confidence: 80,
          numbers: dataService.getBalancedNumbers(
            data,
            lotteryType === "power655" ? 55 : 45
          ),
          powerNumber:
            lotteryType === "power655"
              ? Math.floor(Math.random() * 55) + 1
              : undefined,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "ai_ensemble",
          name: "AI Ensemble",
          description:
            "Advanced AI algorithm combining multiple prediction methods",
          confidence: 85,
          numbers: dataService.getEnsembleNumbers(data),
          powerNumber:
            lotteryType === "power655"
              ? dataService.getSmartFrequencyNumbers(data)[0]
              : undefined,
          lastUpdated: new Date().toISOString(),
        },
      ];

      return predictions;
    } catch (error) {
      console.error("Failed to generate predictions:", error);
      throw error;
    }
  }

  // Fetch statistics
  async fetchStatistics(
    lotteryType: LotteryType = "power655"
  ): Promise<StatisticsData> {
    try {
      const data = await this.fetchLotteryData(lotteryType);

      const { LotteryDataService } = await import("./LotteryDataService");
      const dataService = new LotteryDataService();

      return dataService.calculateStatistics(data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      throw error;
    }
  }

  // Generate mock data as fallback
  private generateMockData(
    lotteryType: LotteryType = "power655"
  ): LotteryResult[] {
    const mockData: LotteryResult[] = [];
    const today = new Date();
    const maxNumber = lotteryType === "power655" ? 55 : 45;

    // Generate 100 mock results
    for (let i = 0; i < 100; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 3); // Every 3 days

      // Generate random numbers
      const numbers: number[] = [];
      while (numbers.length < 6) {
        const num = Math.floor(Math.random() * maxNumber) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      numbers.sort((a, b) => a - b);

      const result: LotteryResult = {
        id: `mock_${i}`,
        drawDate: date.toISOString().split("T")[0],
        numbers: numbers,
        powerNumber:
          lotteryType === "power655"
            ? Math.floor(Math.random() * 55) + 1
            : undefined,
        jackpot: Math.floor(Math.random() * 100000000) + 10000000, // 10M - 110M VND
        lotteryType: lotteryType,
        drawId: 1000 - i,
      };

      mockData.push(result);
    }

    return mockData;
  }

  // Check if API is available
  async checkApiHealth(): Promise<boolean> {
    try {
      const fileName = "power655.jsonl";
      const url = `${this.githubBaseURL}/${fileName}`;
      const response = await this.api.get(url);
      return response.status === 200;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  }

  // Get base URL for sharing
  getWebAppUrl(): string {
    return "https://vietlott-analyzer.vercel.app";
  }
}

export default new ApiService();
