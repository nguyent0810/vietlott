# 🚀 **WORDPRESS DEPLOYMENT GUIDE**

## 📋 **OVERVIEW**

This guide will help you deploy the Vietlott Analyzer to your WordPress website as a custom plugin.

## ✅ **FIXES IMPLEMENTED**

### 🎯 **Duplicate Number Prevention**

- ✅ **Fixed**: All algorithms now ensure unique numbers (no duplicates)
- ✅ **Added**: `ensureUniqueNumbers()` utility function
- ✅ **Validated**: Vietlott rule compliance (6 unique numbers)

### 🎲 **Mega 6/45 Support**

- ✅ **Added**: Complete Mega 6/45 lottery support
- ✅ **Rules**: Pick 6 numbers from 1-45 (no power number)
- ✅ **API**: Dynamic data fetching based on lottery type
- ✅ **UI**: Lottery type selector with rules and odds

## 🛠️ **DEPLOYMENT METHODS**

### **Method 1: WordPress Plugin (Recommended)**

#### **Step 1: Build the React Application**

```bash
cd vietlott-analyzer
npm run build
```

#### **Step 2: Create Plugin Structure**

```
wordpress-plugin/
├── vietlott-analyzer.php          # Main plugin file
├── build/                         # React build files
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   └── index.html
├── includes/                      # PHP includes
└── assets/                        # Additional assets
```

#### **Step 3: Copy Files**

1. Copy the `build/` folder from your Next.js build to the plugin directory
2. Use the provided `vietlott-analyzer.php` as the main plugin file
3. Upload the entire `wordpress-plugin/` folder to `/wp-content/plugins/`

#### **Step 4: Activate Plugin**

1. Go to WordPress Admin → Plugins
2. Find "Vietlott Analyzer" and click "Activate"
3. Go to Settings → Vietlott Analyzer for configuration

#### **Step 5: Use Shortcode**

Add to any page or post:

```
[vietlott_analyzer]
[vietlott_analyzer type="mega645"]
[vietlott_analyzer type="power655" height="1000px"]
```

### **Method 2: Iframe Embed**

#### **Step 1: Deploy to Hosting**

1. Deploy the Next.js app to Vercel, Netlify, or your hosting
2. Get the live URL (e.g., `https://your-app.vercel.app`)

#### **Step 2: Embed in WordPress**

```html
<iframe
  src="https://your-app.vercel.app"
  width="100%"
  height="800px"
  frameborder="0"
>
</iframe>
```

### **Method 3: Custom WordPress Theme Integration**

#### **Step 1: Export Static Build**

```bash
npm run build
npm run export  # If using static export
```

#### **Step 2: Integrate with Theme**

1. Copy build files to your theme directory
2. Enqueue scripts in `functions.php`
3. Create custom page template

## 📁 **PLUGIN FILE STRUCTURE**

```
vietlott-analyzer-plugin/
├── vietlott-analyzer.php          # Main plugin file
├── build/                         # React build output
│   ├── static/
│   │   ├── css/
│   │   │   └── main.[hash].css
│   │   └── js/
│   │       └── main.[hash].js
│   └── index.html
├── includes/
│   ├── class-lottery-data.php     # Data fetching class
│   ├── class-admin.php            # Admin interface
│   └── class-shortcode.php        # Shortcode handler
├── assets/
│   ├── css/
│   │   └── admin.css
│   └── js/
│       └── admin.js
└── readme.txt                     # WordPress plugin readme
```

## 🔧 **CONFIGURATION OPTIONS**

### **Plugin Settings (WordPress Admin)**

- **Default Lottery Type**: Power 6/55 or Mega 6/45
- **Cache Duration**: Data caching time (default: 5 minutes)
- **API Source**: GitHub or custom endpoint
- **Display Options**: Height, theme, colors

### **Shortcode Parameters**

```
[vietlott_analyzer
    type="power655|mega645"
    height="800px"
    theme="light|dark"
    show_rules="true|false"]
```

## 🎯 **FEATURES AVAILABLE IN WORDPRESS**

### **✅ Core Features**

- 🎲 **Dual Lottery Support**: Power 6/55 & Mega 6/45
- 🧠 **8 Advanced Algorithms**: Neural, ML, Fibonacci, etc.
- 📊 **Real Data**: 1195+ historical results
- 🚫 **No Duplicates**: Vietlott rule compliant
- 📱 **Mobile Responsive**: Works on all devices

### **✅ WordPress Integration**

- 🔌 **Plugin Architecture**: Easy install/uninstall
- 📝 **Shortcode Support**: Use anywhere
- ⚙️ **Admin Settings**: Configure from WordPress admin
- 🔄 **AJAX Data Loading**: Fast, dynamic updates
- 💾 **WordPress Caching**: Optimized performance

### **✅ Advanced Features**

- 💾 **Prediction Tracking**: Save and compare predictions
- 📈 **Performance Analytics**: Algorithm comparison
- 🎯 **Smart Suggestions**: AI-powered recommendations
- 📊 **Visual Charts**: Interactive statistics

## 🚀 **DEPLOYMENT STEPS**

### **Method 1: WordPress Plugin Deployment (Recommended)**

#### **Step 1: Prepare the Application**

```bash
# Navigate to project directory
cd vietlott-analyzer

# Install dependencies (if not already done)
npm install

# Build the production version
npm run build
```

#### **Step 2: Create Plugin Structure**

```bash
# Create plugin directory in WordPress
mkdir /path/to/your/wordpress/wp-content/plugins/vietlott-analyzer

# Copy the main plugin file
cp wordpress-plugin/vietlott-analyzer.php /path/to/your/wordpress/wp-content/plugins/vietlott-analyzer/

# Copy the built React application
cp -r .next/static /path/to/your/wordpress/wp-content/plugins/vietlott-analyzer/build/static/
```

#### **Step 3: WordPress Admin Setup**

1. **Login to WordPress Admin** (`yoursite.com/wp-admin`)
2. **Go to Plugins** → Installed Plugins
3. **Find "Vietlott Analyzer"** and click **"Activate"**
4. **Go to Settings** → Vietlott Analyzer for configuration

#### **Step 4: Add to Pages/Posts**

```html
<!-- Basic usage -->
[vietlott_analyzer]

<!-- With specific lottery type -->
[vietlott_analyzer type="mega645"]

<!-- With custom height -->
[vietlott_analyzer type="power655" height="1000px"]
```

### **Method 2: Iframe Deployment (Simple)**

#### **Step 1: Deploy to Hosting Service**

```bash
# Deploy to Vercel (recommended)
npm install -g vercel
vercel --prod

# Or deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

#### **Step 2: Embed in WordPress**

```html
<!-- Add this HTML to any WordPress page/post -->
<iframe
  src="https://your-app-url.vercel.app"
  width="100%"
  height="800px"
  frameborder="0"
  style="border: none; border-radius: 8px;"
>
</iframe>
```

### **Method 3: Subdomain Deployment**

#### **Step 1: Create Subdomain**

1. **Create subdomain** in your hosting panel: `lottery.yoursite.com`
2. **Point subdomain** to a folder: `/public_html/lottery/`

#### **Step 2: Upload Files**

```bash
# Build and export static files
npm run build
npm run export

# Upload to subdomain folder
scp -r out/* user@yourserver:/public_html/lottery/
```

#### **Step 3: Link from WordPress**

```html
<!-- Add link in WordPress -->
<a href="https://lottery.yoursite.com" target="_blank" class="lottery-button">
  🎲 Open Vietlott Analyzer
</a>
```

### **Custom Domain Deployment**

1. **Deploy to your hosting:**

   - Upload build files to subdomain (e.g., `lottery.yoursite.com`)
   - Configure web server (Apache/Nginx)

2. **Embed in WordPress:**
   ```html
   <iframe
     src="https://lottery.yoursite.com"
     width="100%"
     height="800px"
   ></iframe>
   ```

## 🔒 **SECURITY CONSIDERATIONS**

### **WordPress Plugin Security**

- ✅ Nonce verification for AJAX requests
- ✅ Input sanitization and validation
- ✅ Capability checks for admin functions
- ✅ Secure data caching with transients

### **Data Security**

- ✅ No sensitive data stored
- ✅ Public lottery data only
- ✅ Client-side prediction storage
- ✅ No user data collection

## 📊 **PERFORMANCE OPTIMIZATION**

### **Caching Strategy**

- **WordPress Transients**: 5-minute cache for lottery data
- **Browser Caching**: Static assets cached
- **CDN Support**: Compatible with WordPress CDNs
- **Lazy Loading**: Components load on demand

### **Loading Optimization**

- **Code Splitting**: Reduced initial bundle size
- **Asset Optimization**: Minified CSS/JS
- **Image Optimization**: Optimized icons and graphics
- **Progressive Loading**: Graceful loading states

## 🎨 **CUSTOMIZATION OPTIONS**

### **Styling**

- **CSS Variables**: Easy color customization
- **WordPress Themes**: Inherits theme styles
- **Custom CSS**: Add via WordPress Customizer
- **Responsive Design**: Mobile-first approach

### **Functionality**

- **Algorithm Selection**: Enable/disable specific algorithms
- **Display Options**: Show/hide components
- **Language Support**: Ready for translation
- **Custom Branding**: Add your logo/colors

## 📞 **SUPPORT & MAINTENANCE**

### **Updates**

- **Plugin Updates**: Via WordPress admin
- **Data Updates**: Automatic from GitHub
- **Algorithm Improvements**: Regular enhancements
- **Bug Fixes**: Continuous improvements

### **Troubleshooting**

- **Debug Mode**: Enable WordPress debug logging
- **Error Handling**: Graceful fallbacks
- **Cache Clearing**: Manual cache refresh options
- **Compatibility**: Tested with major themes/plugins

---

**🎉 Your Vietlott Analyzer is now ready for WordPress deployment!**

The enhanced system now includes:

- ✅ **No duplicate numbers** (Vietlott compliant)
- ✅ **Mega 6/45 support** with complete rules
- ✅ **WordPress plugin** ready for deployment
- ✅ **Multiple deployment options** for flexibility
- ✅ **Professional integration** with your website
