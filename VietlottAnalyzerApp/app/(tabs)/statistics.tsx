import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatisticsData, LotteryType, NumberFrequency } from '../../src/types/lottery';
import ApiService from '../../src/services/ApiService';
import StorageService from '../../src/services/StorageService';
import LotteryTypeSelector from '../../src/components/LotteryTypeSelector';

const { width } = Dimensions.get('window');

export default function StatisticsScreen() {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [selectedLotteryType, setSelectedLotteryType] = useState<LotteryType>('power655');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [selectedLotteryType]);

  const loadInitialData = async () => {
    try {
      const settings = await StorageService.getAppSettings();
      setSelectedLotteryType(settings.preferredLotteryType);
      await loadStatistics(settings.preferredLotteryType);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLoading(false);
    }
  };

  const loadStatistics = async (lotteryType: LotteryType = selectedLotteryType) => {
    try {
      const stats = await ApiService.fetchStatistics(lotteryType);
      setStatistics(stats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading statistics:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  const handleLotteryTypeChange = async (type: LotteryType) => {
    setSelectedLotteryType(type);
    
    const settings = await StorageService.getAppSettings();
    await StorageService.saveAppSettings({
      ...settings,
      preferredLotteryType: type,
    });
  };

  const renderNumberFrequency = (numbers: NumberFrequency[], title: string, color: string) => (
    <View style={styles.frequencySection}>
      <Text style={[styles.frequencyTitle, { color }]}>{title}</Text>
      <View style={styles.numbersGrid}>
        {numbers.slice(0, 10).map((item, index) => (
          <View key={item.number} style={[styles.numberItem, { borderLeftColor: color }]}>
            <View style={styles.numberInfo}>
              <Text style={styles.number}>{item.number.toString().padStart(2, '0')}</Text>
              <Text style={styles.frequency}>{item.frequency} lần</Text>
            </View>
            <Text style={styles.percentage}>{item.percentage.toFixed(1)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

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
          <Text style={styles.title}>📊 Thống kê</Text>
          <Text style={styles.subtitle}>Phân tích tần suất xuất hiện các số</Text>
        </View>

        {/* Lottery Type Selector */}
        <LotteryTypeSelector
          selectedType={selectedLotteryType}
          onTypeChange={handleLotteryTypeChange}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Đang tải thống kê...</Text>
          </View>
        ) : statistics ? (
          <>
            {/* Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tổng quan</Text>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewNumber}>{statistics.totalDraws}</Text>
                  <Text style={styles.overviewLabel}>Tổng số kỳ</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewNumber}>
                    {selectedLotteryType === 'power655' ? '55' : '45'}
                  </Text>
                  <Text style={styles.overviewLabel}>Số có thể</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewNumber}>6</Text>
                  <Text style={styles.overviewLabel}>Số mỗi kỳ</Text>
                </View>
              </View>
            </View>

            {/* Most Frequent Numbers */}
            <View style={styles.section}>
              {renderNumberFrequency(statistics.mostFrequent, '🔥 Số xuất hiện nhiều nhất', '#FF6B6B')}
            </View>

            {/* Least Frequent Numbers */}
            <View style={styles.section}>
              {renderNumberFrequency(statistics.leastFrequent, '❄️ Số xuất hiện ít nhất', '#4ECDC4')}
            </View>

            {/* Recent Trends */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📈 xu hướng gần đây</Text>
              
              <View style={styles.trendSection}>
                <Text style={styles.trendTitle}>30 ngày qua</Text>
                <View style={styles.trendNumbers}>
                  {statistics.recentTrends.last30Days.slice(0, 6).map((item) => (
                    <View key={item.number} style={styles.trendNumber}>
                      <Text style={styles.trendNumberText}>{item.number.toString().padStart(2, '0')}</Text>
                      <Text style={styles.trendFrequency}>{item.frequency}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.trendSection}>
                <Text style={styles.trendTitle}>60 ngày qua</Text>
                <View style={styles.trendNumbers}>
                  {statistics.recentTrends.last60Days.slice(0, 6).map((item) => (
                    <View key={item.number} style={styles.trendNumber}>
                      <Text style={styles.trendNumberText}>{item.number.toString().padStart(2, '0')}</Text>
                      <Text style={styles.trendFrequency}>{item.frequency}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.trendSection}>
                <Text style={styles.trendTitle}>90 ngày qua</Text>
                <View style={styles.trendNumbers}>
                  {statistics.recentTrends.last90Days.slice(0, 6).map((item) => (
                    <View key={item.number} style={styles.trendNumber}>
                      <Text style={styles.trendNumberText}>{item.number.toString().padStart(2, '0')}</Text>
                      <Text style={styles.trendFrequency}>{item.frequency}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Không có dữ liệu thống kê</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  frequencySection: {
    marginBottom: 10,
  },
  frequencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numberItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  numberInfo: {
    flex: 1,
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  frequency: {
    fontSize: 12,
    color: '#666',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  trendSection: {
    marginBottom: 15,
  },
  trendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  trendNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendNumber: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    minWidth: 40,
  },
  trendNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  trendFrequency: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
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
