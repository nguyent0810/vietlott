import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LanguageService, { Language } from '../services/LanguageService';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

interface LanguageSelectorProps {
  style?: any;
  showLabel?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  style, 
  showLabel = true 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('vi');
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Initialize language service and get current language
    const initLanguage = async () => {
      await LanguageService.init();
      setCurrentLanguage(LanguageService.getCurrentLanguage());
    };
    
    initLanguage();

    // Listen for language changes
    const handleLanguageChange = (language: Language) => {
      setCurrentLanguage(language);
    };

    LanguageService.addLanguageChangeListener(handleLanguageChange);

    return () => {
      LanguageService.removeLanguageChangeListener(handleLanguageChange);
    };
  }, []);

  const openModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  const selectLanguage = async (language: Language) => {
    await LanguageService.setLanguage(language);
    setCurrentLanguage(language);
    closeModal();
  };

  const languages = LanguageService.getAvailableLanguages();
  const currentLangData = languages.find(lang => lang.code === currentLanguage);

  const getLanguageFlag = (code: Language) => {
    switch (code) {
      case 'vi':
        return '🇻🇳';
      case 'en':
        return '🇺🇸';
      default:
        return '🌐';
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.selector}
        onPress={openModal}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.colors.gradients.primary}
          style={styles.selectorGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.flag}>
            {getLanguageFlag(currentLanguage)}
          </Text>
          {showLabel && (
            <Text style={styles.languageText}>
              {currentLangData?.nativeName || 'Tiếng Việt'}
            </Text>
          )}
          <Text style={styles.arrow}>▼</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {LanguageService.t('settings.language')}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {LanguageService.t('settings.languageDesc')}
                  </Text>
                </View>

                <View style={styles.languageList}>
                  {languages.map((language) => (
                    <TouchableOpacity
                      key={language.code}
                      style={[
                        styles.languageOption,
                        currentLanguage === language.code && styles.selectedOption,
                      ]}
                      onPress={() => selectLanguage(language.code)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.languageInfo}>
                        <Text style={styles.languageFlag}>
                          {getLanguageFlag(language.code)}
                        </Text>
                        <View style={styles.languageTexts}>
                          <Text style={[
                            styles.languageName,
                            currentLanguage === language.code && styles.selectedText
                          ]}>
                            {language.nativeName}
                          </Text>
                          <Text style={[
                            styles.languageEnglishName,
                            currentLanguage === language.code && styles.selectedSubtext
                          ]}>
                            {language.name}
                          </Text>
                        </View>
                      </View>
                      {currentLanguage === language.code && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={theme.colors.gradients.secondary}
                    style={styles.closeButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.closeButtonText}>
                      {LanguageService.t('common.ok')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  selector: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  selectorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minWidth: 120,
  },
  flag: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  languageText: {
    flex: 1,
    color: 'white',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  arrow: {
    color: 'white',
    fontSize: 12,
    marginLeft: theme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.xl,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modalSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  languageList: {
    marginBottom: theme.spacing.xl,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary + '20',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  languageTexts: {
    flex: 1,
  },
  languageName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  languageEnglishName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  selectedText: {
    color: theme.colors.primary,
  },
  selectedSubtext: {
    color: theme.colors.primary + 'AA',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  closeButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default LanguageSelector;
