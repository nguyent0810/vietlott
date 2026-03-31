import React from 'react';

interface AccuracyTabProps {
  accuracyMetrics: any;
}

export const AccuracyTab: React.FC<AccuracyTabProps> = ({ accuracyMetrics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{accuracyMetrics?.totalPredictions || 0}</div>
          <div className="text-slate-300">Total Predictions</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {accuracyMetrics?.averageAccuracy ? (accuracyMetrics.averageAccuracy * 100).toFixed(1) + '%' : 'N/A'}
          </div>
          <div className="text-slate-300">Average Accuracy</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {accuracyMetrics?.bestAccuracy ? (accuracyMetrics.bestAccuracy * 100).toFixed(1) + '%' : 'N/A'}
          </div>
          <div className="text-slate-300">Best Accuracy</div>
        </div>
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {accuracyMetrics?.recentPerformance ? (accuracyMetrics.recentPerformance * 100).toFixed(1) + '%' : 'N/A'}
          </div>
          <div className="text-slate-300">Recent Performance</div>
        </div>
      </div>

      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Performance by Lottery Type</h3>
        <div className="space-y-3">
          {accuracyMetrics?.byLotteryType && Object.entries(accuracyMetrics.byLotteryType).map(([type, data]: [string, any]) => (
            <div key={type} className="flex justify-between items-center p-3 bg-slate-600 rounded-lg">
              <div>
                <div className="text-white font-medium">{type === 'power' ? 'Power 6/55' : 'Mega 6/45'}</div>
                <div className="text-slate-300 text-sm">{data.count} predictions</div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{(data.averageAccuracy * 100).toFixed(1)}%</div>
                <div className="text-slate-300 text-sm">Best: {(data.bestAccuracy * 100).toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Improvement Trend</h3>
        <div className="flex items-center space-x-3">
          <span className={`text-2xl ${
            (accuracyMetrics?.improvementTrend || 0) > 0 ? 'text-green-400' : 
            (accuracyMetrics?.improvementTrend || 0) < 0 ? 'text-red-400' : 'text-slate-400'
          }`}>
            {(accuracyMetrics?.improvementTrend || 0) > 0 ? '📈' : 
             (accuracyMetrics?.improvementTrend || 0) < 0 ? '📉' : '➡️'}
          </span>
          <div>
            <div className="text-white font-medium">
              {(accuracyMetrics?.improvementTrend || 0) > 0 ? 'Improving' : 
               (accuracyMetrics?.improvementTrend || 0) < 0 ? 'Declining' : 'Stable'}
            </div>
            <div className="text-slate-300 text-sm">
              Trend: {accuracyMetrics?.improvementTrend ? (accuracyMetrics.improvementTrend * 100).toFixed(2) + '%' : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
