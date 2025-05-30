# 🎲 Vietlott Analyzer - Android App

A modern React Native/Expo app for analyzing Vietnamese lottery data with AI-powered predictions.

## 📱 Features

### 🤖 AI-Powered Predictions

- **Hot Numbers**: Most frequently drawn numbers
- **Cold Numbers**: Numbers that haven't appeared recently
- **Balanced Mix**: Combination of hot and cold numbers
- **AI Ensemble**: Advanced algorithm combining multiple strategies
- **Confidence Ratings**: Each prediction comes with accuracy confidence

### 📊 Comprehensive Statistics

- **Frequency Analysis**: Detailed number frequency charts
- **Trend Analysis**: 30, 60, 90-day trend tracking
- **Hot/Cold Number Identification**: Visual representation of number patterns

### 🕒 Complete Historical Data

- **1000+ Results**: Access to extensive historical lottery data
- **Search & Filter**: Find specific draws by date, numbers, or draw ID
- **Offline Access**: Cached data for offline viewing
- **Real-time Updates**: Automatic fetching of latest results

### 🎯 Supported Lottery Types

- **Power 6/55**: Choose 6 numbers from 1-55 + Power number
- **Mega 6/45**: Choose 6 numbers from 1-45

### ✨ Mobile-Specific Features

- **Offline Functionality**: Works without internet connection
- **Push Notifications**: Get notified of new results
- **Dark Mode**: Beautiful dark theme support
- **Data Export**: Backup your predictions and settings
- **Vietnamese Interface**: Fully localized for Vietnamese users

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- Android Studio (for testing)
- Expo Go app (for device testing)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android device/emulator
npx expo start --android
```

## 📱 App Structure

```
VietlottAnalyzerApp/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── predictions.tsx # AI predictions
│   │   ├── statistics.tsx  # Statistics & charts
│   │   ├── history.tsx     # Historical data
│   │   └── settings.tsx    # App settings
│   └── _layout.tsx        # Root layout
├── src/                   # Source code
│   ├── components/        # Reusable components
│   ├── services/          # Business logic
│   └── types/            # TypeScript definitions
├── store/                # App store assets
├── app.json              # Expo configuration
├── eas.json              # Build configuration
└── BUILD_INSTRUCTIONS.md # Deployment guide
```

## 🛡️ Privacy & Security

### Data Protection

- **Local Storage**: All user data stored locally on device
- **No Personal Data**: No collection of personal information
- **Encrypted Transmission**: HTTPS for all network requests
- **User Control**: Full control over data export/deletion

### Permissions

- **INTERNET**: Fetch lottery results
- **ACCESS_NETWORK_STATE**: Check connectivity
- **VIBRATE**: Notification feedback

## 🚀 Deployment to Google Play Store

### Build Production AAB

```bash
npx eas build --platform android --profile production
```

### Upload to Play Console

1. Create app listing using `store/play-store-listing.md`
2. Upload AAB file
3. Complete content rating and data safety
4. Submit for review

See `BUILD_INSTRUCTIONS.md` for detailed deployment guide.

## 📞 Support

- **Email**: support@vietlottanalyzer.com
- **Website**: https://vietlott-analyzer.vercel.app
- **Play Store**: Ready for publication!

---

**Ready for Google Play Store! 🎉**

This app is fully configured and ready for deployment to Google Play Store with all necessary compliance measures in place.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
