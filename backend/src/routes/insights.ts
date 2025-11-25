import express from 'express';
import { db } from '../config/database';
import { Insight, FilterOptions, InsightQuery, InsightCategory } from '../models/types';
import { realTimeInsightGenerator } from '../services/realTimeInsightGenerator';

const router = express.Router();

router.get('/insights', async (req, res) => {
  try {
    const { company, function: func, region, initiative, category, includeRealTime } = req.query as InsightQuery & { includeRealTime?: string };

    // Fetch database insights
    let query = 'SELECT * FROM insights WHERE 1=1';
    const params: any[] = [];

    if (company) {
      query += ' AND company = ?';
      params.push(company);
    }

    if (func) {
      query += ' AND function = ?';
      params.push(func);
    }

    if (region) {
      query += ' AND region = ?';
      params.push(region);
    }

    if (initiative) {
      query += ' AND initiative = ?';
      params.push(initiative);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    let insights: Insight[] = rows.map((row: any) => ({
      id: row.id,
      signal: row.signal,
      interpretation: row.interpretation,
      recommendation: row.recommendation,
      sources: JSON.parse(row.sources),
      confidence: row.confidence,
      company: row.company,
      function: row.function,
      region: row.region,
      initiative: row.initiative,
      category: row.category,
      createdAt: row.created_at
    }));

    // Include real-time insights from BLS/FRED APIs (default: true)
    if (includeRealTime !== 'false') {
      try {
        console.log('🔄 Fetching real-time insights from BLS/FRED APIs...');
        const realTimeInsights = await realTimeInsightGenerator.generateRealTimeInsights();

        // Convert real-time insights to standard format and prepend
        const formattedRealTimeInsights: Insight[] = realTimeInsights.map((insight, index) => ({
          id: `realtime-${Date.now()}-${index}`,
          signal: insight.signal,
          interpretation: insight.interpretation,
          recommendation: insight.recommendation,
          sources: insight.sources,
          confidence: insight.confidence,
          company: insight.company,
          function: insight.function,
          region: insight.region,
          initiative: insight.initiative,
          category: insight.category,
          createdAt: insight.dataTimestamp
        }));

        console.log(`✅ Generated ${formattedRealTimeInsights.length} real-time insights from live APIs`);

        // Prepend real-time insights (they show first as most recent)
        insights = [...formattedRealTimeInsights, ...insights];
      } catch (error) {
        console.error('⚠️  Error fetching real-time insights:', error);
        // Continue with database insights if real-time fetch fails
      }
    }

    res.json({
      success: true,
      data: insights,
      count: insights.length,
      realTimeEnabled: includeRealTime !== 'false'
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch insights' });
  }
});

router.get('/insights/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM insights WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) {
      return res.status(404).json({ success: false, error: 'Insight not found' });
    }

    const insight: Insight = {
      id: row.id,
      signal: row.signal,
      interpretation: row.interpretation,
      recommendation: row.recommendation,
      sources: JSON.parse(row.sources),
      confidence: row.confidence,
      company: row.company,
      function: row.function,
      region: row.region,
      initiative: row.initiative,
      category: row.category,
      createdAt: row.created_at
    };

    res.json({ success: true, data: insight });
  } catch (error) {
    console.error('Error fetching insight:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch insight' });
  }
});

router.get('/filters', (req, res) => {
  try {
    const companies = db.prepare('SELECT DISTINCT company FROM insights').all().map((r: any) => r.company);
    const functions = db.prepare('SELECT DISTINCT function FROM insights').all().map((r: any) => r.function);
    const regions = db.prepare('SELECT DISTINCT region FROM insights').all().map((r: any) => r.region);
    const initiatives = db.prepare('SELECT DISTINCT initiative FROM insights WHERE initiative IS NOT NULL').all().map((r: any) => r.initiative);
    const categories = Object.values(InsightCategory);

    const filters: FilterOptions = {
      companies,
      functions,
      regions,
      initiatives,
      categories
    };

    res.json({ success: true, data: filters });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch filters' });
  }
});

router.get('/stats', (req, res) => {
  try {
    const totalInsights = db.prepare('SELECT COUNT(*) as count FROM insights').get() as any;
    const insightsByCategory = db.prepare('SELECT category, COUNT(*) as count FROM insights GROUP BY category').all();
    const insightsByRegion = db.prepare('SELECT region, COUNT(*) as count FROM insights GROUP BY region').all();
    const avgConfidence = db.prepare('SELECT AVG(confidence) as avg FROM insights').get() as any;

    res.json({
      success: true,
      data: {
        total: totalInsights.count,
        byCategory: insightsByCategory,
        byRegion: insightsByRegion,
        averageConfidence: avgConfidence.avg
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

export default router;
