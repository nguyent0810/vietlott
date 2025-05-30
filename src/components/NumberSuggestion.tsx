"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Lightbulb,
  Target,
  TrendingUp,
  Save,
} from "lucide-react";
import {
  LotteryResult,
  PredictionRecord,
  AlgorithmPerformance,
} from "@/types/lottery";
import { LotteryDataService } from "@/services/LotteryDataService";
import { PredictionService } from "@/services/PredictionService";
import Card from "@/components/ui/Card";
import NumberBall from "@/components/ui/NumberBall";
import Button from "@/components/ui/Button";

interface NumberSuggestionProps {
  data: LotteryResult[];
}

interface SuggestionAlgorithm {
  name: string;
  description: string;
  icon: string;
  color: string;
}

const algorithms: SuggestionAlgorithm[] = [
  {
    name: "Smart Frequency",
    description: "Recent + historical frequency analysis",
    icon: "🧠",
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Gap Analysis",
    description: "Numbers due based on gap patterns",
    icon: "📊",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Pattern Recognition",
    description: "Even/odd, sum, and sequence patterns",
    icon: "🔍",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Ensemble Method",
    description: "Weighted combination of all algorithms",
    icon: "🎯",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Neural Pattern",
    description: "AI-inspired pattern recognition",
    icon: "🤖",
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "Fibonacci Sequence",
    description: "Mathematical Fibonacci patterns",
    icon: "🌀",
    color: "from-teal-500 to-blue-500",
  },
  {
    name: "ML Weighted",
    description: "Machine learning weighted selection",
    icon: "⚡",
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "Chaos Theory",
    description: "Chaos theory-based prediction",
    icon: "🌪️",
    color: "from-gray-500 to-slate-600",
  },
];

export default function NumberSuggestion({ data }: NumberSuggestionProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    algorithms[0].name
  );
  const [suggestion, setSuggestion] = useState<{
    numbers: number[];
    confidence: number;
    reasoning: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [performance, setPerformance] = useState<AlgorithmPerformance[]>([]);
  const [actualResult, setActualResult] = useState("");
  const [savedPredictionId, setSavedPredictionId] = useState<string | null>(
    null
  );

  const dataService = LotteryDataService.getInstance();
  const predictionService = PredictionService.getInstance();

  useEffect(() => {
    if (data.length > 0) {
      generateSuggestion(selectedAlgorithm);
    }
  }, [data, selectedAlgorithm]);

  const generateSuggestion = async (algorithmName: string) => {
    if (data.length === 0) return;

    setIsGenerating(true);

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    let numbers: number[] = [];

    switch (algorithmName) {
      case "Smart Frequency":
        numbers = dataService.getSmartFrequencyNumbers(data);
        break;
      case "Gap Analysis":
        numbers = dataService.getGapAnalysisNumbers(data);
        break;
      case "Pattern Recognition":
        numbers = dataService.getPatternBasedNumbers(data);
        break;
      case "Ensemble Method":
        numbers = dataService.getEnsembleNumbers(data);
        break;
      case "Neural Pattern":
        numbers = predictionService.getNeuralPatternNumbers(data);
        break;
      case "Fibonacci Sequence":
        numbers = predictionService.getFibonacciPatternNumbers(data);
        break;
      case "ML Weighted":
        numbers = predictionService.getMLWeightedNumbers(data);
        break;
      case "Chaos Theory":
        numbers = predictionService.getChaosTheoryNumbers(data);
        break;
      default:
        numbers = dataService.getEnsembleNumbers(data);
    }

    const confidence = Math.round(
      dataService.calculateConfidence(numbers, data)
    );
    const algorithm = algorithms.find((a) => a.name === algorithmName);

    setSuggestion({
      numbers,
      confidence,
      reasoning: algorithm?.description || "",
    });

    setIsGenerating(false);
  };

  const handleAlgorithmChange = (algorithmName: string) => {
    setSelectedAlgorithm(algorithmName);
  };

  const handleRefresh = () => {
    generateSuggestion(selectedAlgorithm);
  };

  const handleCopy = async () => {
    if (suggestion) {
      await navigator.clipboard.writeText(suggestion.numbers.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSavePrediction = () => {
    if (suggestion) {
      const predictionId = predictionService.storePrediction(
        suggestion.numbers,
        selectedAlgorithm,
        suggestion.confidence
      );
      setSavedPredictionId(predictionId);
      loadPredictions();
    }
  };

  const handleCompareResult = () => {
    if (actualResult && savedPredictionId) {
      try {
        // Parse actual result: "09 37 42 45 46 50 14" format
        const parts = actualResult.trim().split(/\s+/);
        const numbers = parts.slice(0, 6).map((n) => parseInt(n));
        const powerNumber = parts.length > 6 ? parseInt(parts[6]) : undefined;

        const mockResult: LotteryResult = {
          id: "manual",
          date: new Date().toISOString().split("T")[0],
          result: numbers,
          powerNumber,
        };

        predictionService.comparePrediction(savedPredictionId, mockResult);
        loadPredictions();
        loadPerformance();
        setActualResult("");
        setSavedPredictionId(null);
      } catch (error) {
        console.error("Error parsing actual result:", error);
      }
    }
  };

  const loadPredictions = () => {
    setPredictions(predictionService.getPredictions());
  };

  const loadPerformance = () => {
    setPerformance(predictionService.getAlgorithmPerformance());
  };

  // Load predictions and performance on component mount
  useEffect(() => {
    loadPredictions();
    loadPerformance();
  }, []);

  const ConfidenceBar = ({ confidence }: { confidence: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <motion.div
        className={`h-3 rounded-full ${
          confidence >= 70
            ? "bg-gradient-to-r from-green-400 to-green-600"
            : confidence >= 40
            ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
            : "bg-gradient-to-r from-red-400 to-red-600"
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${confidence}%` }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  );

  if (!data.length) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Sparkles className="mr-2 text-green-600" size={24} />
          Number Suggestions
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">🎲</div>
          <p className="text-gray-500">No data available for suggestions</p>
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
        <Sparkles className="mr-2 text-green-600" size={24} />
        Number Suggestions
      </motion.h2>

      {/* Algorithm Selection */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Lightbulb className="mr-2" size={16} />
          Choose Algorithm:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {algorithms.map((algorithm, index) => (
            <motion.button
              key={algorithm.name}
              onClick={() => handleAlgorithmChange(algorithm.name)}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 text-left
                ${
                  selectedAlgorithm === algorithm.name
                    ? `border-blue-500 bg-gradient-to-r ${algorithm.color} text-white shadow-lg`
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center mb-1">
                <span className="text-lg mr-2">{algorithm.icon}</span>
                <span className="font-medium">{algorithm.name}</span>
              </div>
              <p
                className={`text-xs ${
                  selectedAlgorithm === algorithm.name
                    ? "text-white/80"
                    : "text-gray-500"
                }`}
              >
                {algorithm.description}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.div
              className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 font-medium">
              Generating suggestions...
            </p>
          </motion.div>
        ) : suggestion ? (
          <motion.div
            key="suggestion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
          >
            {/* Suggested Numbers */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Your Lucky Numbers:
                </h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSavePrediction}
                    variant="success"
                    size="sm"
                    icon={<Save size={16} />}
                    disabled={!suggestion || savedPredictionId !== null}
                  >
                    {savedPredictionId ? "Saved" : "Save"}
                  </Button>
                  <Button
                    onClick={handleRefresh}
                    variant="secondary"
                    size="sm"
                    icon={<RefreshCw size={16} />}
                    loading={isGenerating}
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="flex justify-center space-x-3 mb-6">
                {suggestion.numbers.map((number, index) => (
                  <NumberBall
                    key={index}
                    number={number}
                    variant="suggested"
                    size="lg"
                    delay={0.1 * index}
                  />
                ))}
              </div>
            </div>

            {/* Confidence and Details */}
            <div className="space-y-6">
              <div className="bg-white/60 rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Confidence Level:
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {suggestion.confidence}%
                  </span>
                </div>
                <ConfidenceBar confidence={suggestion.confidence} />
                <p className="text-xs text-gray-500 mt-2">
                  Based on {data.length} historical draws analysis
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <span className="text-blue-600 mr-2">ℹ️</span>
                  Algorithm Insights:
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  {suggestion.reasoning}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                    {data.length} draws analyzed
                  </div>
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                    Numbers sorted ascending
                  </div>
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                    Frequency-based confidence
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Copy */}
            <motion.div
              className="mt-6 pt-4 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <Copy size={14} className="mr-2" />
                  Quick copy:
                </span>
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  icon={
                    copied ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )
                  }
                  className={copied ? "text-green-600 border-green-300" : ""}
                >
                  {copied ? "Copied!" : suggestion.numbers.join(", ")}
                </Button>
              </div>
            </motion.div>

            {/* Prediction Tracking Section */}
            {savedPredictionId && (
              <motion.div
                className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                  <Target className="mr-2" size={16} />
                  Compare with Actual Result
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Enter the actual lottery result to track algorithm
                  performance:
                </p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={actualResult}
                    onChange={(e) => setActualResult(e.target.value)}
                    placeholder="e.g., 09 37 42 45 46 50 14"
                    className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleCompareResult}
                    variant="primary"
                    size="sm"
                    disabled={!actualResult.trim()}
                  >
                    Compare
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Performance Toggle */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={() => setShowPerformance(!showPerformance)}
                variant="ghost"
                size="sm"
                icon={<TrendingUp size={16} />}
              >
                {showPerformance ? "Hide" : "Show"} Algorithm Performance
              </Button>
            </motion.div>

            {/* Algorithm Performance Section */}
            <AnimatePresence>
              {showPerformance && (
                <motion.div
                  className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-medium text-blue-800 mb-4 flex items-center">
                    <TrendingUp className="mr-2" size={16} />
                    Algorithm Performance Comparison
                  </h4>

                  {performance.length > 0 ? (
                    <div className="space-y-3">
                      {performance
                        .sort((a, b) => b.averageMatches - a.averageMatches)
                        .map((perf, index) => (
                          <div
                            key={perf.algorithmName}
                            className={`p-3 rounded-lg border ${
                              perf.algorithmName === selectedAlgorithm
                                ? "border-blue-400 bg-blue-100"
                                : "border-blue-200 bg-white"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-blue-900">
                                #{index + 1} {perf.algorithmName}
                              </span>
                              <span className="text-sm text-blue-600">
                                {perf.totalPredictions} predictions
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="text-blue-600">
                                  Avg Matches:
                                </span>
                                <span className="font-bold ml-1">
                                  {perf.averageMatches}
                                </span>
                              </div>
                              <div>
                                <span className="text-blue-600">Best:</span>
                                <span className="font-bold ml-1">
                                  {perf.bestMatch}/6
                                </span>
                              </div>
                              <div>
                                <span className="text-blue-600">Accuracy:</span>
                                <span className="font-bold ml-1">
                                  {perf.accuracy}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-blue-600 text-sm text-center py-4">
                      No performance data yet. Save predictions and compare with
                      actual results to see algorithm performance.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Predictions */}
            {predictions.length > 0 && (
              <motion.div
                className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <h4 className="font-medium text-gray-800 mb-3">
                  Recent Predictions
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {predictions.slice(0, 5).map((pred) => (
                    <div
                      key={pred.id}
                      className="flex justify-between items-center p-2 bg-white rounded border text-xs"
                    >
                      <div>
                        <span className="font-medium">{pred.algorithm}</span>
                        <span className="text-gray-500 ml-2">{pred.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">
                          {pred.predictedNumbers.join(", ")}
                        </span>
                        {pred.matches !== undefined && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              pred.matches >= 3
                                ? "bg-green-100 text-green-800"
                                : pred.matches >= 1
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pred.matches}/6
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
