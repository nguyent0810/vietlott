import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LotteryType, LOTTERY_CONFIGS } from "../types/lottery";
import LanguageService, { Language } from "../services/LanguageService";
import { theme } from "../theme/theme";

interface LotteryTypeSelectorProps {
  selectedType: LotteryType;
  onTypeChange: (type: LotteryType) => void;
  style?: any;
}

const LotteryTypeSelector: React.FC<LotteryTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  style,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("vi");

  useEffect(() => {
    const initLanguage = async () => {
      await LanguageService.init();
      setCurrentLanguage(LanguageService.getCurrentLanguage());
    };

    initLanguage();

    const handleLanguageChange = (language: Language) => {
      setCurrentLanguage(language);
    };

    LanguageService.addLanguageChangeListener(handleLanguageChange);

    return () => {
      LanguageService.removeLanguageChangeListener(handleLanguageChange);
    };
  }, []);

  const renderOption = (type: LotteryType) => {
    const config = LOTTERY_CONFIGS[type];
    const isSelected = selectedType === type;
    const gradientColors =
      type === "power655"
        ? theme.colors.gradients.power655
        : theme.colors.gradients.mega645;

    return (
      <TouchableOpacity
        key={type}
        style={[styles.option, isSelected && styles.selectedOption]}
        onPress={() => onTypeChange(type)}
        activeOpacity={0.8}
      >
        {isSelected ? (
          <LinearGradient
            colors={gradientColors}
            style={styles.optionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.icon}>{config.icon}</Text>
            <Text style={[styles.optionText, styles.selectedOptionText]}>
              {LanguageService.t(`lottery.${type}`)}
            </Text>
            <Text style={[styles.description, styles.selectedDescription]}>
              {LanguageService.t(`lottery.${type}Desc`)}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.optionContent}>
            <Text style={styles.icon}>{config.icon}</Text>
            <Text style={styles.optionText}>
              {LanguageService.t(`lottery.${type}`)}
            </Text>
            <Text style={styles.description}>
              {LanguageService.t(`lottery.${type}Desc`)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>
        {LanguageService.t("lottery.selectType")}
      </Text>
      <View style={styles.optionsContainer}>
        {(Object.keys(LOTTERY_CONFIGS) as LotteryType[]).map(renderOption)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  option: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  selectedOption: {
    ...theme.aiTheme.neonGlow.primary,
  },
  optionGradient: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  optionContent: {
    padding: theme.spacing.lg,
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  icon: {
    fontSize: 28,
    marginBottom: theme.spacing.sm,
  },
  optionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  selectedOptionText: {
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight:
      theme.typography.lineHeight.normal * theme.typography.fontSize.xs,
  },
  selectedDescription: {
    color: "rgba(255, 255, 255, 0.9)",
  },
});

export default LotteryTypeSelector;
