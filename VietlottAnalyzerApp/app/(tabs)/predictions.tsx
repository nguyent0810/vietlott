import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PredictionAlgorithm, LotteryType } from "../../src/types/lottery";
import ApiService from "../../src/services/ApiService";
import StorageService from "../../src/services/StorageService";
import LotteryBalls from "../../src/components/LotteryBalls";
import LotteryTypeSelector from "../../src/components/LotteryTypeSelector";

export default function PredictionsScreen() {
  const [predictions, setPredictions] = useState<PredictionAlgorithm[]>([]);
  const [selectedLotteryType, setSelectedLotteryType] =
    useState<LotteryType>("power655");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadPredictions();
  }, [selectedLotteryType]);

  const loadInitialData = async () => {
    try {
      const settings = await StorageService.getAppSettings();
      setSelectedLotteryType(settings.preferredLotteryType);
      await loadPredictions(settings.preferredLotteryType);
    } catch (error) {
      console.error("Error loading initial data:", error);
      setLoading(false);
    }
  };

  const loadPredictions = async (
    lotteryType: LotteryType = selectedLotteryType
  ) => {
    try {
      console.log(`Loading predictions for ${lotteryType}...`);
      const predictions = await ApiService.generatePredictions(lotteryType);
      console.log(
        `Generated ${predictions.length} predictions:`,
        predictions.map((p) => p.name)
      );
      setPredictions(predictions);
      setLoading(false);
    } catch (error) {
      console.error("Error loading predictions:", error);
      Alert.alert("Lỗi", "Không thể tạo dự đoán. Vui lòng thử lại sau.", [
        { text: "OK" },
      ]);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPredictions();
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

  const savePrediction = async (prediction: PredictionAlgorithm) => {
    try {
      const userPrediction = {
        id: Date.now().toString(),
        numbers: prediction.numbers,
        powerNumber: prediction.powerNumber,
        algorithm: prediction.name,
        confidence: prediction.confidence,
        createdAt: new Date().toISOString(),
        lotteryType: selectedLotteryType,
      };

      await StorageService.savePrediction(userPrediction);
      Alert.alert("Đã lưu", "Dự đoán đã được lưu vào danh sách của bạn.", [
        { text: "OK" },
      ]);
    } catch (error) {
      console.error("Error saving prediction:", error);
      Alert.alert("Lỗi", "Không thể lưu dự đoán. Vui lòng thử lại.", [
        { text: "OK" },
      ]);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "#28a745";
    if (confidence >= 60) return "#ffc107";
    return "#dc3545";
  };

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
          <Text style={styles.title}>🤖 Dự đoán AI</Text>
          <Text style={styles.subtitle}>
            Thuật toán thông minh phân tích và dự đoán
          </Text>
        </View>

        {/* Lottery Type Selector */}
        <LotteryTypeSelector
          selectedType={selectedLotteryType}
          onTypeChange={handleLotteryTypeChange}
        />

        {/* Predictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Dự đoán cho{" "}
            {selectedLotteryType === "power655" ? "Power 6/55" : "Mega 6/45"}
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Đang tạo dự đoán...</Text>
            </View>
          ) : predictions.length > 0 ? (
            predictions.map((prediction, index) => (
              <View key={prediction.id} style={styles.predictionCard}>
                <View style={styles.predictionHeader}>
                  <View>
                    <Text style={styles.algorithmName}>{prediction.name}</Text>
                    <Text style={styles.algorithmDescription}>
                      {prediction.description}
                    </Text>
                  </View>
                  <View style={styles.confidenceContainer}>
                    <Text
                      style={[
                        styles.confidence,
                        { color: getConfidenceColor(prediction.confidence) },
                      ]}
                    >
                      {prediction.confidence}%
                    </Text>
                    <Text style={styles.confidenceLabel}>Tin cậy</Text>
                  </View>
                </View>

                <View style={styles.numbersContainer}>
                  <LotteryBalls
                    numbers={prediction.numbers}
                    powerNumber={prediction.powerNumber}
                    lotteryType={selectedLotteryType}
                    size="medium"
                  />
                </View>

                <View style={styles.predictionActions}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => savePrediction(prediction)}
                  >
                    <Text style={styles.saveButtonText}>💾 Lưu dự đoán</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Không có dự đoán</Text>
            </View>
          )}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ Lưu ý: Đây chỉ là dự đoán dựa trên phân tích thống kê. Kết quả xổ
            số hoàn toàn ngẫu nhiên và không thể dự đoán chính xác 100%.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  predictionCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  predictionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  algorithmName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  algorithmDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  confidenceContainer: {
    alignItems: "center",
  },
  confidence: {
    fontSize: 20,
    fontWeight: "bold",
  },
  confidenceLabel: {
    fontSize: 10,
    color: "#666",
  },
  numbersContainer: {
    marginVertical: 15,
  },
  predictionActions: {
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  disclaimer: {
    backgroundColor: "#fff3cd",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#856404",
    lineHeight: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  noDataContainer: {
    padding: 20,
    alignItems: "center",
  },
  noDataText: {
    color: "#666",
    fontSize: 16,
  },
});
