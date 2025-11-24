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

const sourceUrls: Record<string, string> = {
  'LinkedIn Talent Insights': 'https://business.linkedin.com/talent-solutions',
  'LinkedIn': 'https://www.linkedin.com',
  'Crunchbase': 'https://www.crunchbase.com',
  'PitchBook': 'https://pitchbook.com',
  'Levels.fyi': 'https://www.levels.fyi',
  'Payscale': 'https://www.payscale.com',
  'Bureau of Labor Statistics': 'https://www.bls.gov',
  'OECD': 'https://www.oecd.org',
  'World Bank': 'https://www.worldbank.org',
  'Trading Economics': 'https://tradingeconomics.com',
  'IMF': 'https://www.imf.org',
  'Layoffs.fyi': 'https://layoffs.fyi',
  'TechCrunch': 'https://techcrunch.com',
  'TechInAsia': 'https://www.techinasia.com',
  'The Information': 'https://www.theinformation.com',
  'eMarketer': 'https://www.emarketer.com',
  'Mercer': 'https://www.mercer.com'
};

export default function InsightCard({ insight }: InsightCardProps) {
  const categoryColor = categoryColors[insight.category] || 'bg-gray-500';
  const confidencePercentage = Math.round(insight.confidence * 100);

  const getSourceUrl = (source: string): string | undefined => {
    return sourceUrls[source];
  };

  return (
    <div className="bg-netflix-gray rounded-lg p-6 shadow-lg border border-gray-700 hover:border-netflix-red transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
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
        <div className="flex flex-col items-end gap-1">
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">Confidence</div>
            <div className={`text-lg font-bold ${confidencePercentage >= 90 ? 'text-green-400' : confidencePercentage >= 80 ? 'text-yellow-400' : 'text-orange-400'}`}>
              {confidencePercentage}%
            </div>
          </div>
        </div>
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
