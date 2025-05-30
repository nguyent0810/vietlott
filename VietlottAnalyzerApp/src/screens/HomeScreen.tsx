import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LotteryResult, LotteryType, LOTTERY_CONFIGS } from '../types/lottery';
import ApiService from '../services/ApiService';
import StorageService from '../services/StorageService';
import LotteryBalls from '../components/LotteryBalls';
import LotteryTypeSelector from '../components/LotteryTypeSelector';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [latestResults, setLatestResults] = useState<LotteryResult[]>([]);
  const [selectedLotteryType, setSelectedLotteryType] = useState<LotteryType>('power655');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadLatestResults();
  }, [selectedLotteryType]);

  const loadInitialData = async () => {
    try {
      // Load user preferences
      const settings = await StorageService.getAppSettings();
      setSelectedLotteryType(settings.preferredLotteryType);
      
      // Load cached data first
      const cachedResults = await StorageService.getCachedResults(settings.preferredLotteryType);
      if (cachedResults.length > 0) {
        setLatestResults(cachedResults.slice(0, 5));
        setLoading(false);
      }
      
      // Then fetch fresh data
      await loadLatestResults(settings.preferredLotteryType);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLoading(false);
    }
  };

  const loadLatestResults = async (lotteryType: LotteryType = selectedLotteryType) => {
    try {
      const results = await ApiService.fetchLatestResults(lotteryType);
      setLatestResults(results);
      setLastUpdated(new Date());
      
      // Cache the results
      await StorageService.saveCachedResults(lotteryType, results);
      await StorageService.updateLastSync();
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading latest results:', error);
      
      // Try to load from cache if API fails
      const cachedResults = await StorageService.getCachedResults(lotteryType);
      if (cachedResults.length > 0) {
        setLatestResults(cachedResults.slice(0, 5));
      } else {
        Alert.alert(
          'Lỗi kết nối',
          'Không thể tải dữ liệu. Vui lòng kiểm tra kết nối internet và thử lại.',
          [{ text: 'OK' }]
        );
      }
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLatestResults();
    setRefreshing(false);
  };

  const handleLotteryTypeChange = async (type: LotteryType) => {
    setSelectedLotteryType(type);
    
    // Save preference
    const settings = await StorageService.getAppSettings();
    await StorageService.saveAppSettings({
      ...settings,
      preferredLotteryType: type,
    });
  };

  const navigateToPredictions = () => {
    navigation.navigate('Predictions', { lotteryType: selectedLotteryType });
  };

  const navigateToHistory = () => {
    navigation.navigate('History', { lotteryType: selectedLotteryType });
  };

  const navigateToStatistics = () => {
    navigation.navigate('Statistics', { lotteryType: selectedLotteryType });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const config = LOTTERY_CONFIGS[selectedLotteryType];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎲 Vietlott Analyzer</Text>
          <Text style={styles.subtitle}>Phân tích thông minh cho xổ số Việt Nam</Text>
          {lastUpdated && (
            <Text style={styles.lastUpdated}>
              Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
            </Text>
          )}
        </View>

        {/* Lottery Type Selector */}
        <LotteryTypeSelector
          selectedType={selectedLotteryType}
          onTypeChange={handleLotteryTypeChange}
        />

        {/* Latest Results Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kết quả mới nhất</Text>
            <TouchableOpacity onPress={navigateToHistory}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Đang tải...</Text>
            </View>
          ) : latestResults.length > 0 ? (
            latestResults.map((result, index) => (
              <View key={result.id || index} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultDate}>
                    {formatDate(result.drawDate)}
                  </Text>
                  {result.drawId && (
                    <Text style={styles.drawId}>#{result.drawId}</Text>
                  )}
                </View>
                <LotteryBalls
                  numbers={result.numbers}
                  powerNumber={result.powerNumber}
                  lotteryType={selectedLotteryType}
                />
                {result.jackpot && (
                  <Text style={styles.jackpot}>
                    Jackpot: {result.jackpot.toLocaleString('vi-VN')} VNĐ
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Không có dữ liệu</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tính năng</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
              onPress={navigateToPredictions}
            >
              <Ionicons name="bulb" size={24} color="white" />
              <Text style={styles.actionButtonText}>Dự đoán AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#4ECDC4' }]}
              onPress={navigateToStatistics}
            >
              <Ionicons name="stats-chart" size={24} color="white" />
              <Text style={styles.actionButtonText}>Thống kê</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#45B7D1' }]}
              onPress={navigateToHistory}
            >
              <Ionicons name="time" size={24} color="white" />
              <Text style={styles.actionButtonText}>Lịch sử</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  resultCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  drawId: {
    fontSize: 12,
    color: '#666',
  },
  jackpot: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
  },
});

export default HomeScreen;
