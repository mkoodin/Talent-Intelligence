import { Insight, InsightCategory, InsightRule, DataPoint, Condition } from '../models/types';
import { db } from '../config/database';
import { randomBytes } from 'crypto';

function generateId(): string {
  return randomBytes(16).toString('hex');
}

export class InsightGenerator {
  private rules: InsightRule[] = [
    {
      id: 'rule_1',
      name: 'High Inflation Retention Risk',
      conditions: [
        { metric: 'inflation_rate', operator: '>', value: 6, region: 'any' },
        { metric: 'wage_growth', operator: '<', value: 3, region: 'any' },
        { metric: 'executive_mobility', operator: '>', value: 70, region: 'any' }
      ],
      output: {
        signal: 'High inflation with stagnant wage growth detected',
        interpretation: 'Real wages declining, creating retention risk for executives',
        recommendation: 'Implement FX-adjusted compensation policy and consider retention bonuses',
        category: InsightCategory.WAGE_PRESSURE
      }
    },
    {
      id: 'rule_2',
      name: 'AI Talent Wage Surge',
      conditions: [
        { metric: 'ai_wage_growth', operator: '>', value: 20, function: 'AI' }
      ],
      output: {
        signal: 'AI executive compensation growing rapidly',
        interpretation: 'Sourcing costs rising significantly in AI leadership roles',
        recommendation: 'Explore nearshore hiring options or accelerate internal AI leadership development',
        category: InsightCategory.WAGE_PRESSURE
      }
    },
    {
      id: 'rule_3',
      name: 'Executive Hiring Freeze Opportunity',
      conditions: [
        { metric: 'exec_job_postings', operator: '<', value: -20 }
      ],
      output: {
        signal: 'Executive hiring activity declining at competitors',
        interpretation: 'Reduced competition for senior talent acquisition',
        recommendation: 'Accelerate executive recruiting efforts while market is favorable',
        category: InsightCategory.EXECUTIVE_TALENT
      }
    },
    {
      id: 'rule_4',
      name: 'FX Volatility Impact',
      conditions: [
        { metric: 'fx_volatility', operator: '>', value: 15 }
      ],
      output: {
        signal: 'High foreign exchange volatility detected',
        interpretation: 'Currency fluctuations impacting real compensation values',
        recommendation: 'Review and adjust compensation bands to account for FX changes',
        category: InsightCategory.MACRO_ECONOMIC
      }
    },
    {
      id: 'rule_5',
      name: 'Layoff Wave Talent Availability',
      conditions: [
        { metric: 'tech_layoffs', operator: '>', value: 5000 }
      ],
      output: {
        signal: 'Major layoff wave in tech sector detected',
        interpretation: 'Increased availability of senior executive talent',
        recommendation: 'Activate proactive outreach campaigns for strategic roles',
        category: InsightCategory.TALENT_SUPPLY
      }
    },
    {
      id: 'rule_6',
      name: 'Emerging Market Executive Hub',
      conditions: [
        { metric: 'exec_hiring_growth', operator: '>', value: 30 }
      ],
      output: {
        signal: 'Rapid growth in executive hiring detected',
        interpretation: 'Region emerging as new executive talent hub',
        recommendation: 'Consider establishing regional presence and recruiting operations',
        category: InsightCategory.TALENT_SUPPLY
      }
    },
    {
      id: 'rule_7',
      name: 'Competitor Org Restructure',
      conditions: [
        { metric: 'org_changes', operator: '>', value: 10 }
      ],
      output: {
        signal: 'Significant organizational changes at competitors',
        interpretation: 'Potential talent displacement and strategic shifts',
        recommendation: 'Monitor affected executives for recruitment opportunities',
        category: InsightCategory.EXECUTIVE_TALENT
      }
    },
    {
      id: 'rule_8',
      name: 'Ads Talent Shortage',
      conditions: [
        { metric: 'ads_exec_postings', operator: '<', value: -25, function: 'Ads' }
      ],
      output: {
        signal: 'Decline in Ads executive job postings',
        interpretation: 'Limited market competition for Ads leadership talent',
        recommendation: 'Activate targeted EMEA/APAC executive outreach for Ads roles',
        category: InsightCategory.EXECUTIVE_TALENT
      }
    }
  ];

  evaluateCondition(condition: Condition, dataPoints: DataPoint[]): boolean {
    const relevantData = dataPoints.filter(dp => {
      if (dp.metric !== condition.metric) return false;
      if (condition.region && condition.region !== 'any' && dp.region !== condition.region) return false;
      if (condition.function && dp.function !== condition.function) return false;
      return true;
    });

    if (relevantData.length === 0) return false;

    const latestData = relevantData.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    const value = latestData.value;

    switch (condition.operator) {
      case '>': return value > condition.value;
      case '<': return value < condition.value;
      case '=': return value === condition.value;
      case '>=': return value >= condition.value;
      case '<=': return value <= condition.value;
      case '!=': return value !== condition.value;
      default: return false;
    }
  }

  generateInsights(company: string, region: string, func: string): Insight[] {
    const stmt = db.prepare('SELECT * FROM data_points WHERE region = ? OR region = "Global"');
    const dataPoints = stmt.all(region) as DataPoint[];

    const insights: Insight[] = [];

    for (const rule of this.rules) {
      const allConditionsMet = rule.conditions.every(condition =>
        this.evaluateCondition(condition, dataPoints)
      );

      if (allConditionsMet) {
        const relevantData = dataPoints.filter(dp =>
          rule.conditions.some(c => c.metric === dp.metric)
        );

        const valueContext = relevantData.map(dp =>
          `${dp.metric}: ${dp.value}`
        ).join(', ');

        const insight: Insight = {
          id: generateId(),
          signal: `${rule.output.signal} (${valueContext})`,
          interpretation: rule.output.interpretation,
          recommendation: rule.output.recommendation,
          sources: this.getSourcesForCategory(rule.output.category),
          confidence: this.calculateConfidence(relevantData.length),
          company,
          function: func,
          region,
          category: rule.output.category,
          createdAt: new Date().toISOString()
        };

        insights.push(insight);
      }
    }

    return insights;
  }

  private getSourcesForCategory(category: InsightCategory): string[] {
    const sourceMap: Record<InsightCategory, string[]> = {
      [InsightCategory.EXECUTIVE_TALENT]: ['LinkedIn Talent Insights', 'Crunchbase', 'PitchBook'],
      [InsightCategory.WAGE_PRESSURE]: ['Levels.fyi', 'Payscale', 'Bureau of Labor Statistics'],
      [InsightCategory.MACRO_ECONOMIC]: ['OECD', 'World Bank', 'Trading Economics', 'IMF'],
      [InsightCategory.TALENT_SUPPLY]: ['LinkedIn', 'Layoffs.fyi', 'TechCrunch', 'Crunchbase']
    };

    return sourceMap[category] || ['Internal Research'];
  }

  private calculateConfidence(dataPointCount: number): number {
    if (dataPointCount >= 5) return 0.95;
    if (dataPointCount >= 3) return 0.85;
    if (dataPointCount >= 2) return 0.75;
    return 0.65;
  }
}
