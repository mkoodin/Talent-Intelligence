/**
 * BLS (Bureau of Labor Statistics) API Service
 * Fetches real employment and wage data from official U.S. government sources
 *
 * API Documentation: https://www.bls.gov/developers/home.htm
 * Register for free API key: https://data.bls.gov/registrationEngine/
 *
 * Key Series IDs:
 * - CES6054000001: All Employees, Professional, Scientific, and Technical Services
 * - LNS14000000: Unemployment Rate
 * - LNU04032231: Unemployment rate for workers with advanced degrees
 */

interface BLSAPIResponse {
  status: string;
  responseTime: number;
  message: string[];
  Results: {
    series: Array<{
      seriesID: string;
      data: Array<{
        year: string;
        period: string;
        periodName: string;
        value: string;
        footnotes: Array<any>;
      }>;
    }>;
  };
}

export interface BLSDataPoint {
  seriesId: string;
  seriesName: string;
  value: number;
  period: string;
  year: string;
  sourceUrl: string;
}

export class BLSService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';

  // Map of Series IDs to human-readable names and direct URLs
  private seriesMetadata: Record<string, { name: string; url: string }> = {
    'CES6054000001': {
      name: 'All Employees, Professional, Scientific, and Technical Services',
      url: 'https://fred.stlouisfed.org/series/CES6054000001'
    },
    'LNU04032231': {
      name: 'Unemployment Rate - Advanced Degree Holders',
      url: 'https://www.bls.gov/cps/data.htm'
    },
    'LNS14000000': {
      name: 'Unemployment Rate (Seasonally Adjusted)',
      url: 'https://www.bls.gov/cps/data.htm'
    }
  };

  constructor() {
    this.apiKey = process.env.BLS_API_KEY;
  }

  /**
   * Fetch employment data for professional and technical services
   * Returns the most recent data point
   */
  async fetchProfessionalServicesEmployment(): Promise<BLSDataPoint | null> {
    try {
      const seriesId = 'CES6054000001';
      const data = await this.fetchSeries(seriesId, 1); // Get latest 1 year of data

      if (data && data.length > 0) {
        // Return most recent data point
        return data[0];
      }

      return null;
    } catch (error) {
      console.error('Error fetching professional services employment:', error);
      return null;
    }
  }

  /**
   * Fetch unemployment rate for workers with advanced degrees
   */
  async fetchAdvancedDegreeUnemployment(): Promise<BLSDataPoint | null> {
    try {
      const seriesId = 'LNU04032231';
      const data = await this.fetchSeries(seriesId, 1);

      if (data && data.length > 0) {
        return data[0];
      }

      return null;
    } catch (error) {
      console.error('Error fetching advanced degree unemployment:', error);
      return null;
    }
  }

  /**
   * Generic method to fetch any BLS series data
   * @param seriesId - BLS Series ID
   * @param years - Number of years of data to fetch (max 20 for v2 with API key)
   */
  private async fetchSeries(seriesId: string, years: number = 1): Promise<BLSDataPoint[]> {
    try {
      const endYear = new Date().getFullYear();
      const startYear = endYear - years + 1;

      const requestBody = {
        seriesid: [seriesId],
        startyear: startYear.toString(),
        endyear: endYear.toString(),
        registrationkey: this.apiKey
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`BLS API request failed: ${response.statusText}`);
      }

      const result = await response.json() as BLSAPIResponse;

      if (result.status !== 'REQUEST_SUCCEEDED') {
        throw new Error(`BLS API error: ${result.message.join(', ')}`);
      }

      const seriesData = result.Results.series[0];
      const metadata = this.seriesMetadata[seriesId] || {
        name: seriesId,
        url: 'https://www.bls.gov/cps/data.htm'
      };

      // Convert to our format, sorted by most recent first
      return seriesData.data.map(point => ({
        seriesId,
        seriesName: metadata.name,
        value: parseFloat(point.value),
        period: point.periodName,
        year: point.year,
        sourceUrl: metadata.url
      }));

    } catch (error) {
      console.error(`Error fetching BLS series ${seriesId}:`, error);
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
    return 'U.S. Bureau of Labor Statistics (BLS)';
  }

  /**
   * Get the main data portal URL
   */
  getPortalUrl(): string {
    return 'https://www.bls.gov/cps/data.htm';
  }
}

export const blsService = new BLSService();
