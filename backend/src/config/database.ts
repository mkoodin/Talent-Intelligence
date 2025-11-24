import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/insights.db');
export const db = new Database(dbPath);

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS insights (
      id TEXT PRIMARY KEY,
      signal TEXT NOT NULL,
      interpretation TEXT NOT NULL,
      recommendation TEXT NOT NULL,
      sources TEXT NOT NULL,
      confidence REAL NOT NULL,
      company TEXT NOT NULL,
      function TEXT NOT NULL,
      region TEXT NOT NULL,
      initiative TEXT,
      category TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS data_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric TEXT NOT NULL,
      value REAL NOT NULL,
      region TEXT NOT NULL,
      function TEXT,
      timestamp TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_insights_company ON insights(company);
    CREATE INDEX IF NOT EXISTS idx_insights_function ON insights(function);
    CREATE INDEX IF NOT EXISTS idx_insights_region ON insights(region);
    CREATE INDEX IF NOT EXISTS idx_insights_category ON insights(category);
    CREATE INDEX IF NOT EXISTS idx_data_points_metric ON data_points(metric);
  `);
}

export function closeDatabase() {
  db.close();
}
