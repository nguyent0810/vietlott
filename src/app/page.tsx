"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Database, RefreshCw } from "lucide-react";
import LotteryTypeSelector from "@/components/LotteryTypeSelector";
import LatestResults from "@/components/LatestResults";
import StatisticsChart from "@/components/StatisticsChart";
import NumberSuggestion from "@/components/NumberSuggestion";
import HistoricalData from "@/components/HistoricalData";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import { LotteryResult, LotteryType } from "@/types/lottery";
import { LotteryDataService } from "@/services/LotteryDataService";
import { LotteryConfigService } from "@/services/LotteryConfigService";

export default function Home() {
  const [lotteryData, setLotteryData] = useState<LotteryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLotteryType, setCurrentLotteryType] =
    useState<LotteryType>("power655");

  const dataService = LotteryDataService.getInstance();
  const configService = LotteryConfigService.getInstance();

  const fetchData = async (forceRefresh = false, lotteryType?: LotteryType) => {
    try {
      setLoading(!forceRefresh);
      setRefreshing(forceRefresh);
      setError(null);

      if (forceRefresh) {
        dataService.clearCache();
      }

      const typeToFetch = lotteryType || currentLotteryType;
      const response = await fetch(`/api/lottery-data?type=${typeToFetch}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLotteryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLotteryTypeChange = (newType: LotteryType) => {
    setCurrentLotteryType(newType);
    configService.setCurrentLotteryType(newType);
    fetchData(true, newType);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading lottery data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-red-500 text-6xl mb-4"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ⚠️
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => fetchData(true)}
            variant="primary"
            icon={<RefreshCw size={16} />}
            loading={refreshing}
          >
            Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <motion.header
        className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="mr-3 text-blue-600" size={32} />
                Vietlott Analyzer
              </motion.h1>
              <motion.p
                className="text-gray-600 mt-2 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                AI-powered analysis for Power 6/55 & Mega 6/45
              </motion.p>
            </div>
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Draws</p>
                <p className="text-2xl font-bold text-blue-600">
                  {lotteryData.length}
                </p>
              </div>
              <Button
                onClick={() => fetchData(true)}
                variant="secondary"
                size="sm"
                icon={<RefreshCw size={16} />}
                loading={refreshing}
              >
                Refresh Data
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lottery Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LotteryTypeSelector
            currentType={currentLotteryType}
            onTypeChange={handleLotteryTypeChange}
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LatestResults data={lotteryData} />
          <NumberSuggestion data={lotteryData} />
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <StatisticsChart data={lotteryData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <HistoricalData data={lotteryData} />
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-white/60 backdrop-blur-sm border-t border-white/20 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              ⚠️ This application is for educational and entertainment purposes
              only.
            </p>
            <p className="text-xs mt-1">
              Lottery numbers are random. Past results do not guarantee future
              outcomes. Please gamble responsibly.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
