import React from 'react';

interface OverviewTabProps {
  automationStatus: any;
  subscriberStats: any;
  accuracyMetrics: any;
  workflowLogs: any[];
  formatDate: (dateString: string) => string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  automationStatus,
  subscriberStats,
  accuracyMetrics,
  workflowLogs,
  formatDate
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* System Status */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">System Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Automation:</span>
              <span className={`font-medium ${
                automationStatus?.isRunning ? 'text-green-400' : 'text-red-400'
              }`}>
                {automationStatus?.isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Subscribers:</span>
              <span className="text-white font-medium">{subscriberStats?.activeSubscribers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Accuracy:</span>
              <span className="text-white font-medium">
                {accuracyMetrics?.averageAccuracy ? (accuracyMetrics.averageAccuracy * 100).toFixed(1) + '%' : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
          <div className="space-y-2 text-sm">
            {workflowLogs.slice(0, 3).map((log, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-slate-300">{log.lotteryType}</span>
                <span className={`font-medium ${log.success ? 'text-green-400' : 'text-red-400'}`}>
                  {log.success ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Tasks */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Next Task</h3>
          {automationStatus?.nextTask ? (
            <div className="space-y-2 text-sm">
              <div className="text-slate-300">{automationStatus.nextTask.type}</div>
              <div className="text-white font-medium">{automationStatus.nextTask.lotteryType}</div>
              <div className="text-slate-400">
                {automationStatus.nextTask.nextRun ? formatDate(automationStatus.nextTask.nextRun) : 'Not scheduled'}
              </div>
            </div>
          ) : (
            <div className="text-slate-400">No tasks scheduled</div>
          )}
        </div>
      </div>
    </div>
  );
};
