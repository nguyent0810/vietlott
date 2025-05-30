'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Zap, Gem } from 'lucide-react';
import { LotteryType, LotteryConfig } from '@/types/lottery';
import { LotteryConfigService } from '@/services/LotteryConfigService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface LotteryTypeSelectorProps {
  currentType: LotteryType;
  onTypeChange: (type: LotteryType) => void;
}

export default function LotteryTypeSelector({ currentType, onTypeChange }: LotteryTypeSelectorProps) {
  const [showRules, setShowRules] = useState(false);
  const configService = LotteryConfigService.getInstance();
  const configs = configService.getLotteryConfigs();
  const currentConfig = configs.find(config => config.type === currentType) || configs[0];

  const handleTypeChange = (type: LotteryType) => {
    onTypeChange(type);
    configService.setCurrentLotteryType(type);
  };

  const getIcon = (type: LotteryType) => {
    return type === 'power655' ? <Zap size={20} /> : <Gem size={20} />;
  };

  return (
    <Card className="p-6 mb-6" gradient>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          {getIcon(currentType)}
          <span className="ml-2">Lottery Type Selection</span>
        </h2>

        {/* Lottery Type Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {configs.map((config) => (
            <motion.button
              key={config.type}
              onClick={() => handleTypeChange(config.type)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                currentType === config.type
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{config.icon}</span>
                  <h3 className="font-bold text-lg">{config.name}</h3>
                </div>
                {currentType === config.type && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{config.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Numbers: 1-{config.maxNumber}</span>
                <span>{config.hasPowerNumber ? 'With Power' : 'No Power'}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Current Selection Info */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-800 flex items-center">
              {getIcon(currentType)}
              <span className="ml-2">Current: {currentConfig.name}</span>
            </h4>
            <Button
              onClick={() => setShowRules(!showRules)}
              variant="ghost"
              size="sm"
              icon={<Info size={16} />}
            >
              {showRules ? 'Hide' : 'Show'} Rules
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-bold text-blue-600">1-{currentConfig.maxNumber}</div>
              <div className="text-gray-600">Number Range</div>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-bold text-blue-600">{currentConfig.numbersCount}</div>
              <div className="text-gray-600">Numbers to Pick</div>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-bold text-blue-600">
                {currentConfig.hasPowerNumber ? 'Yes' : 'No'}
              </div>
              <div className="text-gray-600">Power Number</div>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <div className="font-bold text-blue-600">
                {configService.getOdds(currentType).jackpot.split(' ')[2]}
              </div>
              <div className="text-gray-600">Jackpot Odds</div>
            </div>
          </div>
        </motion.div>

        {/* Rules Section */}
        {showRules && (
          <motion.div
            className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h5 className="font-semibold text-gray-800 mb-3">
              {currentConfig.name} Rules & Information
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rules */}
              <div>
                <h6 className="font-medium text-gray-700 mb-2">Game Rules:</h6>
                <ul className="text-sm text-gray-600 space-y-1">
                  {configService.getRulesForCurrentLottery().map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Odds & Prizes */}
              <div>
                <h6 className="font-medium text-gray-700 mb-2">Winning Odds:</h6>
                <div className="text-sm text-gray-600 space-y-1">
                  {Object.entries(configService.getOdds(currentType)).map(([level, odds]) => (
                    <div key={level} className="flex justify-between">
                      <span className="capitalize">{level}:</span>
                      <span className="font-medium">{odds}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prize Structure */}
            <div className="mt-4">
              <h6 className="font-medium text-gray-700 mb-2">Prize Structure:</h6>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Level</th>
                      <th className="p-2 text-left">Condition</th>
                      <th className="p-2 text-left">Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {configService.getPrizeStructure(currentType).map((prize, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-2 font-medium">{prize.level}</td>
                        <td className="p-2">{prize.condition}</td>
                        <td className="p-2 text-green-600 font-medium">{prize.prize}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
}
