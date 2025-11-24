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

export interface Filters {
  company: string;
  function: string;
  region: string;
  initiative: string;
  category: string;
}
