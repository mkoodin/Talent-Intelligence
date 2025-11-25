/**
 * FRED (Federal Reserve Economic Data) API Service
 * Fetches real economic data from the St. Louis Federal Reserve
 *
 * API Documentation: https://fred.stlouisfed.org/docs/api/fred/
 * Get free API key: https://fredaccount.stlouisfed.org/apikeys
 *
 * Key Series IDs:
 * - ECIWAG: Employment Cost Index: Wages and Salaries: Private Industry Workers
 * - ECIALLCIV: Employment Cost Index: Total Compensation: All Civilian
 * - CES6054000001: All Employees, Professional, Scientific, and Technical Services
 */

interface FREDObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

interface FREDResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FREDObservation[];
}

export interface FREDDataPoint {
  seriesId: string;
  seriesName: string;
  value: number;
  date: string;
  sourceUrl: string;
}

export class FREDService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.stlouisfed.org/fred';

  // Map of Series IDs to human-readable names and direct URLs
  private seriesMetadata: Record<string, { name: string; url: string }> = {
    'ECIWAG': {
      name: 'Employment Cost Index: Wages and Salaries: Private Industry Workers',
      url: 'https://fred.stlouisfed.org/series/ECIWAG'
    },
    'ECIALLCIV': {
      name: 'Employment Cost Index: Total Compensation: All Civilian',
      url: 'https://fred.stlouisfed.org/series/ECIALLCIV'
    },
    'CES6054000001': {
      name: 'All Employees, Professional, Scientific, and Technical Services',
      url: 'https://fred.stlouisfed.org/series/CES6054000001'
    },
    'CIVPART': {
      name: 'Labor Force Participation Rate',
      url: 'https://fred.stlouisfed.org/series/CIVPART'
    }
  };

  constructor() {
    this.apiKey = process.env.FRED_API_KEY;
  }

  /**
   * Fetch Employment Cost Index for Wages and Salaries
   * This tracks compensation changes for private industry workers
   */
  async fetchEmploymentCostIndex(): Promise<FREDDataPoint | null> {
    try {
      const seriesId = 'ECIWAG';
      const observations = await this.fetchSeries(seriesId, 4); // Get last 4 observations (1 year of quarterly data)

      if (observations.length > 0) {
        // Return most recent observation
        return observations[0];
      }

      return null;
    } catch (error) {
      console.error('Error fetching Employment Cost Index:', error);
      return null;
    }
  }

  /**
   * Fetch professional services employment data
   */
  async fetchProfessionalServicesEmployment(): Promise<FREDDataPoint | null> {
    try {
      const seriesId = 'CES6054000001';
      const observations = await this.fetchSeries(seriesId, 12); // Get last 12 months

      if (observations.length > 0) {
        return observations[0];
      }

      return null;
    } catch (error) {
      console.error('Error fetching professional services employment:', error);
      return null;
    }
  }

  /**
   * Calculate year-over-year change for a series
   * Useful for wage growth and employment trend analysis
   */
  async calculateYoYChange(seriesId: string): Promise<{ currentValue: number; yoyChange: number; yoyPercentChange: number } | null> {
    try {
      const observations = await this.fetchSeries(seriesId, 15); // Get 15 months to ensure we have data from a year ago

      if (observations.length < 13) {
        console.warn(`Not enough data to calculate YoY change for ${seriesId}`);
        return null;
      }

      const current = observations[0];
      const yearAgo = observations[12]; // 12 months ago

      const yoyChange = current.value - yearAgo.value;
      const yoyPercentChange = (yoyChange / yearAgo.value) * 100;

      return {
        currentValue: current.value,
        yoyChange,
        yoyPercentChange
      };
    } catch (error) {
      console.error(`Error calculating YoY change for ${seriesId}:`, error);
      return null;
    }
  }

  /**
   * Generic method to fetch FRED series data
   * @param seriesId - FRED Series ID
   * @param limit - Number of most recent observations to fetch
   */
  private async fetchSeries(seriesId: string, limit: number = 1): Promise<FREDDataPoint[]> {
    try {
      if (!this.apiKey) {
        throw new Error('FRED API key is not configured');
      }

      const url = `${this.baseUrl}/series/observations?series_id=${seriesId}&api_key=${this.apiKey}&file_type=json&sort_order=desc&limit=${limit}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`FRED API request failed: ${response.statusText}`);
      }

      const result: FREDResponse = await response.json();

      const metadata = this.seriesMetadata[seriesId] || {
        name: seriesId,
        url: `https://fred.stlouisfed.org/series/${seriesId}`
      };

      // Convert to our format and filter out invalid values
      return result.observations
        .filter(obs => obs.value !== '.')
        .map(obs => ({
          seriesId,
          seriesName: metadata.name,
          value: parseFloat(obs.value),
          date: obs.date,
          sourceUrl: metadata.url
        }));

    } catch (error) {
      console.error(`Error fetching FRED series ${seriesId}:`, error);
      return [];
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get the data source attribution
   */
  getAttribution(): string {
    return 'Federal Reserve Bank of St. Louis - FRED® Economic Data';
  }

  /**
   * Get the main data portal URL
   */
  getPortalUrl(): string {
    return 'https://fred.stlouisfed.org/';
  }
}

export const fredService = new FREDService();
