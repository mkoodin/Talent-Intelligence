import { db, initializeDatabase } from '../config/database';
import { InsightCategory } from '../models/types';
import { randomBytes } from 'crypto';

function generateId(): string {
  return randomBytes(16).toString('hex');
}

function seedDataPoints() {
  console.log('🌱 Seeding data points...');

  const dataPoints = [
    { metric: 'inflation_rate', value: 7.2, region: 'EMEA', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'wage_growth', value: 2.5, region: 'EMEA', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'executive_mobility', value: 75, region: 'EMEA', timestamp: '2024-11-01T00:00:00Z' },

    { metric: 'ai_wage_growth', value: 28, region: 'APAC', function: 'AI', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'ai_wage_growth', value: 22, region: 'NA', function: 'AI', timestamp: '2024-11-01T00:00:00Z' },

    { metric: 'exec_job_postings', value: -25, region: 'EMEA', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'exec_job_postings', value: -15, region: 'NA', timestamp: '2024-11-01T00:00:00Z' },

    { metric: 'fx_volatility', value: 18, region: 'LATAM', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'fx_volatility', value: 12, region: 'EMEA', timestamp: '2024-11-01T00:00:00Z' },

    { metric: 'tech_layoffs', value: 12000, region: 'NA', timestamp: '2024-10-01T00:00:00Z' },
    { metric: 'tech_layoffs', value: 3500, region: 'EMEA', timestamp: '2024-10-01T00:00:00Z' },

    { metric: 'exec_hiring_growth', value: 35, region: 'APAC', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'exec_hiring_growth', value: 42, region: 'LATAM', timestamp: '2024-11-01T00:00:00Z' },

    { metric: 'org_changes', value: 15, region: 'NA', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'org_changes', value: 8, region: 'EMEA', timestamp: '2024-11-01T00:00:00Z' },

    { metric: 'ads_exec_postings', value: -30, region: 'EMEA', function: 'Ads', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'ads_exec_postings', value: -22, region: 'APAC', function: 'Ads', timestamp: '2024-11-01T00:00:00Z' },

    { metric: 'inflation_rate', value: 5.8, region: 'NA', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'inflation_rate', value: 6.5, region: 'LATAM', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'wage_growth', value: 3.2, region: 'NA', timestamp: '2024-11-01T00:00:00Z' },
    { metric: 'wage_growth', value: 2.8, region: 'LATAM', timestamp: '2024-11-01T00:00:00Z' },
  ];

  const stmt = db.prepare(`
    INSERT INTO data_points (metric, value, region, function, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const dp of dataPoints) {
    stmt.run(dp.metric, dp.value, dp.region, dp.function || null, dp.timestamp);
  }

  console.log(`✅ Seeded ${dataPoints.length} data points`);
}

function seedInsights() {
  console.log('🌱 Seeding insights...');

  const insights = [
    {
      id: generateId(),
      signal: 'AI executive compensation growing 28% YoY in APAC region',
      interpretation: 'Sourcing costs rising significantly in AI leadership roles as demand outpaces supply',
      recommendation: 'Explore nearshore hiring options in Southeast Asia or accelerate internal AI leadership development programs',
      sources: JSON.stringify(['Levels.fyi', 'Payscale', 'LinkedIn Talent Insights']),
      confidence: 0.92,
      company: 'Netflix',
      function: 'AI',
      region: 'APAC',
      initiative: 'AI Expansion',
      category: InsightCategory.WAGE_PRESSURE,
      created_at: '2024-11-20T10:00:00Z'
    },
    {
      id: generateId(),
      signal: 'Executive job postings declined 25% across major streaming competitors in EMEA',
      interpretation: 'Reduced competition for senior talent acquisition during market consolidation phase',
      recommendation: 'Accelerate executive recruiting efforts while market is favorable, particularly for Content and Product leadership',
      sources: JSON.stringify(['LinkedIn', 'Crunchbase', 'PitchBook']),
      confidence: 0.88,
      company: 'Netflix',
      function: 'Product',
      region: 'EMEA',
      initiative: null,
      category: InsightCategory.EXECUTIVE_TALENT,
      created_at: '2024-11-19T14:30:00Z'
    },
    {
      id: generateId(),
      signal: 'LATAM foreign exchange volatility reached 18%, highest in 3 years',
      interpretation: 'Currency fluctuations creating 12-15% variance in real compensation values for executives',
      recommendation: 'Implement quarterly FX-adjusted compensation reviews and consider USD-denominated contracts for VP+ roles',
      sources: JSON.stringify(['OECD', 'Trading Economics', 'World Bank']),
      confidence: 0.95,
      company: 'Netflix',
      function: 'Content Ops',
      region: 'LATAM',
      initiative: null,
      category: InsightCategory.MACRO_ECONOMIC,
      created_at: '2024-11-18T09:15:00Z'
    },
    {
      id: generateId(),
      signal: '12,000+ tech executives displaced in North America due to recent layoff wave',
      interpretation: 'Unprecedented availability of senior executive talent with streaming, ads, and AI experience',
      recommendation: 'Activate proactive outreach campaigns for strategic VP and C-suite roles, focusing on former Disney+, Hulu, and Prime Video leaders',
      sources: JSON.stringify(['Layoffs.fyi', 'TechCrunch', 'LinkedIn']),
      confidence: 0.90,
      company: 'Netflix',
      function: 'Ads',
      region: 'NA',
      initiative: 'Ad-tier Expansion',
      category: InsightCategory.TALENT_SUPPLY,
      created_at: '2024-11-17T16:45:00Z'
    },
    {
      id: generateId(),
      signal: 'Executive hiring activity growing 42% in LATAM, outpacing all other regions',
      interpretation: 'LATAM emerging as new executive talent hub with strong technical and business leadership pipeline',
      recommendation: 'Consider establishing São Paulo and Mexico City as regional executive recruiting hubs with dedicated talent teams',
      sources: JSON.stringify(['LinkedIn Talent Insights', 'Crunchbase', 'PitchBook']),
      confidence: 0.86,
      company: 'Netflix',
      function: 'Product',
      region: 'LATAM',
      initiative: 'Global Expansion',
      category: InsightCategory.TALENT_SUPPLY,
      created_at: '2024-11-16T11:20:00Z'
    },
    {
      id: generateId(),
      signal: 'EMEA inflation at 7.2% with wage growth lagging at 2.5% and executive mobility index at 75/100',
      interpretation: 'Real wages declining 4.7% creating significant retention risk for senior executives in key markets',
      recommendation: 'Implement emergency FX-adjusted compensation policy for UK, Germany, and Netherlands executives. Consider retention bonuses for critical roles.',
      sources: JSON.stringify(['OECD', 'Bureau of Labor Statistics', 'LinkedIn']),
      confidence: 0.93,
      company: 'Netflix',
      function: 'Content Ops',
      region: 'EMEA',
      initiative: null,
      category: InsightCategory.WAGE_PRESSURE,
      created_at: '2024-11-15T13:00:00Z'
    },
    {
      id: generateId(),
      signal: '15 major organizational restructures announced by streaming competitors in Q4',
      interpretation: 'Significant talent displacement expected with potential strategic pivots away from certain content verticals',
      recommendation: 'Monitor affected executives at Disney, Paramount, and Warner Bros Discovery for recruitment opportunities in Q1 2025',
      sources: JSON.stringify(['Crunchbase', 'TechCrunch', 'The Information']),
      confidence: 0.85,
      company: 'Netflix',
      function: 'Content Ops',
      region: 'NA',
      initiative: null,
      category: InsightCategory.EXECUTIVE_TALENT,
      created_at: '2024-11-14T15:30:00Z'
    },
    {
      id: generateId(),
      signal: 'Ads executive job postings down 30% in EMEA despite industry growth',
      interpretation: 'Limited market competition for senior Ads leadership talent as competitors scale back',
      recommendation: 'Activate targeted EMEA executive outreach for Ads roles, particularly in UK and Germany where ad-tier adoption is accelerating',
      sources: JSON.stringify(['LinkedIn', 'PitchBook', 'eMarketer']),
      confidence: 0.89,
      company: 'Netflix',
      function: 'Ads',
      region: 'EMEA',
      initiative: 'Ad-tier Expansion',
      category: InsightCategory.EXECUTIVE_TALENT,
      created_at: '2024-11-13T10:45:00Z'
    },
    {
      id: generateId(),
      signal: 'APAC tech executive compensation grew 35% YoY, driven by AI and streaming investments',
      interpretation: 'Intense competition for senior tech leadership in Asia-Pacific region',
      recommendation: 'Develop APAC-specific retention packages and accelerate equity vesting for critical AI and Product executives',
      sources: JSON.stringify(['Levels.fyi', 'LinkedIn Talent Insights', 'Mercer']),
      confidence: 0.91,
      company: 'Netflix',
      function: 'AI',
      region: 'APAC',
      initiative: 'AI Expansion',
      category: InsightCategory.WAGE_PRESSURE,
      created_at: '2024-11-12T14:15:00Z'
    },
    {
      id: generateId(),
      signal: 'Product executive talent pool expanded 25% in APAC following tech sector adjustments',
      interpretation: 'Increased availability of senior product leaders with streaming, social, and e-commerce experience',
      recommendation: 'Prioritize APAC product executive recruitment for subscriber growth and localization initiatives',
      sources: JSON.stringify(['LinkedIn', 'Crunchbase', 'TechInAsia']),
      confidence: 0.87,
      company: 'Netflix',
      function: 'Product',
      region: 'APAC',
      initiative: 'Global Expansion',
      category: InsightCategory.TALENT_SUPPLY,
      created_at: '2024-11-11T09:30:00Z'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO insights (id, signal, interpretation, recommendation, sources, confidence, company, function, region, initiative, category, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const insight of insights) {
    stmt.run(
      insight.id,
      insight.signal,
      insight.interpretation,
      insight.recommendation,
      insight.sources,
      insight.confidence,
      insight.company,
      insight.function,
      insight.region,
      insight.initiative,
      insight.category,
      insight.created_at
    );
  }

  console.log(`✅ Seeded ${insights.length} insights`);
}

function main() {
  console.log('🚀 Starting database seed...\n');

  initializeDatabase();

  db.exec('DELETE FROM data_points');
  db.exec('DELETE FROM insights');

  seedDataPoints();
  seedInsights();

  console.log('\n✨ Database seeded successfully!');
  process.exit(0);
}

main();
