# Netflix Executive Talent Intelligence Platform

A research and insights platform designed to support Netflix's Executive Engagement and Talent Intelligence teams by surfacing high-signal macroeconomic, labor market, and executive talent insights.

## Overview

This platform helps drive executive hiring, organizational design, compensation strategy, and global expansion planning by providing actionable intelligence across four key domains:

1. **Executive Talent Trends** - Track org changes and executive hiring patterns at competitors
2. **Wage Pressures & Inflation** - Monitor compensation inflation and real wage shifts
3. **Macroeconomic Signals** - Identify global instability and FX volatility impacts
4. **Talent Supply Shifts** - Track layoffs, job postings, and emerging talent markets

## Features

### Insight Cards
Each insight includes:
- **Signal Detected**: Key data point or trend identified
- **Interpretation**: What it means for talent strategy
- **Strategic Recommendation**: Actionable next steps
- **Data Sources**: Links to REAL data from BLS, FRED, OECD, LinkedIn, and more
- **Confidence Score**: Data quality and reliability indicator (65-95%)

### Filtering System
Filter insights by:
- Company (default: Netflix)
- Function (AI, Ads, Product, Content Ops)
- Region (NA, EMEA, LATAM, APAC)
- Strategic Initiative (Ad-tier Expansion, AI Expansion, Global Expansion)
- Category (Executive Talent, Wage Pressures, Macro Signals, Talent Supply)

### Rules Engine
Automated insight generation based on:
- Inflation rates, wage growth, and executive mobility
- AI/Ads talent market dynamics
- FX volatility and currency impacts
- Layoff waves and hiring freezes
- Organizational restructuring signals

## 🔗 Real Data Sources Integration

This platform integrates with **REAL government and official data sources** - NO fabricated statistics:

### Available Data Sources

1. **U.S. Bureau of Labor Statistics (BLS)**
   - Current Population Survey (CPS) employment data
   - Professional & technical services employment statistics
   - Unemployment rates by education level
   - [Data Portal](https://www.bls.gov/cps/data.htm)
   - [Get Free API Key](https://data.bls.gov/registrationEngine/)

2. **Federal Reserve Economic Data (FRED)**
   - Employment Cost Index (ECIWAG)
   - Wage and salary trends
   - Management occupation compensation
   - [Data Portal](https://fred.stlouisfed.org/)
   - [Get Free API Key](https://fredaccount.stlouisfed.org/apikeys)

3. **OECD (Organisation for Economic Co-operation and Development)**
   - OECD Employment Outlook 2024
   - International wage and employment data
   - Global labor market indicators
   - [Data Portal](https://data.oecd.org/)
   - No API key required for public data

### Setting Up Real Data

1. Copy the environment template:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Get your free API keys:
   - **BLS**: https://data.bls.gov/registrationEngine/
   - **FRED**: https://fredaccount.stlouisfed.org/apikeys

3. Add keys to your `.env` file:
   ```env
   BLS_API_KEY=your_bls_api_key
   FRED_API_KEY=your_fred_api_key
   ```

4. Restart the backend server

### Real-Time Data Endpoints

Check data source status:
```bash
curl http://localhost:3001/api/data-sources/status
```

Fetch live BLS employment data:
```bash
curl http://localhost:3001/api/data-sources/bls/professional-services-employment
```

Fetch live FRED Employment Cost Index:
```bash
curl http://localhost:3001/api/data-sources/fred/employment-cost-index
```

See `backend/README.md` for complete API documentation.

## Architecture

### Backend
- **Framework**: Node.js with Express and TypeScript
- **Database**: SQLite (for MVP simplicity)
- **API**: RESTful endpoints for insights, filters, and statistics
- **Rules Engine**: Configurable condition-based insight generation

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Netflix-inspired design
- **State Management**: React hooks

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Talent-Intelligence
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Database Setup

Initialize and seed the database with sample data:

```bash
cd backend
npm run seed
```

This creates:
- 10 sample insights across all categories
- 20+ data points for the rules engine
- Filter options for all dimensions

### Running the Application

#### Start the Backend (Terminal 1)
```bash
cd backend
npm run dev
```
The API server will start on `http://localhost:3001`

#### Start the Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
The web application will start on `http://localhost:3000`

### API Endpoints

**Core Endpoints:**
- `GET /api/health` - Health check
- `GET /api/insights` - Fetch insights (supports query params for filtering)
- `GET /api/insights/:id` - Fetch single insight by ID
- `GET /api/filters` - Get available filter options
- `GET /api/stats` - Get platform statistics

**Real Data Source Endpoints:**
- `GET /api/data-sources/status` - Check which data sources are configured
- `GET /api/data-sources/bls/professional-services-employment` - Live BLS data
- `GET /api/data-sources/bls/advanced-degree-unemployment` - BLS unemployment data
- `GET /api/data-sources/fred/employment-cost-index` - Live FRED ECI data
- `GET /api/data-sources/fred/employment-cost-yoy` - Year-over-year wage changes
- `GET /api/data-sources/oecd/employment-outlook` - OECD report links
- `GET /api/data-sources/oecd/resources` - OECD data resources

### Example API Usage

```bash
# Get all insights
curl http://localhost:3001/api/insights

# Filter by region
curl http://localhost:3001/api/insights?region=EMEA

# Filter by function and region
curl http://localhost:3001/api/insights?function=AI&region=APAC

# Get filter options
curl http://localhost:3001/api/filters

# Get statistics
curl http://localhost:3001/api/stats
```

## Use Cases

### 1. Search Strategy
Identify optimal sourcing windows for executive roles based on competitor hiring freezes and layoff waves.

### 2. Compensation Benchmarking
Adjust compensation bands based on real-time inflation, FX trends, and function-specific wage growth.

### 3. Organizational Design
Anticipate competitor organizational shifts and identify potential talent displacement opportunities.

### 4. Location Strategy
Recommend emerging executive hiring hubs based on hiring growth trends and talent availability.

## Sample Insights

The platform comes pre-loaded with realistic sample insights:

- **AI Compensation Surge**: AI executive compensation growing 28% YoY in APAC
- **EMEA Hiring Opportunity**: Executive job postings declined 25% at competitors
- **LATAM FX Risk**: 18% currency volatility impacting real compensation values
- **NA Talent Wave**: 12,000+ tech executives displaced, creating recruitment opportunities
- **Emerging Markets**: LATAM executive hiring growing 42% YoY

## Development

### Adding New Insights Rules

Edit `backend/src/services/insightGenerator.ts` to add new rules:

```typescript
{
  id: 'rule_new',
  name: 'Rule Name',
  conditions: [
    { metric: 'metric_name', operator: '>', value: 50, region: 'NA' }
  ],
  output: {
    signal: 'What was detected',
    interpretation: 'What it means',
    recommendation: 'What to do',
    category: InsightCategory.EXECUTIVE_TALENT
  }
}
```

### Project Structure

```
Talent-Intelligence/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── database/       # Seed scripts
│   │   ├── models/         # TypeScript types
│   │   ├── routes/         # API endpoints (insights, data sources)
│   │   ├── services/       # Business logic & external APIs
│   │   │   ├── blsService.ts       # BLS API integration
│   │   │   ├── fredService.ts      # FRED API integration
│   │   │   ├── oecdService.ts      # OECD API integration
│   │   │   └── insightGenerator.ts # Rules engine
│   │   └── index.ts        # Express server
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md           # Backend-specific docs
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main application
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## Technology Stack

### Backend
- Node.js + Express
- TypeScript
- better-sqlite3
- CORS middleware

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Netflix-inspired design system

## Future Enhancements

- ✅ Real-time data integration with BLS, FRED, and OECD APIs (COMPLETED)
- Advanced analytics dashboard with charts and trend visualization
- Additional API integrations (LinkedIn Talent Insights, Levels.fyi)
- Email alerts for high-confidence insights
- Machine learning-based insight scoring
- Export functionality (PDF, Excel)
- User authentication and role-based access
- Saved filters and custom views
- Historical insight tracking
- Automated daily data refresh from government sources

## License

MIT

## Support

For questions or issues, please contact the Talent Intelligence team.
