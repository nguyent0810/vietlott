import React, { useState, useEffect } from 'react';
import { automatedSchedulerService } from '../services/automatedSchedulerService';
import { emailNotificationService } from '../services/emailNotificationService';
import { predictionAnalysisService } from '../services/predictionAnalysisService';
import { OverviewTab } from './admin/OverviewTab';
import { AutomationTab } from './admin/AutomationTab';
import { SubscribersTab } from './admin/SubscribersTab';
import { AccuracyTab } from './admin/AccuracyTab';
import { motion, AnimatePresence } from 'framer-motion';

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
      const status = automatedSchedulerService.getStatus();
      setAutomationStatus(status);

      const stats = emailNotificationService.getDeliveryStats();
      setSubscriberStats(stats);

      predictionAnalysisService.loadAccuracyHistory();
      const metrics = predictionAnalysisService.getAccuracyMetrics();
      setAccuracyMetrics(metrics);

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
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-800/90 border border-slate-700/50 shadow-2xl rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              🔧 Admin Dashboard
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-slate-900/50 rounded-xl p-1 border border-slate-700/50">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'automation', label: '🤖 Automation' },
              { id: 'subscribers', label: '📧 Subscribers' },
              { id: 'accuracy', label: '🎯 Accuracy' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
                <span className="ml-4 text-slate-300 font-medium tracking-wide">Loading system data...</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'overview' && (
                    <OverviewTab
                      automationStatus={automationStatus}
                      subscriberStats={subscriberStats}
                      accuracyMetrics={accuracyMetrics}
                      workflowLogs={workflowLogs}
                      formatDate={formatDate}
                    />
                  )}
                  {activeTab === 'automation' && (
                    <AutomationTab
                      automationStatus={automationStatus}
                      workflowLogs={workflowLogs}
                      toggleAutomation={toggleAutomation}
                    />
                  )}
                  {activeTab === 'subscribers' && (
                    <SubscribersTab
                      subscriberStats={subscriberStats}
                      formatDate={formatDate}
                    />
                  )}
                  {activeTab === 'accuracy' && (
                    <AccuracyTab accuracyMetrics={accuracyMetrics} />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
