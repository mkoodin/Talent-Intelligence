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
- **Data Sources**: OECD, LinkedIn, Levels.fyi, Crunchbase, etc.
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

- `GET /api/health` - Health check
- `GET /api/insights` - Fetch insights (supports query params for filtering)
- `GET /api/insights/:id` - Fetch single insight by ID
- `GET /api/filters` - Get available filter options
- `GET /api/stats` - Get platform statistics

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
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic (rules engine)
│   │   └── index.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
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

- Real-time data integration with LinkedIn, OECD, Levels.fyi APIs
- Advanced analytics dashboard with charts and trend visualization
- Email alerts for high-confidence insights
- Machine learning-based insight scoring
- Export functionality (PDF, Excel)
- User authentication and role-based access
- Saved filters and custom views
- Historical insight tracking

## License

MIT

## Support

For questions or issues, please contact the Talent Intelligence team.
