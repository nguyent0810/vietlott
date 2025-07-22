# 🔧 Configuration Guide - Automated Lottery System

This guide will help you configure the automated lottery suggestion system step by step.

## 📋 **Prerequisites**

### 1. Gmail Account Setup (for email delivery)
- Gmail account with 2-Factor Authentication enabled
- App Password generated for SMTP access

### 2. Gemini API Key (for AI predictions)
- Google AI Studio account
- Gemini API key generated

### 3. Deployed Application
- Application deployed on Vercel or similar platform
- Admin access to the application

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Open Your Application**
1. Navigate to your deployed application
2. Open browser Developer Tools (F12)
3. Go to the Console tab

### **Step 2: Load Setup Script**
Copy and paste this into the browser console:

```javascript
// Load the setup script
const script = document.createElement('script');
script.src = './setup-automation.js';
document.head.appendChild(script);
```

### **Step 3: Run Quick Setup**
Replace with your actual credentials:

```javascript
setupAutomation.quickSetup(
  "your-email@gmail.com",           // Your Gmail address
  "your-16-char-app-password",      // Gmail App Password
  "your-gemini-api-key"             // Gemini API Key
);
```

### **Step 4: Enable Automation**
1. Click the "Admin" button in your app
2. Click "Start Automation" in the admin dashboard
3. Verify system status shows "Running"

## 📧 **Detailed Email Configuration**

### **Gmail SMTP Setup**

#### **1. Enable 2-Factor Authentication**
- Go to [Google Account Security](https://myaccount.google.com/security)
- Enable 2-Step Verification if not already enabled

#### **2. Generate App Password**
- Go to Security → 2-Step Verification → App passwords
- Select "Mail" as the app
- Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

#### **3. Configure in Application**
```javascript
setupAutomation.configureEmail(
  "your-email@gmail.com",
  "abcd efgh ijkl mnop"  // Your 16-character app password
);
```

### **Alternative Email Providers**

#### **Outlook/Hotmail**
```javascript
// Manual configuration for Outlook
localStorage.setItem('smtpHost', 'smtp-mail.outlook.com');
localStorage.setItem('smtpPort', '587');
localStorage.setItem('smtpUser', 'your-email@outlook.com');
localStorage.setItem('smtpPassword', 'your-password');
```

#### **Custom SMTP**
```javascript
// Manual configuration for custom SMTP
localStorage.setItem('smtpHost', 'your-smtp-server.com');
localStorage.setItem('smtpPort', '587');
localStorage.setItem('smtpUser', 'your-username');
localStorage.setItem('smtpPassword', 'your-password');
```

## 🤖 **AI Configuration**

### **Gemini API Key Setup**

#### **1. Get API Key**
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create new API key
- Copy the key (starts with "AIza...")

#### **2. Configure in Application**
```javascript
// Store Gemini API key
sessionStorage.setItem('geminiApiKey', 'AIzaSyC...');
```

## ⚙️ **Automation Configuration**

### **Default Schedule**
- **Analysis Time**: 8:00 AM (Vietnam Time)
- **Prediction Time**: 10:00 AM (Vietnam Time)  
- **Email Time**: 12:00 PM (Vietnam Time)

### **Custom Schedule**
```javascript
// Customize automation timing
const config = {
  enabled: true,
  analysisTime: '09:00',    // 9 AM analysis
  predictionTime: '11:00',  // 11 AM predictions
  emailTime: '13:00',       // 1 PM email delivery
  timezone: 'Asia/Ho_Chi_Minh',
  retryAttempts: 3,
  retryDelay: 30
};

localStorage.setItem('automationConfig', JSON.stringify(config));
```

## 🌐 **Environment Variables (Production)**

### **Vercel Configuration**
Add these environment variables in Vercel dashboard:

```bash
# Email Configuration
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASSWORD=your-app-password
VITE_FROM_EMAIL=noreply@vietlott-ai.com
VITE_FROM_NAME=Vietlott AI Predictor

# AI Configuration  
VITE_GEMINI_API_KEY=your-gemini-api-key

# Application Configuration
VITE_APP_NAME=Vietlott AI Predictor
VITE_APP_URL=https://your-domain.vercel.app
```

### **Local Development**
Create `.env` file in project root:

```bash
# Copy from .env.example and fill in your values
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASSWORD=your-app-password
VITE_GEMINI_API_KEY=your-gemini-api-key
```

## 🧪 **Testing Configuration**

### **Test Email Setup**
```javascript
// Test email configuration
setupAutomation.testEmail();
```

### **Test Automation**
```javascript
// Check current configuration
setupAutomation.getConfig();

// Manually trigger workflow (for testing)
// This would be done through the admin dashboard
```

### **Verify Setup**
1. **Email Service**: Check admin dashboard for email statistics
2. **Automation**: Verify "Running" status in admin dashboard
3. **Subscribers**: Add test subscriber and check delivery
4. **Predictions**: Monitor prediction generation in logs

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Email Not Sending**
```javascript
// Check email configuration
console.log('SMTP User:', localStorage.getItem('smtpUser'));
console.log('Has Password:', !!localStorage.getItem('smtpPassword'));

// Reset and reconfigure
setupAutomation.reset();
setupAutomation.configureEmail("email", "password");
```

#### **Automation Not Running**
```javascript
// Check automation status
const config = JSON.parse(localStorage.getItem('automationConfig') || '{}');
console.log('Automation enabled:', config.automation?.enabled);

// Enable automation
setupAutomation.enableAutomation();
```

#### **API Key Issues**
```javascript
// Check Gemini API key
console.log('Has Gemini Key:', !!sessionStorage.getItem('geminiApiKey'));

// Set API key
sessionStorage.setItem('geminiApiKey', 'your-key');
```

### **Error Messages**

| Error | Solution |
|-------|----------|
| "Email service not initialized" | Configure SMTP credentials |
| "Gemini API key missing" | Set Gemini API key in session storage |
| "Automation not enabled" | Enable automation in admin dashboard |
| "SMTP authentication failed" | Check Gmail app password |
| "Rate limit exceeded" | Wait and retry, check API quotas |

## 📊 **Monitoring & Maintenance**

### **Daily Checks**
- Open admin dashboard
- Verify automation status is "Running"
- Check recent workflow logs for success
- Monitor email delivery statistics

### **Weekly Reviews**
- Review prediction accuracy trends
- Check subscriber growth
- Analyze email engagement
- Update system if needed

### **Monthly Tasks**
- Review and optimize prediction algorithms
- Update email templates if needed
- Check system performance metrics
- Plan feature improvements

## 🔒 **Security Best Practices**

### **Credential Management**
- Use app passwords, not regular passwords
- Store credentials securely
- Rotate passwords regularly
- Monitor for unauthorized access

### **Email Security**
- Use secure SMTP connections
- Include unsubscribe links
- Follow anti-spam guidelines
- Monitor delivery reputation

### **API Security**
- Protect API keys
- Monitor API usage
- Set usage limits
- Rotate keys periodically

## 🎯 **Success Checklist**

- [ ] Gmail app password generated and configured
- [ ] Gemini API key obtained and stored
- [ ] Email service initialized successfully
- [ ] Automation enabled and running
- [ ] Test subscriber added and email received
- [ ] Admin dashboard accessible and functional
- [ ] Prediction accuracy tracking working
- [ ] Workflow logs showing successful execution

## 📞 **Support**

If you encounter issues:

1. **Check browser console** for error messages
2. **Review configuration** using setup script commands
3. **Test individual components** (email, API, automation)
4. **Reset and reconfigure** if needed
5. **Check documentation** for specific error solutions

Your automated lottery suggestion system should now be fully configured and operational! 🎉
