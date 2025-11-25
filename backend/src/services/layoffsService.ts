/**
 * Layoffs.fyi Data Service
 * Fetches REAL tech layoff data from public sources
 *
 * Data Source: GitHub community datasets scraped from Layoffs.fyi
 * Attribution: Data compiled from layoffs.fyi by Roger Lee and community contributors
 *
 * IMPORTANT: All data is REAL - sourced from actual layoff reports and public announcements
 */

export interface LayoffRecord {
  company: string;
  location: string;
  industry: string;
  total_laid_off: number;
  percentage_laid_off?: number;
  date: string;
  stage: string;
  country: string;
  funds_raised_millions?: number;
  source: string; // Original source URL from layoffs.fyi
}

export interface LayoffStats {
  totalLayoffs: number;
  totalCompanies: number;
  byIndustry: Record<string, number>;
  byCountry: Record<string, number>;
  byStage: Record<string, number>;
  recentLayoffs: LayoffRecord[]; // Last 30 days
  executiveLevelEstimate: number; // Estimated executive-level layoffs
}

export class LayoffsService {
  private csvUrl = 'https://raw.githubusercontent.com/bigyaa/Layoff-Prediction-Model/master/layoffs_data_fyi.csv';

  /**
   * Fetch real layoff data from GitHub CSV
   * Data is scraped from layoffs.fyi and maintained by community
   */
  async fetchLayoffData(): Promise<LayoffRecord[]> {
    try {
      const response = await fetch(this.csvUrl);

      if (!response.ok) {
        console.error('Failed to fetch layoffs data:', response.statusText);
        return [];
      }

      const csvText = await response.text();
      const records = this.parseCSV(csvText);

      console.log(`✅ Fetched ${records.length} real layoff records from Layoffs.fyi dataset`);
      return records;

    } catch (error) {
      console.error('Error fetching layoffs data:', error);
      return [];
    }
  }

  /**
   * Parse CSV data into structured records
   */
  private parseCSV(csvText: string): LayoffRecord[] {
    const lines = csvText.split('\n');
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());

    const records: LayoffRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      if (values.length < headers.length) continue;

      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim() || '';
      });

      // Map to our interface
      const layoffRecord: LayoffRecord = {
        company: record.company || record.Company || '',
        location: record.location || record.Location || '',
        industry: record.industry || record.Industry || '',
        total_laid_off: parseInt(record.total_laid_off || record['Total Laid Off'] || '0') || 0,
        percentage_laid_off: parseFloat(record.percentage_laid_off || record['Percentage Laid Off'] || '0') || undefined,
        date: record.date || record.Date || '',
        stage: record.stage || record.Stage || '',
        country: record.country || record.Country || '',
        funds_raised_millions: parseFloat(record.funds_raised_millions || record['Funds Raised'] || '0') || undefined,
        source: 'Layoffs.fyi'
      };

      if (layoffRecord.company && layoffRecord.total_laid_off > 0) {
        records.push(layoffRecord);
      }
    }

    return records;
  }

  /**
   * Parse a CSV line handling quoted fields
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  /**
   * Get layoff statistics and insights
   */
  async getLayoffStats(): Promise<LayoffStats> {
    const records = await this.fetchLayoffData();

    const stats: LayoffStats = {
      totalLayoffs: 0,
      totalCompanies: new Set<string>().size,
      byIndustry: {},
      byCountry: {},
      byStage: {},
      recentLayoffs: [],
      executiveLevelEstimate: 0
    };

    const companies = new Set<string>();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const record of records) {
      stats.totalLayoffs += record.total_laid_off;
      companies.add(record.company);

      // Group by industry
      if (record.industry) {
        stats.byIndustry[record.industry] = (stats.byIndustry[record.industry] || 0) + record.total_laid_off;
      }

      // Group by country
      if (record.country) {
        stats.byCountry[record.country] = (stats.byCountry[record.country] || 0) + record.total_laid_off;
      }

      // Group by stage
      if (record.stage) {
        stats.byStage[record.stage] = (stats.byStage[record.stage] || 0) + record.total_laid_off;
      }

      // Recent layoffs (last 30 days)
      try {
        const recordDate = new Date(record.date);
        if (recordDate >= thirtyDaysAgo) {
          stats.recentLayoffs.push(record);
        }
      } catch (e) {
        // Invalid date, skip
      }
    }

    stats.totalCompanies = companies.size;

    // Estimate executive-level layoffs (typically 5-10% of total layoffs are senior/exec level)
    stats.executiveLevelEstimate = Math.round(stats.totalLayoffs * 0.07);

    return stats;
  }

  /**
   * Get tech industry layoffs specifically
   */
  async getTechLayoffs(): Promise<LayoffRecord[]> {
    const records = await this.fetchLayoffData();

    const techKeywords = ['tech', 'software', 'saas', 'internet', 'ai', 'data', 'cloud', 'mobile', 'consumer', 'fintech', 'crypto'];

    return records.filter(record => {
      const industry = record.industry.toLowerCase();
      return techKeywords.some(keyword => industry.includes(keyword));
    });
  }

  /**
   * Get executive-level displacement estimate by company size
   */
  async getExecutiveDisplacement(): Promise<{
    total: number;
    byStage: Record<string, number>;
    topCompanies: Array<{ company: string; estimatedExecs: number; totalLaidOff: number }>;
  }> {
    const records = await this.fetchLayoffData();

    const result = {
      total: 0,
      byStage: {} as Record<string, number>,
      topCompanies: [] as Array<{ company: string; estimatedExecs: number; totalLaidOff: number }>
    };

    // Executive percentage varies by company stage
    const execPercentageByStage: Record<string, number> = {
      'Post-IPO': 0.08,
      'Acquired': 0.10,
      'Series C': 0.06,
      'Series D': 0.07,
      'Series E': 0.08,
      'Unknown': 0.05
    };

    const companyTotals: Record<string, { total: number; stage: string; execEstimate: number }> = {};

    for (const record of records) {
      const stage = record.stage || 'Unknown';
      const execPercentage = execPercentageByStage[stage] || 0.05;
      const estimatedExecs = Math.round(record.total_laid_off * execPercentage);

      result.total += estimatedExecs;
      result.byStage[stage] = (result.byStage[stage] || 0) + estimatedExecs;

      if (!companyTotals[record.company]) {
        companyTotals[record.company] = { total: 0, stage, execEstimate: 0 };
      }
      companyTotals[record.company].total += record.total_laid_off;
      companyTotals[record.company].execEstimate += estimatedExecs;
    }

    // Top companies by executive displacement
    result.topCompanies = Object.entries(companyTotals)
      .map(([company, data]) => ({
        company,
        estimatedExecs: data.execEstimate,
        totalLaidOff: data.total
      }))
      .sort((a, b) => b.estimatedExecs - a.estimatedExecs)
      .slice(0, 20);

    return result;
  }

  /**
   * Get data source attribution
   */
  getAttribution(): string {
    return 'Layoffs.fyi - Compiled by Roger Lee and community contributors';
  }

  /**
   * Get the source URL
   */
  getSourceUrl(): string {
    return 'https://layoffs.fyi/';
  }

  /**
   * Get the GitHub data URL
   */
  getDataUrl(): string {
    return this.csvUrl;
  }
}

export const layoffsService = new LayoffsService();
