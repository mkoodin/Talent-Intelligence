# Netflix Executive Talent Intelligence Platform - Backend

Backend API for the Netflix Executive Talent Intelligence Platform. Provides insights on executive talent trends, wage pressures, macroeconomic signals, and talent supply shifts.

## Features

- RESTful API for insights, filters, and statistics
- SQLite database with automatic seeding
- Rules-based insight generation engine
- **Real-time data integration** with BLS, FRED, and OECD APIs
- CORS-enabled for frontend connectivity

## Quick Start

```bash
# Install dependencies
npm install

# Seed the database
npm run seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:3001`

## Real Data Sources Integration

This platform can fetch **REAL employment and economic data** from official government and international sources:

### Available Data Sources

1. **BLS (Bureau of Labor Statistics)** - U.S. government employment data
   - Current Population Survey (CPS) employment statistics
   - Professional and technical services employment data
   - Unemployment rates by education level
   - [Get free API key](https://data.bls.gov/registrationEngine/)
   - [API Documentation](https://www.bls.gov/developers/home.htm)

2. **FRED (Federal Reserve Economic Data)** - Federal Reserve economic indicators
   - Employment Cost Index (ECIWAG)
   - Wage and salary trends
   - Management occupation compensation data
   - [Get free API key](https://fredaccount.stlouisfed.org/apikeys)
   - [API Documentation](https://fred.stlouisfed.org/docs/api/fred/)

3. **OECD (Organisation for Economic Co-operation and Development)** - International data
   - Global employment outlook data
   - Average wages across OECD countries
   - Labor market indicators
   - No API key required for public data
   - [Data Portal](https://data.oecd.org/)
   - [API Documentation](https://www.oecd.org/en/data/insights/data-explainers/2024/09/api.html)

### Setting Up Real Data Fetching

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Get your free API keys:**
   - **BLS**: Visit https://data.bls.gov/registrationEngine/ and register
   - **FRED**: Visit https://fredaccount.stlouisfed.org/apikeys and create an account

3. **Add your API keys to `.env`:**
   ```env
   BLS_API_KEY=your_actual_bls_api_key_here
   FRED_API_KEY=your_actual_fred_api_key_here
   ```

4. **The application will automatically use real data when API keys are configured**

### Data Services Architecture

Real data is fetched through dedicated service modules:

```
backend/src/services/
├── blsService.ts       # BLS API integration
├── fredService.ts      # FRED API integration
└── oecdService.ts      # OECD API integration
```

Each service provides:
- Typed data models
- Error handling and logging
- Direct source URLs for data attribution
- Automatic fallback if API keys are not configured

## API Endpoints

### Health Check
```
GET /api/health
```

### Get Insights
```
GET /api/insights?category=WAGE_PRESSURE&region=NA&function=AI
```

### Get Available Filters
```
GET /api/filters
```

### Get Statistics
```
GET /api/stats
```

## Environment Variables

See `.env.example` for complete configuration options.

Required:
- `PORT` - Server port (default: 3001)

Optional (for real data fetching):
- `BLS_API_KEY` - Bureau of Labor Statistics API key
- `FRED_API_KEY` - Federal Reserve Economic Data API key

## Database

The application uses SQLite for data persistence:
- Location: `backend/data/insights.db`
- Automatically created on first run
- Seeded with sample insights

### Sample vs. Real Data

- **Without API keys**: The application seeds with sample demonstration data
- **With API keys**: The application can fetch and display real economic data from government sources

All data points include source attribution and direct links to official data sources.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Build Tool**: tsx for TypeScript execution

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Type check
npx tsc --noEmit

# Reseed database
npm run seed
```

## Deployment

The backend is designed for deployment to Render, Railway, or similar Node.js hosting platforms.

**Build Command**: `npm install`
**Start Command**: `npm run seed && npm run dev`

### Environment Variables on Render

Add these environment variables in your Render dashboard:
- `BLS_API_KEY` - Your BLS API key
- `FRED_API_KEY` - Your FRED API key

## Data Attribution

All insights and data points include proper attribution to their sources:
- U.S. Bureau of Labor Statistics (BLS)
- Federal Reserve Economic Data (FRED)
- OECD Employment Statistics
- LinkedIn Talent Insights
- Layoffs.fyi
- Industry publications

Direct links to source data are provided in all API responses.

## License

Internal Netflix tool - not for external distribution
