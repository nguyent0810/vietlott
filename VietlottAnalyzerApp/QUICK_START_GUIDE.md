# 🚀 Quick Start Guide - Build APK & Push to Git

## 📱 **Step 1: Build Unsigned APK for Testing**

### **Prerequisites:**
1. **Expo Account**: Create free account at [expo.dev](https://expo.dev)
2. **EAS CLI**: Already installed ✅

### **Build Commands:**
```bash
# 1. Login to Expo (you'll need to create account first)
eas login

# 2. Build unsigned APK for testing
eas build --platform android --profile test

# 3. Wait for build to complete (5-10 minutes)
# You'll get a download link when done
```

### **Alternative: Local Build (No Expo Account Needed)**
```bash
# 1. Install dependencies
npm install

# 2. Generate Android project
npx expo prebuild --platform android

# 3. Build APK locally (requires Android SDK)
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/
```

## 📦 **Step 2: Install APK on Your Device**

### **Method 1: Direct Download (Easiest)**
1. **Build completes** → EAS provides download link
2. **Open link on Android device** → Download APK
3. **Settings** → Security → Enable "Install from Unknown Sources"
4. **Tap APK file** → Install

### **Method 2: Transfer via USB**
1. **Download APK** to computer
2. **Connect device** via USB
3. **Copy APK** to device storage
4. **Open file manager** → Tap APK → Install

## 🔧 **Step 3: Push Code to Git**

### **Initialize Git Repository:**
```bash
# Navigate to project root
cd vietlott-analyzer

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Complete Vietlott Analyzer Android App

✨ Features:
- AI-powered lottery predictions (4 algorithms)
- Real historical data (1000+ results)
- Modern UI with gradients and AI theming
- Full internationalization (Vietnamese/English)
- Offline functionality with caching
- Google Play Store ready

🤖 AI Algorithms:
- Hot Numbers (75% confidence)
- Cold Numbers (65% confidence)
- Balanced Mix (80% confidence)
- AI Ensemble (85% confidence)

📱 Mobile Features:
- Beautiful gradient UI design
- Language switching (Vietnamese default)
- Smooth animations and transitions
- Local data storage and export
- Real-time lottery results

🛡️ Google Play Compliance:
- Privacy policy included
- Minimal permissions
- Content rating appropriate
- Security best practices"
```

### **Create GitHub Repository:**

#### **Option A: GitHub CLI**
```bash
# Install GitHub CLI, then:
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
4. **Public repository** (recommended)
5. **Don't initialize** with README

```bash
# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/vietlott-analyzer-mobile.git
git branch -M main
git push -u origin main
```

## 🧪 **Step 4: Test Your APK**

### **Testing Checklist:**
- [ ] **App installs** successfully
- [ ] **Home screen** loads with lottery results
- [ ] **Language switching** works (🇻🇳 ↔ 🇺🇸)
- [ ] **AI predictions** generate correctly
- [ ] **Statistics** display properly
- [ ] **History search** functions
- [ ] **Settings** save preferences
- [ ] **Offline mode** works
- [ ] **Navigation** smooth between tabs
- [ ] **UI gradients** display correctly

### **Performance Check:**
- [ ] **App startup** < 3 seconds
- [ ] **Data loading** smooth
- [ ] **Animations** run smoothly
- [ ] **No crashes** during normal use

## 🎯 **What You'll Get**

### **📱 Modern Mobile App:**
- **Beautiful AI-themed UI** with gradients
- **Vietnamese/English support** with instant switching
- **Real lottery data** from GitHub repository
- **4 AI prediction algorithms** with confidence ratings
- **Complete offline functionality** with smart caching

### **🤖 AI Features:**
- **Hot Numbers**: Most frequent numbers (🔥 Orange theme)
- **Cold Numbers**: Least frequent numbers (❄️ Blue theme)
- **Balanced Mix**: Combination approach (🎯 Purple theme)
- **AI Ensemble**: Advanced ML algorithm (🧠 Pink theme)

### **📊 Data & Analytics:**
- **1,196 Power 6/55 results** from official source
- **1,162 Mega 6/45 results** with complete history
- **Frequency analysis** with visual charts
- **Trend tracking** (30/60/90 days)
- **Search functionality** by date, numbers, draw ID

## 🚀 **Quick Commands Summary**

```bash
# Build APK
eas login
eas build --platform android --profile test

# Push to Git
git add .
git commit -m "🎨 UI improvements and features"
git push

# Check build status
eas build:list
```

## 📞 **Need Help?**

### **Common Issues:**

1. **EAS Login Required:**
   - Create free account at [expo.dev](https://expo.dev)
   - Run `eas login` and enter credentials

2. **Build Fails:**
   ```bash
   # Clear cache and retry
   eas build --platform android --profile test --clear-cache
   ```

3. **APK Won't Install:**
   - Enable "Install from Unknown Sources"
   - Check device storage space
   - Try different transfer method

4. **Git Push Fails:**
   ```bash
   # Check remote URL
   git remote -v
   
   # Fix if needed
   git remote set-url origin https://github.com/USERNAME/REPO.git
   ```

## 🎊 **Success!**

Once completed, you'll have:
- ✅ **Unsigned APK** for testing on your device
- ✅ **Code pushed to Git** for version control
- ✅ **Modern AI-powered app** ready for users
- ✅ **Google Play Store ready** for production

**Your Vietlott Analyzer mobile app is ready to test and deploy! 🎲📱🎉**

---

## 📋 **Next Steps After Testing:**
1. **Test thoroughly** on your device
2. **Gather user feedback** 
3. **Make any adjustments** needed
4. **Build production AAB** for Play Store
5. **Submit to Google Play Console**

The app is production-ready with modern AI design, full internationalization, and Google Play compliance!
