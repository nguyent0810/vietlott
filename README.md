# 🎲 Vietlott Power 6/55 Analyzer

A comprehensive Next.js web application for analyzing Vietnam's Vietlott Power 6/55 lottery historical data and generating intelligent number suggestions.

## ✨ Features

### 1. **Latest Results Display**

- Shows the most recent 5 lottery draws
- Beautiful number ball visualization
- Draw ID and date information
- Power number highlighting

### 2. **Smart Number Suggestions**

- Multiple suggestion algorithms:
  - **Hot Numbers**: Based on most frequently drawn numbers
  - **Cold Numbers**: Based on least frequently drawn numbers
  - **Balanced Mix**: Combination of hot and cold numbers
  - **Recent Trends**: Based on last 30 days trends
  - **Random Selection**: Completely random numbers
  - **Mathematical Pattern**: Based on statistical distribution
- Confidence scoring for each suggestion
- One-click number regeneration
- Copy-to-clipboard functionality

### 3. **Advanced Statistics & Analysis**

- Interactive charts using Chart.js
- Number frequency distribution
- Trend comparison (All time vs Recent periods)
- Hot/Cold number identification
- Statistical summaries

### 4. **Historical Data Browser**

- Searchable and sortable historical results
- Pagination for large datasets
- Filter by draw ID, date, or specific numbers
- Responsive table design

### 5. **Modern UI/UX**

- Responsive design for mobile and desktop
- Clean, intuitive interface
- Loading states and error handling
- Tailwind CSS styling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd vietlott-analyzer
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/lottery-data/     # API route for data fetching
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── LatestResults.tsx    # Latest lottery results component
│   ├── StatisticsChart.tsx  # Charts and statistics component
│   ├── NumberSuggestion.tsx # Number suggestion component
│   └── HistoricalData.tsx   # Historical data table component
├── types/
│   └── lottery.ts           # TypeScript type definitions
└── utils/
    └── dataAnalysis.ts      # Data analysis and suggestion algorithms
```

## 📊 Data Sources

The application is designed to work with multiple data sources:

1. **GitHub Repository**: Fetches from `vietvudanh/vietlott-data` repository
2. **Web Scraping**: Fallback scraping from official Vietlott website
3. **Mock Data**: Development data for testing (currently active)

## 🔧 Configuration

### Data Source Configuration

Edit `src/app/api/lottery-data/route.ts` to configure data sources:

```typescript
// Enable real data fetching
// Uncomment the try-catch block in the GET function
// Configure GitHub URL or scraping endpoints
```

### Algorithm Customization

Modify `src/utils/dataAnalysis.ts` to:

- Add new suggestion algorithms
- Adjust confidence calculation
- Customize statistical analysis

## 🎯 Suggestion Algorithms

### Hot Numbers Algorithm

Selects the 6 most frequently drawn numbers from historical data.

### Cold Numbers Algorithm

Selects the 6 least frequently drawn numbers.

### Balanced Mix Algorithm

Combines 3 hot numbers and 3 cold numbers for a balanced approach.

### Recent Trends Algorithm

Analyzes the last 30 days of draws to identify trending numbers.

### Mathematical Pattern Algorithm

Uses statistical distribution to select numbers close to average frequency.

### Random Selection Algorithm

Generates completely random numbers for comparison.

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🛠️ Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios
- **Icons**: Emoji-based icons for simplicity

## ✅ **ENHANCED VERSION - Latest Updates**

### 🎯 **Real Data Integration**

- ✅ **Real historical data** fetched from GitHub repository (vietvudanh/vietlott-data)
- ✅ **1195+ lottery results** from actual Vietlott Power 6/55 draws
- ✅ **Automatic data validation** and error handling
- ✅ **Caching system** for improved performance

### 🎨 **Modern UI/UX Enhancements**

- ✅ **Framer Motion animations** for smooth interactions
- ✅ **Gradient backgrounds** and glassmorphism effects
- ✅ **Lucide React icons** for professional appearance
- ✅ **Enhanced number balls** with variants and animations
- ✅ **Modern card components** with hover effects
- ✅ **Responsive design** optimized for all devices

### ⚡ **Performance Optimizations**

- ✅ **React.memo** for component memoization
- ✅ **useMemo hooks** for expensive calculations
- ✅ **Singleton pattern** for data service
- ✅ **Lazy loading** and code splitting
- ✅ **Optimized re-renders** and state management

### 🏗️ **Architecture Improvements**

- ✅ **OOP design patterns** with service classes
- ✅ **Separation of concerns** (UI, logic, data)
- ✅ **Type-safe interfaces** throughout the application
- ✅ **Modular component structure**
- ✅ **Clean code principles** and best practices

## 🔮 Future Enhancements

- [ ] User accounts and favorite number tracking
- [ ] Advanced pattern recognition algorithms
- [ ] Export functionality for analysis results
- [ ] Mobile app version
- [ ] Multi-language support (Vietnamese/English)
- [ ] Push notifications for new draws
- [ ] Social sharing features
- [ ] Progressive Web App (PWA) features

## ⚠️ Disclaimer

This application is for educational and entertainment purposes only. Lottery numbers are random, and past results do not guarantee future outcomes. Please gamble responsibly.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.
