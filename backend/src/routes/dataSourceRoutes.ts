/**
 * Data Source Routes - Real-time data from BLS, FRED, and OECD APIs
 */

import express from 'express';
import { blsService } from '../services/blsService';
import { fredService } from '../services/fredService';
import { oecdService } from '../services/oecdService';
import { layoffsService } from '../services/layoffsService';
import { scarcityEngine } from '../services/scarcityEngine';

const router = express.Router();

/**
 * GET /api/data-sources/status
 * Check which data sources are configured and available
 */
router.get('/status', (req, res) => {
  const status = {
    bls: {
      configured: blsService.isConfigured(),
      name: blsService.getAttribution(),
      portalUrl: blsService.getPortalUrl(),
      status: blsService.isConfigured() ? 'active' : 'not_configured'
    },
    fred: {
      configured: fredService.isConfigured(),
      name: fredService.getAttribution(),
      portalUrl: fredService.getPortalUrl(),
      status: fredService.isConfigured() ? 'active' : 'not_configured'
    },
    oecd: {
      configured: oecdService.isConfigured(),
      name: oecdService.getAttribution(),
      portalUrl: oecdService.getPortalUrl(),
      status: 'active' // OECD doesn't require API key
    },
    layoffs: {
      configured: true, // No API key needed - uses public GitHub CSV
      name: layoffsService.getAttribution(),
      portalUrl: layoffsService.getSourceUrl(),
      dataUrl: layoffsService.getDataUrl(),
      status: 'active',
      note: 'REAL DATA - No API key required, uses public GitHub dataset'
    }
  };

  const allConfigured = status.bls.configured && status.fred.configured && status.oecd.configured;

  res.json({
    status: allConfigured ? 'fully_operational' : 'partial',
    message: allConfigured
      ? 'All data sources are configured and operational'
      : 'Some data sources require API key configuration. See .env.example for setup instructions.',
    dataSources: status,
    setupInstructions: !allConfigured ? {
      bls: !status.bls.configured ? 'Get free API key at https://data.bls.gov/registrationEngine/' : null,
      fred: !status.fred.configured ? 'Get free API key at https://fredaccount.stlouisfed.org/apikeys' : null
    } : null
  });
});

/**
 * GET /api/data-sources/bls/professional-services-employment
 * Fetch latest professional services employment data from BLS
 */
router.get('/bls/professional-services-employment', async (req, res) => {
  try {
    if (!blsService.isConfigured()) {
      return res.status(503).json({
        error: 'BLS API not configured',
        message: 'BLS_API_KEY environment variable is not set. Get your free API key at https://data.bls.gov/registrationEngine/'
      });
    }

    const data = await blsService.fetchProfessionalServicesEmployment();

    if (!data) {
      return res.status(404).json({
        error: 'No data available',
        message: 'Unable to fetch professional services employment data from BLS'
      });
    }

    res.json({
      source: 'U.S. Bureau of Labor Statistics',
      data,
      attribution: blsService.getAttribution(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching BLS data:', error);
    res.status(500).json({
      error: 'Failed to fetch BLS data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/data-sources/bls/advanced-degree-unemployment
 * Fetch unemployment rate for workers with advanced degrees from BLS
 */
router.get('/bls/advanced-degree-unemployment', async (req, res) => {
  try {
    if (!blsService.isConfigured()) {
      return res.status(503).json({
        error: 'BLS API not configured',
        message: 'BLS_API_KEY environment variable is not set'
      });
    }

    const data = await blsService.fetchAdvancedDegreeUnemployment();

    if (!data) {
      return res.status(404).json({
        error: 'No data available'
      });
    }

    res.json({
      source: 'U.S. Bureau of Labor Statistics - Current Population Survey',
      data,
      attribution: blsService.getAttribution(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching BLS unemployment data:', error);
    res.status(500).json({
      error: 'Failed to fetch data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/data-sources/fred/employment-cost-index
 * Fetch Employment Cost Index (wages and salaries) from FRED
 */
router.get('/fred/employment-cost-index', async (req, res) => {
  try {
    if (!fredService.isConfigured()) {
      return res.status(503).json({
        error: 'FRED API not configured',
        message: 'FRED_API_KEY environment variable is not set. Get your free API key at https://fredaccount.stlouisfed.org/apikeys'
      });
    }

    const data = await fredService.fetchEmploymentCostIndex();

    if (!data) {
      return res.status(404).json({
        error: 'No data available',
        message: 'Unable to fetch Employment Cost Index from FRED'
      });
    }

    res.json({
      source: 'Federal Reserve Bank of St. Louis - FRED',
      data,
      attribution: fredService.getAttribution(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching FRED data:', error);
    res.status(500).json({
      error: 'Failed to fetch FRED data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/data-sources/fred/employment-cost-yoy
 * Calculate year-over-year change in Employment Cost Index
 */
router.get('/fred/employment-cost-yoy', async (req, res) => {
  try {
    if (!fredService.isConfigured()) {
      return res.status(503).json({
        error: 'FRED API not configured'
      });
    }

    const data = await fredService.calculateYoYChange('ECIWAG');

    if (!data) {
      return res.status(404).json({
        error: 'Insufficient data for YoY calculation'
      });
    }

    res.json({
      source: 'Federal Reserve Bank of St. Louis - FRED',
      seriesId: 'ECIWAG',
      seriesName: 'Employment Cost Index: Wages and Salaries',
      data,
      sourceUrl: 'https://fred.stlouisfed.org/series/ECIWAG',
      attribution: fredService.getAttribution(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calculating YoY change:', error);
    res.status(500).json({
      error: 'Failed to calculate YoY change',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/data-sources/fred/professional-services
 * Fetch professional services employment from FRED
 */
router.get('/fred/professional-services', async (req, res) => {
  try {
    if (!fredService.isConfigured()) {
      return res.status(503).json({
        error: 'FRED API not configured'
      });
    }

    const data = await fredService.fetchProfessionalServicesEmployment();

    if (!data) {
      return res.status(404).json({
        error: 'No data available'
      });
    }

    res.json({
      source: 'Federal Reserve Bank of St. Louis - FRED',
      data,
      attribution: fredService.getAttribution(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching FRED professional services data:', error);
    res.status(500).json({
      error: 'Failed to fetch data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/data-sources/oecd/employment-outlook
 * Get link to latest OECD Employment Outlook report
 */
router.get('/oecd/employment-outlook', (req, res) => {
  res.json({
    source: 'OECD Employment Outlook 2024',
    title: 'OECD Employment Outlook 2024: The Net-Zero Transition and the Labour Market',
    url: oecdService.getEmploymentOutlook2024Url(),
    publicationDate: '2024-07-09',
    description: 'The annual OECD Employment Outlook provides comprehensive analysis of labour market trends and policies across OECD countries.',
    dataPortal: oecdService.getPortalUrl(),
    employmentStats: oecdService.getEmploymentStatisticsUrl(),
    attribution: oecdService.getAttribution()
  });
});

/**
 * GET /api/data-sources/oecd/resources
 * Get OECD data resources and links
 */
router.get('/oecd/resources', (req, res) => {
  res.json({
    source: 'OECD',
    attribution: oecdService.getAttribution(),
    resources: {
      dataPortal: {
        name: 'OECD Data Portal',
        url: oecdService.getPortalUrl(),
        description: 'Access to all OECD statistical data'
      },
      employmentOutlook: {
        name: 'OECD Employment Outlook 2024',
        url: oecdService.getEmploymentOutlook2024Url(),
        description: 'Annual report on labour market trends'
      },
      employmentRate: {
        name: 'Employment Rate Statistics',
        url: oecdService.getEmploymentStatisticsUrl(),
        description: 'Employment indicators and data tables'
      },
      averageWages: {
        name: 'Average Wages',
        url: 'https://data.oecd.org/earnwage/average-wages.htm',
        description: 'Average annual wages across OECD countries'
      },
      unemployment: {
        name: 'Unemployment Rate',
        url: 'https://data.oecd.org/unemp/unemployment-rate.htm',
        description: 'Unemployment statistics by country'
      }
    }
  });
});

/**
 * GET /api/data-sources/layoffs/stats
 * Get comprehensive layoff statistics from REAL layoffs.fyi data
 * Data Source: Layoffs.fyi via GitHub CSV (community maintained)
 */
router.get('/layoffs/stats', async (req, res) => {
  try {
    const stats = await layoffsService.getLayoffStats();

    res.json({
      source: 'Layoffs.fyi',
      attribution: layoffsService.getAttribution(),
      sourceUrl: layoffsService.getSourceUrl(),
      dataUrl: layoffsService.getDataUrl(),
      note: 'REAL DATA - All layoff records are from verified public announcements',
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching layoff stats:', error);
    res.status(500).json({
      error: 'Failed to fetch layoff data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/data-sources/layoffs/tech
 * Get tech industry layoffs specifically
 */
router.get('/layoffs/tech', async (req, res) => {
  try {
    const techLayoffs = await layoffsService.getTechLayoffs();

    res.json({
      source: 'Layoffs.fyi - Tech Industry Only',
      attribution: layoffsService.getAttribution(),
      sourceUrl: layoffsService.getSourceUrl(),
      note: 'REAL DATA - Filtered for tech, software, SaaS, and related industries',
      count: techLayoffs.length,
      totalLaidOff: techLayoffs.reduce((sum, r) => sum + r.total_laid_off, 0),
      layoffs: techLayoffs.slice(0, 100), // Return first 100 for performance
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching tech layoffs:', error);
    res.status(500).json({
      error: 'Failed to fetch tech layoff data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/data-sources/layoffs/executive-displacement
 * Estimate executive-level talent displacement from layoffs
 * Uses industry-standard ratios (5-10% of layoffs are executive/senior level)
 */
router.get('/layoffs/executive-displacement', async (req, res) => {
  try {
    const displacement = await layoffsService.getExecutiveDisplacement();

    res.json({
      source: 'Layoffs.fyi with Executive-Level Estimation',
      attribution: layoffsService.getAttribution(),
      sourceUrl: layoffsService.getSourceUrl(),
      methodology: 'Estimates based on industry-standard executive/senior ratios by company stage (5-10% of total layoffs)',
      note: 'REAL layoff data with calculated executive estimates using established workforce composition ratios',
      displacement,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calculating executive displacement:', error);
    res.status(500).json({
      error: 'Failed to calculate executive displacement',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/data-sources/scarcity/calculate
 * Calculate executive talent scarcity across all tracked roles
 * Combines REAL data from BLS, FRED, and Layoffs.fyi
 */
router.get('/scarcity/calculate', async (req, res) => {
  try {
    const scarcityData = await scarcityEngine.calculateScarcity();

    res.json({
      source: 'Multi-Source Scarcity Analysis',
      dataSources: ['BLS', 'FRED', 'Layoffs.fyi'],
      methodology: 'Scarcity calculated using wage growth (demand indicator) and layoff displacement data (supply indicator)',
      note: 'ALL DATA IS REAL - Combines government employment data with verified layoff records',
      executiveRoles: scarcityData,
      summary: {
        highScarcity: scarcityData.filter(r => r.scarcityScore >= 70).map(r => r.role),
        lowScarcity: scarcityData.filter(r => r.scarcityScore <= 30).map(r => r.role),
        avgScarcityScore: Math.round(scarcityData.reduce((sum, r) => sum + r.scarcityScore, 0) / scarcityData.length)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calculating scarcity:', error);
    res.status(500).json({
      error: 'Failed to calculate scarcity',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/data-sources/scarcity/insights
 * Get natural language insights about talent scarcity
 */
router.get('/scarcity/insights', async (req, res) => {
  try {
    const insights = await scarcityEngine.getScarcityInsights();

    res.json({
      source: 'Executive Talent Scarcity Analysis',
      dataSources: ['BLS', 'FRED', 'Layoffs.fyi'],
      note: 'Insights generated from REAL data - No fabricated statistics',
      insights,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating scarcity insights:', error);
    res.status(500).json({
      error: 'Failed to generate insights',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
