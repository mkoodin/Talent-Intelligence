import express from 'express';
import cors from 'cors';
import path from 'path';
import { initializeDatabase } from './config/database';
import insightsRouter from './routes/insights';
import dataSourceRouter from './routes/dataSourceRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Netflix Executive Talent Intelligence API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      insights: '/api/insights',
      filters: '/api/filters',
      stats: '/api/stats',
      dataSourcesStatus: '/api/data-sources/status',
      realTimeData: '/api/data-sources/*'
    },
    docs: 'Visit /api/health to check API status. Visit /api/data-sources/status to check real-time data configuration.',
    dataSources: 'This API can fetch REAL data from BLS, FRED, and OECD. See README for setup instructions.'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api', insightsRouter);
app.use('/api/data-sources', dataSourceRouter);

const dataDir = path.join(__dirname, '../data');
const fs = require('fs');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

initializeDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Netflix Insights Platform API running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized successfully`);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
