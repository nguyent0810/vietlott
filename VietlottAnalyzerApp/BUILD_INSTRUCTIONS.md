# 🚀 Build Instructions for Google Play Store

This guide will help you build and deploy the Vietlott Analyzer Android app to Google Play Store.

## 📋 Prerequisites

### Required Software
- **Node.js** 18+ 
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **EAS CLI**: `npm install -g eas-cli`
- **Android Studio** (for local builds)
- **Java JDK** 17+

### Required Accounts
- **Expo Account** (free)
- **Google Play Console Account** ($25 one-time fee)
- **Google Cloud Console Account** (for service account)

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
cd VietlottAnalyzerApp
npm install
```

### 2. Configure Expo Account
```bash
npx expo login
```

### 3. Configure EAS
```bash
eas login
eas build:configure
```

## 🏗️ Building the App

### Development Build (Testing)
```bash
# Build APK for testing
eas build --platform android --profile preview

# Build for development
eas build --platform android --profile development
```

### Production Build (Play Store)
```bash
# Build AAB for Play Store
eas build --platform android --profile production

# Alternative: Build APK for sideloading
eas build --platform android --profile production-apk
```

## 🔐 Code Signing Setup

### 1. Generate Keystore (Automatic)
EAS will automatically generate and manage your keystore for production builds.

### 2. Manual Keystore (Optional)
If you want to manage your own keystore:

```bash
# Generate keystore
keytool -genkey -v -keystore vietlott-analyzer.keystore -alias vietlott-analyzer -keyalg RSA -keysize 2048 -validity 10000

# Configure in eas.json
```

## 📱 Google Play Store Setup

### 1. Create App in Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in app details:
   - **App name**: Vietlott Analyzer
   - **Default language**: Vietnamese
   - **App category**: Entertainment
   - **Content rating**: Everyone (with gambling disclaimer)

### 2. App Content & Policies
- **Privacy Policy**: Upload `store/privacy-policy.md` content to your website
- **Content Rating**: Complete questionnaire (select gambling content)
- **Target Audience**: 18+ due to lottery content
- **Data Safety**: Complete based on our privacy practices

### 3. Store Listing
Use content from `store/play-store-listing.md`:
- App title, descriptions, keywords
- Screenshots (create 5 screenshots as described)
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)

## 🚀 Deployment Process

### 1. Upload to Play Console
```bash
# Build production AAB
eas build --platform android --profile production

# Submit to Play Store (requires service account setup)
eas submit --platform android --profile production
```

### 2. Manual Upload
1. Download AAB from EAS build
2. Go to Play Console → App releases
3. Create new release in Internal testing
4. Upload AAB file
5. Complete release notes
6. Review and publish

### 3. Release Tracks
- **Internal testing**: For team testing
- **Closed testing**: For beta users
- **Open testing**: Public beta
- **Production**: Live on Play Store

## 🔧 Configuration Files

### app.json
Key configurations for Play Store compliance:
```json
{
  "expo": {
    "name": "Vietlott Analyzer",
    "android": {
      "package": "com.vietlottanalyzer.app",
      "versionCode": 1,
      "permissions": ["INTERNET", "ACCESS_NETWORK_STATE", "VIBRATE"],
      "playStoreUrl": "https://play.google.com/store/apps/details?id=com.vietlottanalyzer.app"
    }
  }
}
```

### eas.json
Build profiles for different environments:
- `development`: For development builds
- `preview`: For testing APKs
- `production`: For Play Store AAB

## 📊 App Store Optimization (ASO)

### Keywords Strategy
- **Primary**: vietlott, lottery vietnam, xổ số việt nam
- **Secondary**: AI predictions, lottery statistics
- **Long-tail**: vietlott power 6/55 predictions

### Screenshots Requirements
- **Phone**: 16:9 or 9:16 aspect ratio
- **Tablet**: 16:10 or 10:16 aspect ratio
- **Minimum**: 320px on shortest side
- **Maximum**: 3840px on longest side

## 🛡️ Security & Compliance

### Google Play Policies Compliance
✅ **Gambling Policy**: Educational/statistical analysis only
✅ **Privacy Policy**: Comprehensive privacy policy included
✅ **Data Safety**: Minimal data collection, local storage
✅ **Content Rating**: Appropriate for lottery content
✅ **Permissions**: Only necessary permissions requested

### Security Features
- HTTPS for all network requests
- Local data encryption
- No sensitive data collection
- Secure API endpoints

## 🔄 Update Process

### Version Updates
1. Update version in `app.json`:
   ```json
   {
     "version": "1.0.1",
     "android": {
       "versionCode": 2
     }
   }
   ```

2. Build new version:
   ```bash
   eas build --platform android --profile production
   ```

3. Upload to Play Console with release notes

### Automated Updates
Set up GitHub Actions for automated builds:
```yaml
# .github/workflows/build.yml
name: Build and Deploy
on:
  push:
    tags:
      - 'v*'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: eas build --platform android --non-interactive
```

## 📈 Post-Launch

### Monitoring
- **Play Console**: Monitor crashes, ANRs, reviews
- **Analytics**: Track user engagement and retention
- **Feedback**: Respond to user reviews promptly

### Optimization
- **Performance**: Monitor app performance metrics
- **User Feedback**: Implement user-requested features
- **ASO**: Optimize keywords based on search performance

## 🆘 Troubleshooting

### Common Build Issues
1. **Dependency conflicts**: Clear node_modules and reinstall
2. **Keystore issues**: Let EAS manage keystores automatically
3. **Memory issues**: Increase Node.js memory limit

### Play Store Rejection
1. **Policy violations**: Review and fix policy issues
2. **Technical issues**: Fix crashes and performance problems
3. **Content issues**: Update descriptions and screenshots

## 📞 Support

- **Expo Documentation**: https://docs.expo.dev/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Play Console Help**: https://support.google.com/googleplay/android-developer/

---

**Ready to publish!** 🎉 Follow these steps to get your Vietlott Analyzer app live on Google Play Store.
