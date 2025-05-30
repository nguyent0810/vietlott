import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'vi' | 'en';

interface Translations {
  [key: string]: {
    vi: string;
    en: string;
  };
}

const translations: Translations = {
  // App Title
  'app.title': {
    vi: '🎲 Vietlott Analyzer',
    en: '🎲 Vietlott Analyzer'
  },
  'app.subtitle': {
    vi: 'Phân tích thông minh cho xổ số Việt Nam',
    en: 'Smart analysis for Vietnamese lottery'
  },

  // Navigation
  'nav.home': {
    vi: 'Trang chủ',
    en: 'Home'
  },
  'nav.predictions': {
    vi: 'Dự đoán AI',
    en: 'AI Predictions'
  },
  'nav.statistics': {
    vi: 'Thống kê',
    en: 'Statistics'
  },
  'nav.history': {
    vi: 'Lịch sử',
    en: 'History'
  },
  'nav.settings': {
    vi: 'Cài đặt',
    en: 'Settings'
  },

  // Home Screen
  'home.title': {
    vi: '🏠 Trang chủ',
    en: '🏠 Home'
  },
  'home.latestResults': {
    vi: 'Kết quả mới nhất',
    en: 'Latest Results'
  },
  'home.viewAll': {
    vi: 'Xem tất cả',
    en: 'View All'
  },
  'home.features': {
    vi: 'Tính năng AI',
    en: 'AI Features'
  },
  'home.loading': {
    vi: 'Đang tải...',
    en: 'Loading...'
  },
  'home.noData': {
    vi: 'Không có dữ liệu',
    en: 'No data available'
  },
  'home.lastUpdated': {
    vi: 'Cập nhật',
    en: 'Updated'
  },

  // Predictions Screen
  'predictions.title': {
    vi: '🤖 Dự đoán AI',
    en: '🤖 AI Predictions'
  },
  'predictions.subtitle': {
    vi: 'Thuật toán thông minh phân tích và dự đoán',
    en: 'Smart algorithms analyze and predict'
  },
  'predictions.generating': {
    vi: 'Đang tạo dự đoán...',
    en: 'Generating predictions...'
  },
  'predictions.confidence': {
    vi: 'Tin cậy',
    en: 'Confidence'
  },
  'predictions.save': {
    vi: '💾 Lưu dự đoán',
    en: '💾 Save Prediction'
  },
  'predictions.saved': {
    vi: 'Đã lưu',
    en: 'Saved'
  },
  'predictions.savedMessage': {
    vi: 'Dự đoán đã được lưu vào danh sách của bạn.',
    en: 'Prediction has been saved to your list.'
  },

  // Statistics Screen
  'statistics.title': {
    vi: '📊 Thống kê AI',
    en: '📊 AI Statistics'
  },
  'statistics.subtitle': {
    vi: 'Phân tích tần suất xuất hiện các số',
    en: 'Frequency analysis of numbers'
  },
  'statistics.overview': {
    vi: 'Tổng quan',
    en: 'Overview'
  },
  'statistics.totalDraws': {
    vi: 'Tổng số kỳ',
    en: 'Total Draws'
  },
  'statistics.possibleNumbers': {
    vi: 'Số có thể',
    en: 'Possible Numbers'
  },
  'statistics.numbersPerDraw': {
    vi: 'Số mỗi kỳ',
    en: 'Numbers per Draw'
  },
  'statistics.hotNumbers': {
    vi: '🔥 Số nóng - Xuất hiện nhiều nhất',
    en: '🔥 Hot Numbers - Most Frequent'
  },
  'statistics.coldNumbers': {
    vi: '❄️ Số lạnh - Xuất hiện ít nhất',
    en: '❄️ Cold Numbers - Least Frequent'
  },
  'statistics.recentTrends': {
    vi: '📈 Xu hướng gần đây',
    en: '📈 Recent Trends'
  },

  // History Screen
  'history.title': {
    vi: '🕒 Lịch sử kết quả',
    en: '🕒 Result History'
  },
  'history.subtitle': {
    vi: 'Tra cứu và tìm kiếm kết quả xổ số',
    en: 'Search and browse lottery results'
  },
  'history.search': {
    vi: '🔍 Tìm kiếm',
    en: '🔍 Search'
  },
  'history.searchPlaceholder': {
    vi: 'Tìm theo số kỳ, ngày, hoặc số...',
    en: 'Search by draw ID, date, or numbers...'
  },
  'history.resultsFound': {
    vi: 'kết quả',
    en: 'results found'
  },
  'history.noResults': {
    vi: 'Không tìm thấy kết quả nào',
    en: 'No results found'
  },

  // Settings Screen
  'settings.title': {
    vi: '⚙️ Cài đặt',
    en: '⚙️ Settings'
  },
  'settings.subtitle': {
    vi: 'Tùy chỉnh ứng dụng theo ý muốn',
    en: 'Customize your app experience'
  },
  'settings.language': {
    vi: 'Ngôn ngữ',
    en: 'Language'
  },
  'settings.languageDesc': {
    vi: 'Chọn ngôn ngữ hiển thị',
    en: 'Choose display language'
  },
  'settings.appPreferences': {
    vi: 'Tùy chọn ứng dụng',
    en: 'App Preferences'
  },
  'settings.darkMode': {
    vi: 'Chế độ tối',
    en: 'Dark Mode'
  },
  'settings.darkModeDesc': {
    vi: 'Sử dụng giao diện tối',
    en: 'Use dark interface'
  },
  'settings.autoRefresh': {
    vi: 'Tự động làm mới',
    en: 'Auto Refresh'
  },
  'settings.autoRefreshDesc': {
    vi: 'Tự động cập nhật dữ liệu mới',
    en: 'Automatically update new data'
  },
  'settings.notifications': {
    vi: 'Thông báo',
    en: 'Notifications'
  },
  'settings.newResults': {
    vi: 'Kết quả mới',
    en: 'New Results'
  },
  'settings.newResultsDesc': {
    vi: 'Thông báo khi có kết quả xổ số mới',
    en: 'Notify when new lottery results available'
  },

  // Lottery Types
  'lottery.power655': {
    vi: 'Power 6/55',
    en: 'Power 6/55'
  },
  'lottery.mega645': {
    vi: 'Mega 6/45',
    en: 'Mega 6/45'
  },
  'lottery.selectType': {
    vi: 'Chọn loại xổ số',
    en: 'Select lottery type'
  },
  'lottery.power655Desc': {
    vi: 'Chọn 6 số từ 1-55 và 1 số Power từ 1-55',
    en: 'Choose 6 numbers from 1-55 and 1 Power number from 1-55'
  },
  'lottery.mega645Desc': {
    vi: 'Chọn 6 số từ 1-45',
    en: 'Choose 6 numbers from 1-45'
  },

  // AI Algorithms
  'algorithm.hotNumbers': {
    vi: 'Số Nóng',
    en: 'Hot Numbers'
  },
  'algorithm.hotNumbersDesc': {
    vi: 'Số xuất hiện nhiều nhất trong các kỳ gần đây',
    en: 'Numbers that appear most frequently in recent draws'
  },
  'algorithm.coldNumbers': {
    vi: 'Số Lạnh',
    en: 'Cold Numbers'
  },
  'algorithm.coldNumbersDesc': {
    vi: 'Số chưa xuất hiện gần đây và có thể "đến lượt"',
    en: 'Numbers that haven\'t appeared recently and may be "due"'
  },
  'algorithm.balancedMix': {
    vi: 'Kết Hợp Cân Bằng',
    en: 'Balanced Mix'
  },
  'algorithm.balancedMixDesc': {
    vi: 'Kết hợp số nóng và số lạnh để cân bằng',
    en: 'Combination of hot and cold numbers for balance'
  },
  'algorithm.aiEnsemble': {
    vi: 'AI Tổng Hợp',
    en: 'AI Ensemble'
  },
  'algorithm.aiEnsembleDesc': {
    vi: 'Thuật toán AI tiên tiến kết hợp nhiều phương pháp dự đoán',
    en: 'Advanced AI algorithm combining multiple prediction methods'
  },

  // Common
  'common.ok': {
    vi: 'OK',
    en: 'OK'
  },
  'common.cancel': {
    vi: 'Hủy',
    en: 'Cancel'
  },
  'common.save': {
    vi: 'Lưu',
    en: 'Save'
  },
  'common.delete': {
    vi: 'Xóa',
    en: 'Delete'
  },
  'common.error': {
    vi: 'Lỗi',
    en: 'Error'
  },
  'common.success': {
    vi: 'Thành công',
    en: 'Success'
  },
  'common.loading': {
    vi: 'Đang tải...',
    en: 'Loading...'
  },

  // Error Messages
  'error.connectionFailed': {
    vi: 'Lỗi kết nối',
    en: 'Connection Error'
  },
  'error.connectionMessage': {
    vi: 'Không thể tải dữ liệu. Vui lòng kiểm tra kết nối internet và thử lại.',
    en: 'Unable to load data. Please check your internet connection and try again.'
  },
  'error.predictionFailed': {
    vi: 'Không thể tạo dự đoán. Vui lòng thử lại sau.',
    en: 'Unable to generate predictions. Please try again later.'
  },

  // Action Buttons
  'action.aiPredictions': {
    vi: 'Dự đoán AI',
    en: 'AI Predictions'
  },
  'action.statistics': {
    vi: 'Thống kê',
    en: 'Statistics'
  },
  'action.history': {
    vi: 'Lịch sử',
    en: 'History'
  },
};

class LanguageService {
  private currentLanguage: Language = 'vi'; // Default to Vietnamese
  private listeners: ((language: Language) => void)[] = [];

  async init(): Promise<void> {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
        this.currentLanguage = savedLanguage as Language;
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  async setLanguage(language: Language): Promise<void> {
    this.currentLanguage = language;
    try {
      await AsyncStorage.setItem('app_language', language);
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }

  translate(key: string): string {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage] || translation.vi || key;
  }

  // Short alias for translate
  t(key: string): string {
    return this.translate(key);
  }

  addLanguageChangeListener(listener: (language: Language) => void): void {
    this.listeners.push(listener);
  }

  removeLanguageChangeListener(listener: (language: Language) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  getAvailableLanguages(): { code: Language; name: string; nativeName: string }[] {
    return [
      { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
      { code: 'en', name: 'English', nativeName: 'English' },
    ];
  }
}

export default new LanguageService();
