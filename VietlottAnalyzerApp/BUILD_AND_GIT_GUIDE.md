# 🚀 Build APK & Push to Git Guide

## 📱 **Building Unsigned APK for Testing**

### **Option 1: EAS Build (Recommended)**

```bash
# 1. Install EAS CLI if not already installed
npm install -g eas-cli

# 2. Login to Expo account
eas login

# 3. Configure EAS (if first time)
eas build:configure

# 4. Build unsigned APK for testing
eas build --platform android --profile test

# 5. Download APK when build completes
# The build will provide a download link
```

### **Option 2: Local Build (Alternative)**

```bash
# 1. Install dependencies
npm install

# 2. Generate Android project
npx expo prebuild --platform android

# 3. Build APK locally (requires Android SDK)
cd android
./gradlew assembleRelease

# APK will be in: android/app/build/outputs/apk/release/
```

### **Option 3: Expo Development Build**

```bash
# 1. Build development client
eas build --platform android --profile development

# 2. Install Expo Dev Client on your device
# 3. Scan QR code to test
npx expo start --dev-client
```

## 📦 **APK Installation on Device**

### **Method 1: Direct Download**
1. **Build completes** → EAS provides download link
2. **Open link on Android device** → Download APK
3. **Enable "Install from Unknown Sources"** in Settings
4. **Tap APK file** → Install

### **Method 2: ADB Install**
```bash
# 1. Enable Developer Options on Android device
# 2. Enable USB Debugging
# 3. Connect device to computer
# 4. Install via ADB
adb install path/to/your-app.apk
```

### **Method 3: File Transfer**
1. **Download APK** to computer
2. **Transfer to device** via USB/cloud storage
3. **Open file manager** on device
4. **Tap APK** → Install

## 🔧 **Git Repository Setup & Push**

### **Step 1: Initialize Git Repository**

```bash
# Navigate to project root
cd vietlott-analyzer

# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial commit: Vietlott Analyzer Android App

✨ Features:
- Complete Android app with React Native/Expo
- AI-powered lottery predictions (4 algorithms)
- Real historical data integration (1000+ results)
- Modern UI with gradients and AI theming
- Full internationalization (Vietnamese/English)
- Google Play Store ready

🤖 AI Features:
- Hot Numbers algorithm
- Cold Numbers algorithm  
- Balanced Mix algorithm
- AI Ensemble algorithm
- Confidence ratings for predictions

📱 Mobile Features:
- Offline functionality with caching
- Beautiful Vietnamese/English UI
- Modern gradient design
- Smooth animations
- Local data storage

🛡️ Google Play Compliance:
- Privacy policy included
- Content rating appropriate
- Minimal permissions
- Security best practices"
```

### **Step 2: Create GitHub Repository**

#### **Option A: GitHub CLI (Recommended)**
```bash
# Install GitHub CLI if not installed
# Then create repository
gh repo create vietlott-analyzer-mobile --public --description "🎲 AI-powered Vietnamese lottery analysis mobile app"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/vietlott-analyzer-mobile.git
git branch -M main
git push -u origin main
```

#### **Option B: Manual GitHub Setup**
1. **Go to GitHub.com** → Create new repository
2. **Repository name**: `vietlott-analyzer-mobile`
3. **Description**: `🎲 AI-powered Vietnamese lottery analysis mobile app`
4. **Public/Private**: Choose as needed
5. **Don't initialize** with README (we have files already)

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/vietlott-analyzer-mobile.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **Step 3: Create Proper .gitignore**

```bash
# Create .gitignore for React Native/Expo
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

# Android
android/
ios/

# Temporary files
*.tmp
*.temp

# IDE
.vscode/
.idea/

# Build outputs
build/
dist/

# EAS
.easignore
EOF

# Add and commit .gitignore
git add .gitignore
git commit -m "📝 Add comprehensive .gitignore for React Native/Expo"
git push
```

## 📋 **Repository Structure**

Your final repository will look like:

```
vietlott-analyzer-mobile/
├── 📱 VietlottAnalyzerApp/          # Main mobile app
│   ├── app/                         # Expo Router pages
│   │   ├── (tabs)/                  # Tab navigation
│   │   │   ├── index.tsx           # Home screen
│   │   │   ├── predictions.tsx     # AI predictions
│   │   │   ├── statistics.tsx      # Statistics
│   │   │   ├── history.tsx         # History
│   │   │   └── settings.tsx        # Settings
│   │   └── _layout.tsx             # Root layout
│   ├── src/                        # Source code
│   │   ├── components/             # Reusable components
│   │   ├── services/               # Business logic
│   │   ├── theme/                  # Design system
│   │   └── types/                  # TypeScript types
│   ├── store/                      # App store assets
│   ├── app.json                    # Expo configuration
│   ├── eas.json                    # Build configuration
│   ├── package.json                # Dependencies
│   └── README.md                   # Documentation
├── 🌐 vietlott-analyzer/           # Original web app
└── 📝 README.md                    # Main project README
```

## 🎯 **Testing Checklist**

### **APK Testing on Device:**
- [ ] **App installs** without errors
- [ ] **Home screen loads** with latest lottery results
- [ ] **Language switching** works (Vietnamese ↔ English)
- [ ] **AI predictions** generate successfully
- [ ] **Statistics** display correctly
- [ ] **History search** functions properly
- [ ] **Settings** save and persist
- [ ] **Offline mode** works with cached data
- [ ] **Navigation** smooth between tabs
- [ ] **UI elements** display correctly (gradients, animations)

### **Performance Testing:**
- [ ] **App startup** < 3 seconds
- [ ] **Data loading** smooth with loading indicators
- [ ] **Animations** run at 60fps
- [ ] **Memory usage** reasonable
- [ ] **Battery impact** minimal

## 🚀 **Quick Commands Summary**

```bash
# Build unsigned APK for testing
eas build --platform android --profile test

# Push to Git
git add .
git commit -m "🎨 UI improvements and internationalization"
git push

# Check build status
eas build:list

# Download APK
# Use the download link provided after build completes
```

## 📞 **Support & Troubleshooting**

### **Common Issues:**

1. **EAS Build Fails:**
   ```bash
   # Clear cache and retry
   eas build --platform android --profile test --clear-cache
   ```

2. **Git Push Fails:**
   ```bash
   # Check remote URL
   git remote -v
   
   # Re-add remote if needed
   git remote set-url origin https://github.com/YOUR_USERNAME/repo-name.git
   ```

3. **APK Won't Install:**
   - Enable "Install from Unknown Sources"
   - Check Android version compatibility
   - Ensure sufficient storage space

### **Next Steps After Testing:**
1. **Test thoroughly** on your device
2. **Gather feedback** from users
3. **Make any needed adjustments**
4. **Build production AAB** for Play Store
5. **Submit to Google Play Console**

---

**Your Vietlott Analyzer mobile app is ready for testing and deployment! 🎲📱🎉**
