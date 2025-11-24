import { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import InsightCard from './components/InsightCard';
import Stats from './components/Stats';
import { Insight, FilterOptions, Filters } from './types';
import { fetchInsights, fetchFilterOptions } from './services/api';

function App() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [filters, setFilters] = useState<Filters>({
    company: 'all',
    function: 'all',
    region: 'all',
    initiative: 'all',
    category: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalInsights, setTotalInsights] = useState(0);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadInsights();
  }, [filters]);

  async function loadFilterOptions() {
    try {
      const options = await fetchFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      setError('Failed to load filter options');
      console.error(err);
    }
  }

  async function loadInsights() {
    try {
      setLoading(true);
      setError(null);

      const activeFilters: Partial<Filters> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all') {
          activeFilters[key as keyof Filters] = value;
        }
      });

      const data = await fetchInsights(activeFilters);
      setInsights(data);

      if (Object.keys(activeFilters).length === 0) {
        setTotalInsights(data.length);
      }
    } catch (err) {
      setError('Failed to load insights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!filterOptions) {
    return (
      <div className="min-h-screen bg-netflix-darkGray flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-darkGray">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-gray-400 text-lg mb-2">
            Strategic insights for executive hiring, compensation, and organizational planning
          </h2>
        </div>

        <FilterBar
          filterOptions={filterOptions}
          filters={filters}
          onFilterChange={setFilters}
        />

        <Stats
          totalInsights={totalInsights || insights.length}
          filteredCount={insights.length}
        />

        {error && (
          <div className="bg-red-900 border border-red-700 text-white px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading insights...</div>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-12 bg-netflix-gray rounded-lg border border-gray-700">
            <div className="text-gray-400 text-xl mb-2">No insights found</div>
            <div className="text-gray-500 text-sm">
              Try adjusting your filters to see more results
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-netflix-black border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Netflix Executive Engagement & Talent Intelligence Platform
            </div>
            <div className="text-gray-500 text-xs">
              Data sources: OECD, LinkedIn, Levels.fyi, Crunchbase, World Bank
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
