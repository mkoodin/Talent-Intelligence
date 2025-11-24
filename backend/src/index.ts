import express from 'express';
import cors from 'cors';
import path from 'path';
import { initializeDatabase } from './config/database';
import insightsRouter from './routes/insights';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api', insightsRouter);

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
