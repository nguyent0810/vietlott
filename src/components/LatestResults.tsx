"use client";

import { motion } from "framer-motion";
import { Calendar, Trophy, Zap } from "lucide-react";
import { LotteryResult } from "@/types/lottery";
import Card from "@/components/ui/Card";
import NumberBall from "@/components/ui/NumberBall";

interface LatestResultsProps {
  data: LotteryResult[];
}

export default function LatestResults({ data }: LatestResultsProps) {
  const latestResults = data.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  if (!latestResults.length) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Trophy className="mr-2 text-blue-600" size={24} />
          Latest Results
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">🎱</div>
          <p className="text-gray-500">No lottery results available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" gradient>
      <motion.h2
        className="text-xl font-bold text-gray-800 mb-6 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Trophy className="mr-2 text-blue-600" size={24} />
        Latest Results
      </motion.h2>

      <div className="space-y-4">
        {latestResults.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${
                index === 0
                  ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg"
                  : "border-gray-200 bg-white/50 hover:bg-white/80"
              }
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center">
                  Draw #{result.id}
                  {index === 0 && (
                    <motion.span
                      className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      Latest
                    </motion.span>
                  )}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(result.date)}</span>
                  <span className="mx-2">•</span>
                  <span className="text-blue-600 font-medium">
                    {formatRelativeTime(result.date)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mb-3">
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Numbers:
              </span>
              <div className="flex space-x-2">
                {result.result.map((number, numIndex) => (
                  <NumberBall
                    key={numIndex}
                    number={number}
                    variant="primary"
                    delay={0.1 * (numIndex + 1)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {result.powerNumber && (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Zap size={14} className="mr-2 text-red-500" />
                  Power:
                </span>
                <NumberBall
                  number={result.powerNumber}
                  variant="power"
                  delay={0.7}
                  size="sm"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-6 pt-4 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-xs text-gray-500 text-center">
          Showing {latestResults.length} most recent draws
        </p>
      </motion.div>
    </Card>
  );
}
