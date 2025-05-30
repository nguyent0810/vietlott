"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity, Eye } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { LotteryResult } from "@/types/lottery";
import { LotteryDataService } from "@/services/LotteryDataService";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsChartProps {
  data: LotteryResult[];
}

const StatisticsChart = memo(function StatisticsChart({
  data,
}: StatisticsChartProps) {
  const [chartType, setChartType] = useState<"frequency" | "trends">(
    "frequency"
  );
  const dataService = LotteryDataService.getInstance();

  // Memoize expensive calculations
  const statistics = useMemo(() => {
    if (data.length === 0) return null;
    return dataService.calculateStatistics(data);
  }, [data, dataService]);

  // Memoize chart data to prevent unnecessary re-renders
  const frequencyChartData = useMemo(() => {
    if (!statistics) return null;

    return {
      labels: statistics.numberDistribution.map((item) =>
        item.number.toString()
      ),
      datasets: [
        {
          label: "Frequency",
          data: statistics.numberDistribution.map((item) => item.count),
          backgroundColor: statistics.numberDistribution.map((item, index) => {
            if (index < 10) return "rgba(239, 68, 68, 0.8)"; // Hot numbers - red
            if (index >= statistics.numberDistribution.length - 10)
              return "rgba(59, 130, 246, 0.8)"; // Cold numbers - blue
            return "rgba(156, 163, 175, 0.8)"; // Normal numbers - gray
          }),
          borderColor: statistics.numberDistribution.map((item, index) => {
            if (index < 10) return "rgba(239, 68, 68, 1)";
            if (index >= statistics.numberDistribution.length - 10)
              return "rgba(59, 130, 246, 1)";
            return "rgba(156, 163, 175, 1)";
          }),
          borderWidth: 1,
        },
      ],
    };
  }, [statistics]);

  const trendsChartData = useMemo(() => {
    if (!statistics) return null;

    return {
      labels: statistics.numberDistribution
        .slice(0, 20)
        .map((item) => item.number.toString()),
      datasets: [
        {
          label: "All Time",
          data: statistics.numberDistribution
            .slice(0, 20)
            .map((item) => item.count),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
        {
          label: "Last 30 Days",
          data: statistics.recentTrends.last30Days
            .slice(0, 20)
            .map((item) => item.count),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.1,
        },
        {
          label: "Last 90 Days",
          data: statistics.recentTrends.last90Days
            .slice(0, 20)
            .map((item) => item.count),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.1,
        },
      ],
    };
  }, [statistics]);

  if (!statistics || !data.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Statistics & Analysis
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📊</div>
          <p className="text-gray-500">No data available for analysis</p>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text:
          chartType === "frequency"
            ? "Number Frequency Distribution"
            : "Frequency Trends Comparison",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const percentage = statistics.numberDistribution
              .find((item) => item.number.toString() === context.label)
              ?.percentage.toFixed(2);
            return `${context.dataset.label}: ${context.parsed.y} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Numbers",
        },
      },
      y: {
        title: {
          display: true,
          text: "Frequency",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="p-6" gradient>
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className="text-xl font-bold text-gray-800 flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BarChart3 className="mr-2 text-blue-600" size={24} />
          Statistics & Analysis
        </motion.h2>

        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => setChartType("frequency")}
            variant={chartType === "frequency" ? "primary" : "ghost"}
            size="sm"
            icon={<BarChart3 size={16} />}
          >
            Frequency
          </Button>
          <Button
            onClick={() => setChartType("trends")}
            variant={chartType === "trends" ? "primary" : "ghost"}
            size="sm"
            icon={<TrendingUp size={16} />}
          >
            Trends
          </Button>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {statistics.totalDraws}
          </div>
          <div className="text-sm text-blue-800">Total Draws</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">
            {statistics.mostFrequent[0]?.number}
          </div>
          <div className="text-sm text-red-800">Hottest Number</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {statistics.leastFrequent[0]?.number}
          </div>
          <div className="text-sm text-blue-800">Coldest Number</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(
              statistics.numberDistribution.reduce(
                (sum, item) => sum + item.count,
                0
              ) / 55
            )}
          </div>
          <div className="text-sm text-green-800">Avg Frequency</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        {chartType === "frequency"
          ? frequencyChartData && (
              <Bar data={frequencyChartData} options={chartOptions} />
            )
          : trendsChartData && (
              <Line data={trendsChartData} options={chartOptions} />
            )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span>Hot Numbers (Top 10)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span>Cold Numbers (Bottom 10)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
          <span>Normal Numbers</span>
        </div>
      </div>
    </Card>
  );
});

export default StatisticsChart;
