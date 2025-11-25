import { Insight } from '../types';

interface InsightCardProps {
  insight: Insight;
}

const categoryColors: Record<string, string> = {
  'Executive Talent Trends': 'bg-blue-500',
  'Wage Pressures & Inflation': 'bg-yellow-500',
  'Macroeconomic Signals': 'bg-purple-500',
  'Talent Supply Shifts': 'bg-green-500'
};

// Official data source URLs - pointing to actual data portals and reports
const sourceUrls: Record<string, string> = {
  // U.S. Bureau of Labor Statistics - Official Government Data
  'Bureau of Labor Statistics': 'https://www.bls.gov/data/',
  'BLS CPS': 'https://www.bls.gov/cps/data.htm', // Current Population Survey data tables
  'BLS Employment': 'https://www.bls.gov/ces/', // Current Employment Statistics

  // Federal Reserve Economic Data - Official Fed Data
  'FRED': 'https://fred.stlouisfed.org/',
  'FRED Employment': 'https://fred.stlouisfed.org/categories/10', // Employment & Population data
  'FRED Wages': 'https://fred.stlouisfed.org/categories/32447', // Wages & Earnings data

  // OECD - International Employment Data
  'OECD': 'https://data.oecd.org/', // OECD Data Portal
  'OECD Employment Outlook': 'https://www.oecd.org/en/publications/oecd-employment-outlook-2024_ac8b3538-en.html', // 2024 Report

  // Industry & Market Data
  'LinkedIn Talent Insights': 'https://business.linkedin.com/talent-solutions/talent-insights',
  'LinkedIn': 'https://www.linkedin.com/pulse/topics/talent-management',
  'Crunchbase': 'https://www.crunchbase.com/discover/organization.companies',
  'PitchBook': 'https://pitchbook.com/news',
  'Levels.fyi': 'https://www.levels.fyi/comp.html',
  'Payscale': 'https://www.payscale.com/research/US/Country=United_States/Salary',
  'World Bank': 'https://data.worldbank.org/indicator',
  'Trading Economics': 'https://tradingeconomics.com/united-states/indicators',
  'IMF': 'https://www.imf.org/en/Publications/WEO',
  'Layoffs.fyi': 'https://layoffs.fyi',
  'TechCrunch': 'https://techcrunch.com/category/venture/',
  'TechInAsia': 'https://www.techinasia.com/startups',
  'The Information': 'https://www.theinformation.com/articles',
  'eMarketer': 'https://www.emarketer.com/insights/charts/',
  'Mercer': 'https://www.mercer.com/our-thinking/career/global-talent-hr-trends.html'
};

export default function InsightCard({ insight }: InsightCardProps) {
  const categoryColor = categoryColors[insight.category] || 'bg-gray-500';

  const getSourceUrl = (source: string): string | undefined => {
    return sourceUrls[source];
  };

  return (
    <div className="bg-netflix-gray rounded-lg p-6 shadow-lg border border-gray-700 hover:border-netflix-red transition-colors">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`${categoryColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
            {insight.category}
          </span>
          <span className="text-gray-400 text-xs">
            {insight.region} • {insight.function}
          </span>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">
          {insight.signal}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-gray-400 text-sm font-semibold mb-1">Interpretation</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {insight.interpretation}
          </p>
        </div>

        <div>
          <h4 className="text-gray-400 text-sm font-semibold mb-1">Strategic Recommendation</h4>
          <p className="text-white text-sm leading-relaxed font-medium">
            {insight.recommendation}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-700">
          <h4 className="text-gray-400 text-xs font-semibold mb-2">Sources</h4>
          <div className="flex flex-wrap gap-2">
            {insight.sources.map((source, idx) => {
              const url = getSourceUrl(source);
              return url ? (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-netflix-black text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 hover:border-netflix-red hover:text-white transition-colors cursor-pointer"
                >
                  {source} ↗
                </a>
              ) : (
                <span
                  key={idx}
                  className="bg-netflix-black text-gray-300 text-xs px-2 py-1 rounded border border-gray-700"
                >
                  {source}
                </span>
              );
            })}
          </div>
        </div>

        {insight.initiative && (
          <div className="pt-2">
            <span className="text-netflix-red text-xs font-semibold">
              🎯 {insight.initiative}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
