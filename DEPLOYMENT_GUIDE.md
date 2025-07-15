# Deployment Guide for Vietlott AI Predictor

This guide explains how to deploy your Vietlott AI Predictor application to Vercel.

## 🚀 Quick Deployment

### Option 1: Automatic Deployment (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `https://github.com/nguyent0810/vietlott`
4. Vercel will automatically detect it as a Vite project
5. Click "Deploy"

### Option 2: Manual Configuration
If automatic detection doesn't work:

1. **Framework Preset**: Select "Vite"
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

## 🔧 Configuration Files

### vercel.json
The project includes a `vercel.json` file with the following configuration:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### vite.config.ts
Updated Vite configuration for production builds:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
```

## 🔑 Environment Variables

If you want to use Gemini AI features in production, add environment variables in Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add: `GEMINI_API_KEY` with your API key value

## 🌐 Domain Configuration

### Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

### Default Domain
Your app will be available at: `https://your-project-name.vercel.app`

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails with "No Next.js version detected"**
   - ✅ Fixed: Added `vercel.json` with correct framework setting
   - ✅ Fixed: Updated `vite.config.ts` with React plugin

2. **404 Errors on Page Refresh**
   - ✅ Fixed: Added rewrites in `vercel.json` for SPA routing

3. **Build Timeout**
   - Increase build timeout in Vercel settings
   - Optimize bundle size by code splitting

4. **Environment Variables Not Working**
   - Ensure variables are prefixed with `VITE_` for client-side access
   - Or use the build-time environment variable injection in `vite.config.ts`

### Build Logs
Check Vercel build logs for detailed error information:
1. Go to your project dashboard
2. Click on the failed deployment
3. View "Build Logs" tab

## 📊 Performance Optimization

### Bundle Analysis
The build creates optimized chunks:
- `vendor.js` - React and React DOM
- `charts.js` - Recharts library
- `index.js` - Main application code

### Caching
Vercel automatically handles:
- Static asset caching
- CDN distribution
- Gzip compression

## 🔄 Continuous Deployment

### Automatic Deployments
- **Production**: Pushes to `main` branch trigger production deployments
- **Preview**: Pull requests create preview deployments

### Manual Deployments
Use Vercel CLI for manual deployments:
```bash
npm install -g vercel
vercel --prod
```

## 🛡️ Security

### CORS Configuration
The app includes CORS headers for API requests in `vercel.json`.

### Environment Security
- Never commit API keys to the repository
- Use Vercel's environment variables for sensitive data
- Enable "Sensitive" flag for secret environment variables

## 📱 Features Available in Production

✅ **Real Lottery Data Integration**
- Fetches live data from GitHub repository
- Automatic fallback to cached data
- 30-minute caching for performance

✅ **AI Predictions**
- Gemini AI integration (requires API key)
- Historical analysis
- Pattern recognition

✅ **Interactive Dashboard**
- Real-time charts and visualizations
- Data management tools
- Simulation capabilities

✅ **Responsive Design**
- Mobile-friendly interface
- Touch-optimized controls
- Progressive Web App features

## 🎯 Post-Deployment Checklist

- [ ] Verify application loads correctly
- [ ] Test real data fetching functionality
- [ ] Confirm AI prediction features work (if API key provided)
- [ ] Check mobile responsiveness
- [ ] Test data refresh functionality
- [ ] Verify all charts and visualizations render properly

## 📞 Support

If you encounter deployment issues:
1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Ensure all dependencies are properly installed
4. Verify `vercel.json` configuration matches your project structure
