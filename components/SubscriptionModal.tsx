import React, { useState, useEffect } from 'react';
import { LotteryType } from '../types.ts';
import { LOTTERY_TYPES } from '../constants.ts';
import { emailNotificationService, EmailSubscriber } from '../services/emailNotificationService.ts';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedLotteries, setSelectedLotteries] = useState<LotteryType[]>([LOTTERY_TYPES.POWER]);
  const [sendTime, setSendTime] = useState('10:00');
  const [includeAnalysis, setIncludeAnalysis] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [existingSubscriber, setExistingSubscriber] = useState<EmailSubscriber | null>(null);

  useEffect(() => {
    if (isOpen && email) {
      const subscriber = emailNotificationService.getSubscriberByEmail(email);
      if (subscriber) {
        setExistingSubscriber(subscriber);
        setName(subscriber.name || '');
        setSelectedLotteries(subscriber.preferences.lotteryTypes);
        setSendTime(subscriber.preferences.sendTime);
        setIncludeAnalysis(subscriber.preferences.includeAnalysis);
        setIncludeHistory(subscriber.preferences.includeHistory);
      } else {
        setExistingSubscriber(null);
      }
    }
  }, [email, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setMessage(null);

    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (selectedLotteries.length === 0) {
        throw new Error('Please select at least one lottery type');
      }

      const subscriberData = {
        email,
        name: name || undefined,
        preferences: {
          lotteryTypes: selectedLotteries,
          sendTime,
          timezone: 'Asia/Ho_Chi_Minh',
          includeAnalysis,
          includeHistory
        },
        isActive: true
      };

      if (existingSubscriber) {
        // Update existing subscriber
        const success = emailNotificationService.updateSubscriber(existingSubscriber.id, subscriberData);
        if (success) {
          setMessage({ type: 'success', text: 'Subscription preferences updated successfully!' });
        } else {
          throw new Error('Failed to update subscription');
        }
      } else {
        // Add new subscriber
        const subscriberId = emailNotificationService.addSubscriber(subscriberData);
        if (subscriberId) {
          setMessage({ type: 'success', text: 'Successfully subscribed to daily lottery predictions!' });
        } else {
          throw new Error('Failed to create subscription');
        }
      }

      // Reset form after successful subscription
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An error occurred' 
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribe = () => {
    if (existingSubscriber) {
      const success = emailNotificationService.removeSubscriber(existingSubscriber.id);
      if (success) {
        setMessage({ type: 'success', text: 'Successfully unsubscribed from email notifications' });
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Failed to unsubscribe' });
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setName('');
    setSelectedLotteries([LOTTERY_TYPES.POWER]);
    setSendTime('10:00');
    setIncludeAnalysis(true);
    setIncludeHistory(false);
    setMessage(null);
    setExistingSubscriber(null);
  };

  const toggleLotteryType = (lotteryType: LotteryType) => {
    setSelectedLotteries(prev => 
      prev.includes(lotteryType)
        ? prev.filter(type => type !== lotteryType)
        : [...prev, lotteryType]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              📧 Email Notifications
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

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/50 text-green-400 border border-green-700/50' 
                : 'bg-red-900/50 text-red-400 border border-red-700/50'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            {/* Lottery Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Lottery Types *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLotteries.includes(LOTTERY_TYPES.POWER)}
                    onChange={() => toggleLotteryType(LOTTERY_TYPES.POWER)}
                    className="mr-2 rounded"
                  />
                  <span className="text-slate-300">Power 6/55 (Tue, Thu, Sat)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLotteries.includes(LOTTERY_TYPES.MEGA)}
                    onChange={() => toggleLotteryType(LOTTERY_TYPES.MEGA)}
                    className="mr-2 rounded"
                  />
                  <span className="text-slate-300">Mega 6/45 (Mon, Wed, Sun)</span>
                </label>
              </div>
            </div>

            {/* Send Time */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Preferred Send Time
              </label>
              <select
                value={sendTime}
                onChange={(e) => setSendTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
              <p className="text-xs text-slate-400 mt-1">Vietnam time (GMT+7)</p>
            </div>

            {/* Email Content Preferences */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Content
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeAnalysis}
                    onChange={(e) => setIncludeAnalysis(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span className="text-slate-300">Include statistical analysis</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeHistory}
                    onChange={(e) => setIncludeHistory(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span className="text-slate-300">Include prediction history</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubscribing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isSubscribing ? 'Processing...' : existingSubscriber ? 'Update Subscription' : 'Subscribe'}
              </button>
              
              {existingSubscriber && (
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Unsubscribe
                </button>
              )}
            </div>
          </form>

          {/* Disclaimer */}
          <div className="mt-6 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400">
              <strong>Disclaimer:</strong> Lottery predictions are for entertainment purposes only. 
              We use AI and statistical analysis, but lottery results are random. 
              Please play responsibly and never bet more than you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
