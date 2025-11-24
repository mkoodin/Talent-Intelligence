export interface Insight {
  id: string;
  signal: string;
  interpretation: string;
  recommendation: string;
  sources: string[];
  confidence: number;
  company: string;
  function: string;
  region: string;
  initiative?: string;
  category: InsightCategory;
  createdAt: string;
}

export enum InsightCategory {
  EXECUTIVE_TALENT = 'Executive Talent Trends',
  WAGE_PRESSURE = 'Wage Pressures & Inflation',
  MACRO_ECONOMIC = 'Macroeconomic Signals',
  TALENT_SUPPLY = 'Talent Supply Shifts'
}

export interface FilterOptions {
  companies: string[];
  functions: string[];
  regions: string[];
  initiatives: string[];
  categories: InsightCategory[];
}

export interface InsightQuery {
  company?: string;
  function?: string;
  region?: string;
  initiative?: string;
  category?: InsightCategory;
}

export interface DataPoint {
  metric: string;
  value: number;
  region: string;
  function?: string;
  timestamp: string;
}

export interface InsightRule {
  id: string;
  name: string;
  conditions: Condition[];
  output: {
    signal: string;
    interpretation: string;
    recommendation: string;
    category: InsightCategory;
  };
}

export interface Condition {
  metric: string;
  operator: '>' | '<' | '=' | '>=' | '<=' | '!=';
  value: number;
  region?: string;
  function?: string;
}
