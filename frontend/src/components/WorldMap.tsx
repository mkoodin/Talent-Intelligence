import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from 'react-simple-maps';
import { Insight } from '../types';

interface WorldMapProps {
  insights: Insight[];
}

// Map countries to our regions
const countryToRegion: Record<string, string> = {
  // North America
  'USA': 'NA', 'CAN': 'NA', 'MEX': 'NA',
  // EMEA
  'GBR': 'EMEA', 'DEU': 'EMEA', 'FRA': 'EMEA', 'ITA': 'EMEA', 'ESP': 'EMEA',
  'NLD': 'EMEA', 'BEL': 'EMEA', 'CHE': 'EMEA', 'AUT': 'EMEA', 'SWE': 'EMEA',
  'NOR': 'EMEA', 'DNK': 'EMEA', 'FIN': 'EMEA', 'POL': 'EMEA', 'ZAF': 'EMEA',
  'SAU': 'EMEA', 'ARE': 'EMEA', 'ISR': 'EMEA', 'TUR': 'EMEA', 'EGY': 'EMEA',
  // LATAM
  'BRA': 'LATAM', 'ARG': 'LATAM', 'CHL': 'LATAM', 'COL': 'LATAM', 'PER': 'LATAM',
  'VEN': 'LATAM', 'ECU': 'LATAM', 'BOL': 'LATAM', 'PRY': 'LATAM', 'URY': 'LATAM',
  // APAC
  'CHN': 'APAC', 'JPN': 'APAC', 'IND': 'APAC', 'KOR': 'APAC', 'AUS': 'APAC',
  'NZL': 'APAC', 'SGP': 'APAC', 'MYS': 'APAC', 'THA': 'APAC', 'VNM': 'APAC',
  'PHL': 'APAC', 'IDN': 'APAC', 'PAK': 'APAC', 'BGD': 'APAC', 'HKG': 'APAC'
};

const regionColors: Record<string, { default: string; hover: string }> = {
  'NA': { default: '#1e40af', hover: '#3b82f6' },      // Blue
  'EMEA': { default: '#7c2d12', hover: '#ea580c' },     // Orange
  'LATAM': { default: '#14532d', hover: '#22c55e' },    // Green
  'APAC': { default: '#581c87', hover: '#a855f7' },     // Purple
};

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function WorldMap({ insights }: WorldMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<{
    region: string;
    insights: Insight[];
    stats: { total: number; categories: Record<string, number> };
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Aggregate insights by region
  const getRegionInsights = (region: string) => {
    const regionInsights = insights.filter(i => i.region === region);
    const categories = regionInsights.reduce((acc, insight) => {
      acc[insight.category] = (acc[insight.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      insights: regionInsights.slice(0, 3), // Top 3 insights
      stats: {
        total: regionInsights.length,
        categories
      }
    };
  };

  const handleMouseEnter = (geo: any, event: any) => {
    const countryCode = geo.properties.ISO_A3;
    const region = countryToRegion[countryCode];

    if (region) {
      setHoveredRegion(region);
      const regionData = getRegionInsights(region);
      setTooltipContent({ region, ...regionData });
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event: any) => {
    if (tooltipContent) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    setTooltipContent(null);
  };

  const getRegionName = (code: string) => {
    const names: Record<string, string> = {
      'NA': 'North America',
      'EMEA': 'Europe, Middle East & Africa',
      'LATAM': 'Latin America',
      'APAC': 'Asia-Pacific'
    };
    return names[code] || code;
  };

  return (
    <div className="relative bg-netflix-gray rounded-lg p-6 border border-gray-700">
      <h2 className="text-white text-xl font-semibold mb-4">Global Insights Map</h2>
      <p className="text-gray-400 text-sm mb-4">Hover over regions to see key talent intelligence insights</p>

      <div className="relative w-full" style={{ height: '400px' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 140,
            center: [0, 20]
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Sphere stroke="#374151" strokeWidth={0.5} />
          <Graticule stroke="#374151" strokeWidth={0.5} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = geo.properties.ISO_A3;
                const region = countryToRegion[countryCode];
                const isHovered = hoveredRegion === region;
                const colors = region ? regionColors[region] : null;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => handleMouseEnter(geo, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: colors ? colors.default : '#1f2937',
                        stroke: '#000',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: colors ? colors.hover : '#374151',
                        stroke: '#E50914',
                        strokeWidth: 1.5,
                        outline: 'none',
                        cursor: region ? 'pointer' : 'default'
                      },
                      pressed: {
                        fill: colors ? colors.hover : '#374151',
                        outline: 'none'
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        {tooltipContent && (
          <div
            className="fixed z-50 bg-black border border-netflix-red rounded-lg shadow-2xl p-4 max-w-md"
            style={{
              left: `${tooltipPosition.x + 15}px`,
              top: `${tooltipPosition.y + 15}px`,
              pointerEvents: 'none'
            }}
          >
            <div className="mb-2">
              <h3 className="text-netflix-red font-bold text-lg">{getRegionName(tooltipContent.region)}</h3>
              <p className="text-gray-400 text-sm">{tooltipContent.stats.total} active insights</p>
            </div>

            {tooltipContent.insights.length > 0 ? (
              <>
                <div className="space-y-2 mb-3">
                  {tooltipContent.insights.map((insight, idx) => (
                    <div key={idx} className="border-l-2 border-netflix-red pl-2">
                      <p className="text-white text-sm font-medium">{insight.signal}</p>
                      <p className="text-gray-400 text-xs mt-1">{insight.category}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <p className="text-gray-400 text-xs">
                    Categories: {Object.entries(tooltipContent.stats.categories)
                      .map(([cat, count]) => `${cat} (${count})`)
                      .join(', ')}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">No insights available for this region</p>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {Object.entries(regionColors).map(([code, colors]) => (
          <div key={code} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors.default }}
            />
            <span className="text-gray-300 text-sm">{getRegionName(code)}</span>
            <span className="text-gray-500 text-xs">
              ({insights.filter(i => i.region === code).length})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
