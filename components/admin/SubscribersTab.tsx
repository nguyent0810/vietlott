import React from 'react';

interface SubscribersTabProps {
  subscriberStats: any;
  formatDate: (dateString: string) => string;
}

export const SubscribersTab: React.FC<SubscribersTabProps> = ({
  subscriberStats,
  formatDate
}) => {
  return (
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
  );
};
