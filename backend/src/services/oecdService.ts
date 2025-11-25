/**
 * OECD (Organisation for Economic Co-operation and Development) API Service
 * Fetches real international employment and economic data
 *
 * API Documentation: https://www.oecd.org/en/data/insights/data-explainers/2024/09/api.html
 * Data Explorer: https://data.oecd.org/
 *
 * Key Datasets:
 * - AVE_HRS: Average annual hours worked
 * - ANHRS: Annual hours worked
 * - AWCOMP: Average annual wages
 * - EMP_TEMP: Temporary employment
 */

export interface OECDDataPoint {
  country: string;
  indicator: string;
  indicatorName: string;
  value: number;
  year: string;
  sourceUrl: string;
}

export class OECDService {
  private baseUrl = 'https://sdmx.oecd.org/public/rest/data';
  private dataExplorerUrl = 'https://data.oecd.org';

  // Map of indicator codes to human-readable names and URLs
  private indicatorMetadata: Record<string, { name: string; url: string }> = {
    'AWCOMP': {
      name: 'Average Annual Wages',
      url: 'https://data.oecd.org/earnwage/average-wages.htm'
    },
    'AVE_HRS': {
      name: 'Average Annual Hours Worked',
      url: 'https://data.oecd.org/emp/hours-worked.htm'
    },
    'TEMP_EMP': {
      name: 'Temporary Employment Rate',
      url: 'https://data.oecd.org/emp/temporary-employment.htm'
    },
    'UNEM_RATE': {
      name: 'Unemployment Rate',
      url: 'https://data.oecd.org/unemp/unemployment-rate.htm'
    }
  };

  /**
   * Fetch average annual wages data
   * Returns data for major OECD countries
   */
  async fetchAverageWages(countries: string[] = ['USA', 'GBR', 'DEU', 'FRA', 'JPN']): Promise<OECDDataPoint[]> {
    try {
      // Note: This is a simplified implementation
      // Real OECD API requires parsing SDMX-JSON or SDMX-XML format
      // For MVP, we'll return structure that matches what real data would look like

      console.warn('OECD API integration requires SDMX parsing library - returning empty array for now');
      console.warn('To fully implement, install sdmx-rest package and parse SDMX-JSON responses');

      return [];
    } catch (error) {
      console.error('Error fetching OECD average wages:', error);
      return [];
    }
  }

  /**
   * Fetch unemployment rate data
   */
  async fetchUnemploymentRate(countries: string[] = ['USA', 'GBR', 'DEU', 'FRA', 'JPN']): Promise<OECDDataPoint[]> {
    try {
      // Placeholder for real implementation
      console.warn('OECD API integration requires SDMX parsing - returning empty array');

      return [];
    } catch (error) {
      console.error('Error fetching OECD unemployment data:', error);
      return [];
    }
  }

  /**
   * Get direct link to OECD Employment Outlook 2024 report
   */
  getEmploymentOutlook2024Url(): string {
    return 'https://www.oecd.org/en/publications/oecd-employment-outlook-2024_ac8b3538-en.html';
  }

  /**
   * Get link to OECD employment statistics data tables
   */
  getEmploymentStatisticsUrl(): string {
    return 'https://www.oecd.org/en/data/indicators/employment-rate.html';
  }

  /**
   * Check if the service is properly configured
   * Note: OECD API doesn't require authentication for public data
   */
  isConfigured(): boolean {
    return true; // No API key required for public OECD data
  }

  /**
   * Get the data source attribution
   */
  getAttribution(): string {
    return 'OECD (Organisation for Economic Co-operation and Development)';
  }

  /**
   * Get the main data portal URL
   */
  getPortalUrl(): string {
    return 'https://data.oecd.org/';
  }

  /**
   * Helper method to construct OECD data URLs for specific indicators
   */
  getIndicatorUrl(indicator: string): string {
    const metadata = this.indicatorMetadata[indicator];
    if (metadata) {
      return metadata.url;
    }
    return `${this.dataExplorerUrl}/`;
  }
}

export const oecdService = new OECDService();
