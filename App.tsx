import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { LotterySelector } from './components/LotterySelector.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { LOTTERY_TYPES } from './constants.ts';
import { getInitialHistory } from './services/initialData.ts';
import { lotteryDataService } from './services/lotteryDataService.ts';
import { LotteryType, DrawResult, PredictionRecord, SimulationResult } from './types.ts';
import { Footer } from './components/Footer.tsx';
import { DataManagementModal } from './components/DataManagementModal.tsx';
import { NumberInspectorModal } from './components/NumberInspectorModal.tsx';
import { SimulationControls } from './components/SimulationControls.tsx';
import { SimulationResultModal } from './components/SimulationResultModal.tsx';
import { ApiKeyModal } from './components/ApiKeyModal.tsx';
import { SubscriptionModal } from './components/SubscriptionModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { automatedSchedulerService } from './services/automatedSchedulerService.ts';
import { emailNotificationService } from './services/emailNotificationService.ts';

const App: React.FC = () => {
  const [selectedLottery, setSelectedLottery] = useState<LotteryType>(LOTTERY_TYPES.POWER);
  const [history, setHistory] = useState<DrawResult[]>([]);
  const [predictionHistory, setPredictionHistory] = useState<PredictionRecord[]>([]);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [inspectedNumber, setInspectedNumber] = useState<number | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isLoadingRealData, setIsLoadingRealData] = useState<boolean>(false);
  const [isUsingRealData, setIsUsingRealData] = useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  // --- Simulation State ---
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [simulationDate, setSimulationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [revealedDraw, setRevealedDraw] = useState<SimulationResult | null>(null);

  // Initialize automation services
  useEffect(() => {
    // Initialize email service (in production, you'd get this config from environment variables)
    const emailConfig = {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: process.env.SMTP_USER || '',
      smtpPassword: process.env.SMTP_PASSWORD || '',
      fromEmail: 'noreply@vietlott-ai.com',
      fromName: 'Vietlott AI Predictor'
    };

    if (emailConfig.smtpUser && emailConfig.smtpPassword) {
      emailNotificationService.initialize(emailConfig);
    }

    // Initialize automation scheduler
    automatedSchedulerService.initialize({
      enabled: false, // Start disabled, user can enable via admin dashboard
      analysisTime: '08:00',
      predictionTime: '10:00',
      emailTime: '12:00',
      timezone: 'Asia/Ho_Chi_Minh',
      retryAttempts: 3,
      retryDelay: 30
    });
  }, []);

  // Load prediction history from localStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('predictionHistory');
      setPredictionHistory(storedHistory ? JSON.parse(storedHistory) : []);
    } catch (error) {
      console.error("Failed to load prediction history from localStorage", error);
      setPredictionHistory([]);
    }
  }, []);
  
  // Load draw history - try real data first, fallback to cached/initial data
  useEffect(() => {
    const loadLotteryData = async () => {
      setIsLoadingRealData(true);
      const storageKey = `drawHistory_${selectedLottery}`;

      try {
        // Try to get real data first
        const realData = await lotteryDataService.getLotteryData(selectedLottery, true, 100);

        if (realData && realData.length > 0) {
          setHistory(realData);
          setIsUsingRealData(await lotteryDataService.isUsingRealData(selectedLottery));
          // Cache the real data
          localStorage.setItem(storageKey, JSON.stringify(realData));
          console.log(`✅ Loaded ${realData.length} lottery results for ${selectedLottery}`);
        } else {
          throw new Error('No real data available');
        }
      } catch (error) {
        console.warn('Failed to load real data, using fallback:', error);

        // Fallback to cached data or initial data
        try {
          const cachedData = localStorage.getItem(storageKey);
          if (cachedData) {
            setHistory(JSON.parse(cachedData));
          } else {
            const initialData = getInitialHistory(selectedLottery);
            setHistory(initialData);
            localStorage.setItem(storageKey, JSON.stringify(initialData));
          }
          setIsUsingRealData(false);
        } catch (cacheError) {
          console.error("Failed to load draw history from cache", cacheError);
          const initialData = getInitialHistory(selectedLottery);
          setHistory(initialData);
          setIsUsingRealData(false);
        }
      } finally {
        setIsLoadingRealData(false);
      }
    };

    loadLotteryData();
  }, [selectedLottery]);

  const addPredictionToHistory = useCallback((prediction: Omit<PredictionRecord, 'id' | 'date'>) => {
    setPredictionHistory(prevHistory => {
      const newRecord: PredictionRecord = {
        ...prediction,
        id: new Date().toISOString(),
        date: isSimulationMode ? simulationDate : new Date().toLocaleDateString('en-CA'),
      };
      const updatedHistory = [newRecord, ...prevHistory].slice(0, 20);
      localStorage.setItem('predictionHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, [isSimulationMode, simulationDate]);

  const updateDrawHistory = (newHistory: DrawResult[]) => {
    const sortedHistory = [...newHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(sortedHistory);
    localStorage.setItem(`drawHistory_${selectedLottery}`, JSON.stringify(sortedHistory));
  };

  const handleSelectNumber = (num: number) => setInspectedNumber(num);
  const handleCloseInspector = () => setInspectedNumber(null);
  
  const handleSaveApiKey = (apiKey: string) => {
    sessionStorage.setItem('geminiApiKey', apiKey);
    setIsApiKeyModalOpen(false);
  };

  const handleRefreshData = async () => {
    setIsLoadingRealData(true);
    try {
      const refreshedData = await lotteryDataService.refreshData(selectedLottery, 100);
      setHistory(refreshedData);
      setIsUsingRealData(await lotteryDataService.isUsingRealData(selectedLottery));

      // Update localStorage
      const storageKey = `drawHistory_${selectedLottery}`;
      localStorage.setItem(storageKey, JSON.stringify(refreshedData));

      console.log(`✅ Refreshed ${refreshedData.length} lottery results for ${selectedLottery}`);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoadingRealData(false);
    }
  };

  // --- Simulation Logic ---
  const visibleHistory = useMemo(() => {
    if (!isSimulationMode) return history;
    return history.filter(d => new Date(d.date) <= new Date(simulationDate));
  }, [isSimulationMode, simulationDate, history]);

  const handleToggleSimulation = (active: boolean) => {
    setIsSimulationMode(active);
  };

  const handleRevealDraw = () => {
    const latestPrediction = predictionHistory[0];
    if (!latestPrediction) return;

    // Find the first draw that occurred *after* the simulation date
    const nextDraw = history
      .filter(d => new Date(d.date) > new Date(simulationDate))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    if (nextDraw) {
      setRevealedDraw({ prediction: latestPrediction, draw: nextDraw });
    } else {
      alert("No future draw found in the database to reveal.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SimulationControls
          isSimulationMode={isSimulationMode}
          onToggle={handleToggleSimulation}
          simulationDate={simulationDate}
          onDateChange={setSimulationDate}
          onReveal={handleRevealDraw}
          history={history}
          latestPrediction={predictionHistory[0]}
        />

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <LotterySelector
              selectedLottery={selectedLottery}
              onSelectLottery={setSelectedLottery}
            />

            {/* Data Source Indicator */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isUsingRealData
                  ? 'bg-green-900/50 text-green-400 border border-green-700/50'
                  : 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isUsingRealData ? 'bg-green-400' : 'bg-yellow-400'
                }`}></div>
                {isLoadingRealData ? 'Loading...' : (isUsingRealData ? 'Real Data' : 'Sample Data')}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshData}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSimulationMode || isLoadingRealData}
                title="Refresh lottery data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoadingRealData ? 'animate-spin' : ''}>
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M3 21v-5h5"/>
                </svg>
                Refresh
              </button>

              <button
                onClick={() => setIsDataModalOpen(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSimulationMode}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 15v5"/><path d="M12 4v3"/><path d="M18 7v3"/><path d="M6 7v3"/><path d="M12 10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z"/></svg>
                Manage Data
              </button>

              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email Alerts
              </button>

              <button
                onClick={() => setIsAdminDashboardOpen(true)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full transition-colors"
                title="Admin Dashboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/></svg>
                Admin
              </button>
            </div>
        </div>

        <Dashboard 
          lotteryType={selectedLottery} 
          history={visibleHistory} 
          predictionHistory={predictionHistory}
          onPredictionGenerated={addPredictionToHistory}
          onSelectNumber={handleSelectNumber}
          isSimulationActive={isSimulationMode}
          onRequestApiKey={() => setIsApiKeyModalOpen(true)}
        />
      </main>
      <Footer />

      {isDataModalOpen && (
        <DataManagementModal
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
          lotteryType={selectedLottery}
          drawHistory={history}
          onHistoryUpdate={updateDrawHistory}
        />
      )}
      {inspectedNumber !== null && (
        <NumberInspectorModal
          isOpen={inspectedNumber !== null}
          onClose={handleCloseInspector}
          number={inspectedNumber}
          lotteryType={selectedLottery}
          fullHistory={visibleHistory} // Inspector should respect simulation time
        />
      )}
      {revealedDraw && (
        <SimulationResultModal
          isOpen={!!revealedDraw}
          onClose={() => setRevealedDraw(null)}
          result={revealedDraw}
        />
      )}
      {isApiKeyModalOpen && (
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          onSave={handleSaveApiKey}
        />
      )}
      {isSubscriptionModalOpen && (
        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
        />
      )}
      {isAdminDashboardOpen && (
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
        />
      )}
    </div>
  );
};

export default App;