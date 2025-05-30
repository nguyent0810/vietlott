import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LotteryResult, LotteryType } from '../../src/types/lottery';
import ApiService from '../../src/services/ApiService';
import StorageService from '../../src/services/StorageService';
import LotteryBalls from '../../src/components/LotteryBalls';
import LotteryTypeSelector from '../../src/components/LotteryTypeSelector';

export default function HistoryScreen() {
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<LotteryResult[]>([]);
  const [selectedLotteryType, setSelectedLotteryType] = useState<LotteryType>('power655');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadResults();
  }, [selectedLotteryType]);

  useEffect(() => {
    filterResults();
  }, [results, searchQuery]);

  const loadInitialData = async () => {
    try {
      const settings = await StorageService.getAppSettings();
      setSelectedLotteryType(settings.preferredLotteryType);
      await loadResults(settings.preferredLotteryType);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLoading(false);
    }
  };

  const loadResults = async (lotteryType: LotteryType = selectedLotteryType) => {
    try {
      const data = await ApiService.fetchLotteryData(lotteryType);
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading results:', error);
      
      // Try to load from cache
      const cachedResults = await StorageService.getCachedResults(lotteryType);
      if (cachedResults.length > 0) {
        setResults(cachedResults);
      }
      setLoading(false);
    }
  };

  const filterResults = () => {
    if (!searchQuery.trim()) {
      setFilteredResults(results);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = results.filter(result => {
      // Search by draw ID
      if (result.drawId && result.drawId.toString().includes(query)) {
        return true;
      }
      
      // Search by date
      if (result.drawDate.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search by numbers
      if (result.numbers.some(num => num.toString().includes(query))) {
        return true;
      }
      
      // Search by power number
      if (result.powerNumber && result.powerNumber.toString().includes(query)) {
        return true;
      }
      
      return false;
    });
    
    setFilteredResults(filtered);
    setCurrentPage(1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResults();
    setRefreshing(false);
  };

  const handleLotteryTypeChange = async (type: LotteryType) => {
    setSelectedLotteryType(type);
    setSearchQuery('');
    setCurrentPage(1);
    
    const settings = await StorageService.getAppSettings();
    await StorageService.saveAppSettings({
      ...settings,
      preferredLotteryType: type,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPaginatedResults = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredResults.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

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
          <Text style={styles.title}>🕒 Lịch sử kết quả</Text>
          <Text style={styles.subtitle}>Tra cứu và tìm kiếm kết quả xổ số</Text>
        </View>

        {/* Lottery Type Selector */}
        <LotteryTypeSelector
          selectedType={selectedLotteryType}
          onTypeChange={handleLotteryTypeChange}
        />

        {/* Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Tìm kiếm</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo số kỳ, ngày, hoặc số..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <Text style={styles.searchResults}>
              Tìm thấy {filteredResults.length} kết quả
            </Text>
          ) : null}
        </View>

        {/* Results */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Kết quả {selectedLotteryType === 'power655' ? 'Power 6/55' : 'Mega 6/45'}
            </Text>
            <Text style={styles.totalResults}>
              {filteredResults.length} kết quả
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Đang tải...</Text>
            </View>
          ) : getPaginatedResults().length > 0 ? (
            <>
              {getPaginatedResults().map((result, index) => (
                <View key={result.id || index} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <View>
                      <Text style={styles.resultDate}>
                        {formatDate(result.drawDate)}
                      </Text>
                      {result.drawId && (
                        <Text style={styles.drawId}>Kỳ #{result.drawId}</Text>
                      )}
                    </View>
                    {result.jackpot && (
                      <View style={styles.jackpotContainer}>
                        <Text style={styles.jackpotLabel}>Jackpot</Text>
                        <Text style={styles.jackpot}>
                          {result.jackpot.toLocaleString('vi-VN')} VNĐ
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.numbersContainer}>
                    <LotteryBalls
                      numbers={result.numbers}
                      powerNumber={result.powerNumber}
                      lotteryType={selectedLotteryType}
                      size="small"
                      showLabels={false}
                    />
                  </View>
                </View>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <View style={styles.pagination}>
                  <TouchableOpacity
                    style={[
                      styles.pageButton,
                      currentPage === 1 && styles.pageButtonDisabled
                    ]}
                    onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <Text style={[
                      styles.pageButtonText,
                      currentPage === 1 && styles.pageButtonTextDisabled
                    ]}>
                      ← Trước
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.pageInfo}>
                    Trang {currentPage} / {totalPages}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.pageButton,
                      currentPage === totalPages && styles.pageButtonDisabled
                    ]}
                    onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <Text style={[
                      styles.pageButtonText,
                      currentPage === totalPages && styles.pageButtonTextDisabled
                    ]}>
                      Sau →
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                {searchQuery ? 'Không tìm thấy kết quả nào' : 'Không có dữ liệu'}
              </Text>
            </View>
          )}
        </View>
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
  totalResults: {
    fontSize: 12,
    color: '#666',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  searchResults: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
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
    alignItems: 'flex-start',
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
    marginTop: 2,
  },
  jackpotContainer: {
    alignItems: 'flex-end',
  },
  jackpotLabel: {
    fontSize: 10,
    color: '#666',
  },
  jackpot: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  numbersContainer: {
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  pageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pageButtonTextDisabled: {
    color: '#999',
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
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
