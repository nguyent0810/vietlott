import React from 'react';

interface AutomationTabProps {
  automationStatus: any;
  workflowLogs: any[];
  toggleAutomation: () => void;
}

export const AutomationTab: React.FC<AutomationTabProps> = ({
  automationStatus,
  workflowLogs,
  toggleAutomation
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Automation Control</h3>
          <button
            onClick={toggleAutomation}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              automationStatus?.isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {automationStatus?.isRunning ? 'Stop Automation' : 'Start Automation'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{automationStatus?.pendingTasks || 0}</div>
            <div className="text-slate-300">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{automationStatus?.completedTasks || 0}</div>
            <div className="text-slate-300">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{automationStatus?.failedTasks || 0}</div>
            <div className="text-slate-300">Failed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {automationStatus?.config?.enabled ? 'ON' : 'OFF'}
            </div>
            <div className="text-slate-300">Status</div>
          </div>
        </div>
      </div>

      {/* Workflow Logs */}
      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Workflows</h3>
        <div className="space-y-2">
          {workflowLogs.map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className={`text-lg ${log.success ? 'text-green-400' : 'text-red-400'}`}>
                  {log.success ? '✅' : '❌'}
                </span>
                <div>
                  <div className="text-white font-medium">{log.lotteryType} - {log.date}</div>
                  <div className="text-slate-300 text-sm">
                    Duration: {(log.totalDuration / 1000).toFixed(1)}s
                  </div>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-slate-300">
                  📧 {log.tasks.emailDelivery.sent || 0} sent
                </div>
                <div className="text-slate-400">
                  {log.tasks.emailDelivery.failed || 0} failed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
