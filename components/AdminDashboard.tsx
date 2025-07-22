import React, { useState, useEffect } from 'react';
import { automatedSchedulerService } from '../services/automatedSchedulerService';
import { emailNotificationService } from '../services/emailNotificationService';
import { predictionAnalysisService } from '../services/predictionAnalysisService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'automation' | 'subscribers' | 'accuracy'>('overview');
  const [automationStatus, setAutomationStatus] = useState<any>(null);
  const [subscriberStats, setSubscriberStats] = useState<any>(null);
  const [accuracyMetrics, setAccuracyMetrics] = useState<any>(null);
  const [workflowLogs, setWorkflowLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load automation status
      const status = automatedSchedulerService.getStatus();
      setAutomationStatus(status);

      // Load subscriber statistics
      const stats = emailNotificationService.getDeliveryStats();
      setSubscriberStats(stats);

      // Load accuracy metrics
      predictionAnalysisService.loadAccuracyHistory();
      const metrics = predictionAnalysisService.getAccuracyMetrics();
      setAccuracyMetrics(metrics);

      // Load workflow logs
      const logs = automatedSchedulerService.getWorkflowLogs();
      setWorkflowLogs(logs.slice(-10)); // Last 10 logs

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutomation = () => {
    const newEnabled = !automationStatus?.config?.enabled;
    automatedSchedulerService.updateConfig({ enabled: newEnabled });
    loadDashboardData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              🔧 Admin Dashboard
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-slate-700 rounded-lg p-1">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'automation', label: '🤖 Automation', icon: '🤖' },
              { id: 'subscribers', label: '📧 Subscribers', icon: '📧' },
              { id: 'accuracy', label: '🎯 Accuracy', icon: '🎯' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-slate-300">Loading dashboard data...</span>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
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
                )}

                {/* Automation Tab */}
                {activeTab === 'automation' && (
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
                )}

                {/* Subscribers Tab */}
                {activeTab === 'subscribers' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-700 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-white">{subscriberStats?.totalSubscribers || 0}</div>
                        <div className="text-slate-300">Total Subscribers</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-400">{subscriberStats?.activeSubscribers || 0}</div>
                        <div className="text-slate-300">Active Subscribers</div>
                      </div>
                      <div className="bg-slate-700 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-400">
                          {subscriberStats?.deliveryRate ? (subscriberStats.deliveryRate * 100).toFixed(1) + '%' : 'N/A'}
                        </div>
                        <div className="text-slate-300">Delivery Rate</div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Subscriber Management</h3>
                      <div className="text-slate-300">
                        <p>Last email delivery: {subscriberStats?.lastDeliveryDate ? formatDate(subscriberStats.lastDeliveryDate) : 'Never'}</p>
                        <p className="mt-2 text-sm text-slate-400">
                          Use the subscription modal in the main app to manage individual subscriptions.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Accuracy Tab */}
                {activeTab === 'accuracy' && (
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
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
