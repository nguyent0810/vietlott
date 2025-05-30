import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  LotteryResult,
  LotteryType,
  LOTTERY_CONFIGS,
} from "../../src/types/lottery";
import ApiService from "../../src/services/ApiService";
import StorageService from "../../src/services/StorageService";
import LanguageService, { Language } from "../../src/services/LanguageService";
import LotteryBalls from "../../src/components/LotteryBalls";
import LotteryTypeSelector from "../../src/components/LotteryTypeSelector";
import LanguageSelector from "../../src/components/LanguageSelector";
import { theme } from "../../src/theme/theme";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [latestResults, setLatestResults] = useState<LotteryResult[]>([]);
  const [selectedLotteryType, setSelectedLotteryType] =
    useState<LotteryType>("power655");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("vi");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadLatestResults();
  }, [selectedLotteryType]);

  const loadInitialData = async () => {
    try {
      // Initialize language service
      await LanguageService.init();
      setCurrentLanguage(LanguageService.getCurrentLanguage());

      // Load user preferences
      const settings = await StorageService.getAppSettings();
      setSelectedLotteryType(settings.preferredLotteryType);

      // Load cached data first
      const cachedResults = await StorageService.getCachedResults(
        settings.preferredLotteryType
      );
      if (cachedResults.length > 0) {
        setLatestResults(cachedResults.slice(0, 5));
        setLoading(false);
      }

      // Then fetch fresh data
      await loadLatestResults(settings.preferredLotteryType);
    } catch (error) {
      console.error("Error loading initial data:", error);
      setLoading(false);
    }
  };

  const loadLatestResults = async (
    lotteryType: LotteryType = selectedLotteryType
  ) => {
    try {
      console.log(`Loading latest results for ${lotteryType}...`);
      const results = await ApiService.fetchLatestResults(lotteryType);
      console.log(`Loaded ${results.length} results:`, results.slice(0, 2));

      setLatestResults(results);
      setLastUpdated(new Date());

      // Cache the results
      await StorageService.saveCachedResults(lotteryType, results);
      await StorageService.updateLastSync();

      setLoading(false);
    } catch (error) {
      console.error("Error loading latest results:", error);

      // Try to load from cache if API fails
      const cachedResults = await StorageService.getCachedResults(lotteryType);
      if (cachedResults.length > 0) {
        console.log(`Using cached results: ${cachedResults.length} items`);
        setLatestResults(cachedResults.slice(0, 5));
      } else {
        console.log("No cached results available, showing error");
        Alert.alert(
          LanguageService.t("error.connectionFailed"),
          LanguageService.t("error.connectionMessage"),
          [{ text: LanguageService.t("common.ok") }]
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
    router.push("/predictions");
  };

  const navigateToHistory = () => {
    router.push("/history");
  };

  const navigateToStatistics = () => {
    router.push("/statistics");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <LinearGradient
          colors={theme.colors.gradients.primary}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.titleSection}>
                <Text style={styles.title}>
                  {LanguageService.t("app.title")}
                </Text>
                <Text style={styles.subtitle}>
                  {LanguageService.t("app.subtitle")}
                </Text>
              </View>
              <LanguageSelector showLabel={false} />
            </View>
            {lastUpdated && (
              <View style={styles.updateInfo}>
                <View style={styles.updateIndicator} />
                <Text style={styles.lastUpdated}>
                  {LanguageService.t("home.lastUpdated")}:{" "}
                  {lastUpdated.toLocaleTimeString(
                    currentLanguage === "vi" ? "vi-VN" : "en-US"
                  )}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Lottery Type Selector */}
        <LotteryTypeSelector
          selectedType={selectedLotteryType}
          onTypeChange={handleLotteryTypeChange}
        />

        {/* Latest Results Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {LanguageService.t("home.latestResults")}
            </Text>
            <TouchableOpacity onPress={navigateToHistory}>
              <Text style={styles.viewAllText}>
                {LanguageService.t("home.viewAll")}
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                {LanguageService.t("home.loading")}
              </Text>
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
                    Jackpot: {result.jackpot.toLocaleString("vi-VN")} VNĐ
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                {LanguageService.t("home.noData")}
              </Text>
            </View>
          )}
        </View>

        {/* AI Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {LanguageService.t("home.features")}
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToPredictions}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.colors.gradients.ai}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionIcon}>🤖</Text>
                <Text style={styles.actionButtonText}>
                  {LanguageService.t("action.aiPredictions")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToStatistics}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.colors.gradients.secondary}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionButtonText}>
                  {LanguageService.t("action.statistics")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToHistory}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.colors.gradients.primary}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionIcon}>🕒</Text>
                <Text style={styles.actionButtonText}>
                  {LanguageService.t("action.history")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: theme.spacing["4xl"],
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  titleSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  title: {
    fontSize: theme.typography.fontSize["3xl"],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: "white",
    marginBottom: theme.spacing.sm,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "left",
    lineHeight:
      theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
  },
  updateInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    ...theme.aiTheme.glassmorphism,
  },
  updateIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: theme.spacing.sm,
  },
  lastUpdated: {
    fontSize: theme.typography.fontSize.xs,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: theme.typography.fontWeight.medium,
  },
  section: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  viewAllText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  resultCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  resultDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  drawId: {
    fontSize: 12,
    color: "#666",
  },
  jackpot: {
    fontSize: 12,
    color: "#28a745",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  actionGradient: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: theme.spacing.sm,
  },
  actionButtonText: {
    color: "white",
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    paddingVertical: theme.spacing["3xl"],
    alignItems: "center",
  },
  loadingText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  noDataContainer: {
    paddingVertical: theme.spacing["3xl"],
    alignItems: "center",
  },
  noDataText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
