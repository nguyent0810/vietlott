# Real Lottery Data Integration

This document explains how the application has been upgraded to use real Vietnamese lottery data instead of fake/sample data.

## 🎯 Overview

The application now fetches real, up-to-date lottery data from the [vietlott-data](https://github.com/vietvudanh/vietlott-data) GitHub repository, which provides:

- **Real historical data** from 2017 to present
- **Daily automatic updates** via GitHub Actions
- **Complete coverage** of Power 6/55 and Mega 6/45 games
- **JSON format** for easy integration
- **Free and reliable** data source

## 🔧 Implementation

### New Services

1. **`vietlottApiService.ts`** - Handles fetching real data from GitHub repository
2. **`lotteryDataService.ts`** - Enhanced service with caching and fallback logic
3. **Updated `App.tsx`** - Integrated real data loading with UI indicators

### Key Features

- ✅ **Real Data Priority**: Always attempts to fetch real data first
- ✅ **Graceful Fallback**: Falls back to sample data if real data is unavailable
- ✅ **Caching**: 30-minute cache to reduce API calls
- ✅ **Loading States**: Visual indicators for data loading
- ✅ **Data Source Indicator**: Shows whether using real or sample data
- ✅ **Manual Refresh**: Button to refresh data on demand
- ✅ **Error Handling**: Robust error handling with console logging

## 📊 Data Sources

### Power 6/55
- **URL**: `https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data/power655.jsonl`
- **Format**: JSONL (JSON Lines)
- **Update Frequency**: Daily

### Mega 6/45
- **URL**: `https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data/power645.jsonl`
- **Format**: JSONL (JSON Lines)
- **Update Frequency**: Daily

### Data Format Example
```json
{
  "date": "2024-01-15",
  "id": "240115",
  "result": [5, 12, 23, 34, 45, 55, 7],
  "page": 1,
  "process_time": "2024-01-15T18:30:00Z"
}
```

## 🚀 Usage

### Automatic Loading
The application automatically attempts to load real data when:
- The app starts
- User switches between lottery types
- User clicks the "Refresh" button

### Manual Testing
Run the test script to verify integration:
```bash
deno run --allow-net test-real-data.ts
```

### UI Indicators
- 🟢 **Green dot**: Using real data
- 🟡 **Yellow dot**: Using sample/fallback data
- ⏳ **Loading**: Data is being fetched

## 🔄 Fallback Strategy

1. **Primary**: Fetch real data from GitHub repository
2. **Secondary**: Use cached data from localStorage
3. **Tertiary**: Use built-in sample data

## 🛠️ Configuration

### Cache Settings
- **Duration**: 30 minutes
- **Storage**: In-memory cache
- **Fallback**: localStorage for persistence

### API Endpoints
All endpoints are configured in `vietlottApiService.ts`:
```typescript
const DATA_URLS = {
  [LOTTERY_TYPES.POWER]: 'https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data/power655.jsonl',
  [LOTTERY_TYPES.MEGA]: 'https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data/power645.jsonl'
};
```

## 🔍 Monitoring

### Console Logs
The application provides detailed console logging:
- ✅ Successful data fetches
- ⚠️ Fallback scenarios
- ❌ Error conditions
- 📊 Cache statistics

### Data Source Information
Access data source details via:
```typescript
import { getDataSourceInfo } from './services/vietlottApiService.ts';
const info = getDataSourceInfo();
```

## 🎯 Benefits

1. **Accuracy**: Real lottery results instead of fake data
2. **Freshness**: Daily updates ensure current data
3. **Reliability**: Multiple fallback layers prevent app failure
4. **Performance**: Caching reduces network requests
5. **Transparency**: Clear indicators of data source

## 🔧 Troubleshooting

### Common Issues

1. **Network Errors**: Check internet connection
2. **CORS Issues**: Data is served from GitHub with proper CORS headers
3. **Rate Limiting**: 30-minute cache prevents excessive requests
4. **Data Format**: Service handles JSONL parsing automatically

### Debug Mode
Enable detailed logging by opening browser console and monitoring:
- Data fetch attempts
- Cache hits/misses
- Fallback scenarios
- Error messages

## 🚀 Future Enhancements

Potential improvements:
1. **Real-time Updates**: WebSocket connection for live results
2. **Multiple Sources**: Additional data providers for redundancy
3. **Historical Analysis**: Extended historical data analysis
4. **Offline Mode**: Service worker for offline functionality
