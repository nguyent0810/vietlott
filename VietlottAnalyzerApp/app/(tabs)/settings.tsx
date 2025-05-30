import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSettings, NotificationSettings, LotteryType } from '../../src/types/lottery';
import StorageService from '../../src/services/StorageService';
import ApiService from '../../src/services/ApiService';

export default function SettingsScreen() {
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [appSet, notifSet] = await Promise.all([
        StorageService.getAppSettings(),
        StorageService.getNotificationSettings(),
      ]);
      setAppSettings(appSet);
      setNotificationSettings(notifSet);
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  const updateAppSetting = async (key: keyof AppSettings, value: any) => {
    if (!appSettings) return;
    
    const newSettings = { ...appSettings, [key]: value };
    setAppSettings(newSettings);
    await StorageService.saveAppSettings(newSettings);
  };

  const updateNotificationSetting = async (key: keyof NotificationSettings, value: boolean) => {
    if (!notificationSettings) return;
    
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    await StorageService.saveNotificationSettings(newSettings);
  };

  const handleExportData = async () => {
    try {
      const userData = await StorageService.exportUserData();
      const dataString = JSON.stringify(userData, null, 2);
      
      await Share.share({
        message: 'Dữ liệu Vietlott Analyzer của bạn',
        title: 'Xuất dữ liệu',
        url: `data:application/json;base64,${btoa(dataString)}`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Lỗi', 'Không thể xuất dữ liệu');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Xóa dữ liệu',
      'Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              Alert.alert('Thành công', 'Đã xóa tất cả dữ liệu');
              loadSettings();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa dữ liệu');
            }
          },
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Hãy thử Vietlott Analyzer - Ứng dụng phân tích xổ số thông minh! 🎲\n\nTải về tại: https://play.google.com/store/apps/details?id=com.vietlottanalyzer.app',
        title: 'Chia sẻ Vietlott Analyzer',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const handleRateApp = () => {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.vietlottanalyzer.app';
    Linking.openURL(playStoreUrl).catch(() => {
      Alert.alert('Lỗi', 'Không thể mở Play Store');
    });
  };

  const handleContactSupport = () => {
    const email = 'support@vietlottanalyzer.com';
    const subject = 'Hỗ trợ Vietlott Analyzer';
    const body = 'Xin chào,\n\nTôi cần hỗ trợ về ứng dụng Vietlott Analyzer.\n\n';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Lỗi', 'Không thể mở ứng dụng email');
    });
  };

  const renderSettingItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: string = '⚙️'
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: '#007AFF' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  const renderActionItem = (
    title: string,
    subtitle: string,
    onPress: () => void,
    icon: string = '📱',
    color: string = '#333'
  ) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color }]}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Text style={styles.actionArrow}>›</Text>
    </TouchableOpacity>
  );

  if (loading || !appSettings || !notificationSettings) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Đang tải cài đặt...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Cài đặt</Text>
          <Text style={styles.subtitle}>Tùy chỉnh ứng dụng theo ý muốn</Text>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tùy chọn ứng dụng</Text>
          
          {renderSettingItem(
            'Chế độ tối',
            'Sử dụng giao diện tối',
            appSettings.darkMode,
            (value) => updateAppSetting('darkMode', value),
            '🌙'
          )}

          {renderSettingItem(
            'Tự động làm mới',
            'Tự động cập nhật dữ liệu mới',
            appSettings.autoRefresh,
            (value) => updateAppSetting('autoRefresh', value),
            '🔄'
          )}

          {renderSettingItem(
            'Xác thực sinh trắc học',
            'Sử dụng vân tay/khuôn mặt để bảo mật',
            appSettings.biometricEnabled,
            (value) => updateAppSetting('biometricEnabled', value),
            '🔒'
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông báo</Text>
          
          {renderSettingItem(
            'Kết quả mới',
            'Thông báo khi có kết quả xổ số mới',
            notificationSettings.newResults,
            (value) => updateNotificationSetting('newResults', value),
            '🔔'
          )}

          {renderSettingItem(
            'Cập nhật dự đoán',
            'Thông báo khi có dự đoán mới',
            notificationSettings.predictionUpdates,
            (value) => updateNotificationSetting('predictionUpdates', value),
            '💡'
          )}

          {renderSettingItem(
            'Phân tích hàng tuần',
            'Báo cáo thống kê hàng tuần',
            notificationSettings.weeklyAnalysis,
            (value) => updateNotificationSetting('weeklyAnalysis', value),
            '📊'
          )}

          {renderSettingItem(
            'Âm thanh',
            'Phát âm thanh khi có thông báo',
            notificationSettings.soundEnabled,
            (value) => updateNotificationSetting('soundEnabled', value),
            '🔊'
          )}

          {renderSettingItem(
            'Rung',
            'Rung khi có thông báo',
            notificationSettings.vibrationEnabled,
            (value) => updateNotificationSetting('vibrationEnabled', value),
            '📳'
          )}
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý dữ liệu</Text>
          
          {renderActionItem(
            'Xuất dữ liệu',
            'Sao lưu dữ liệu cá nhân',
            handleExportData,
            '📤'
          )}

          {renderActionItem(
            'Xóa tất cả dữ liệu',
            'Xóa toàn bộ dữ liệu đã lưu',
            handleClearData,
            '🗑️',
            '#dc3545'
          )}
        </View>

        {/* App Info & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ & Thông tin</Text>
          
          {renderActionItem(
            'Chia sẻ ứng dụng',
            'Giới thiệu cho bạn bè',
            handleShareApp,
            '📱'
          )}

          {renderActionItem(
            'Đánh giá ứng dụng',
            'Đánh giá trên Play Store',
            handleRateApp,
            '⭐'
          )}

          {renderActionItem(
            'Liên hệ hỗ trợ',
            'Gửi email cho đội ngũ hỗ trợ',
            handleContactSupport,
            '📧'
          )}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Vietlott Analyzer v1.0.0</Text>
          <Text style={styles.versionSubtext}>Phát triển bởi Vietlott Analyzer Team</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  actionArrow: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
