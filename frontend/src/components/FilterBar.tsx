import { FilterOptions, Filters } from '../types';

interface FilterBarProps {
  filterOptions: FilterOptions;
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterBar({ filterOptions, filters, onFilterChange }: FilterBarProps) {
  const handleChange = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className="bg-netflix-gray rounded-lg p-6 shadow-lg border border-gray-700 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-bold">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={() => onFilterChange({
              company: 'all',
              function: 'all',
              region: 'all',
              initiative: 'all',
              category: 'all'
            })}
            className="text-netflix-red text-sm hover:underline"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-2">
            Company
          </label>
          <select
            value={filters.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full bg-netflix-black text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-netflix-red"
          >
            <option value="all">All Companies</option>
            {filterOptions.companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-2">
            Function
          </label>
          <select
            value={filters.function}
            onChange={(e) => handleChange('function', e.target.value)}
            className="w-full bg-netflix-black text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-netflix-red"
          >
            <option value="all">All Functions</option>
            {filterOptions.functions.map(func => (
              <option key={func} value={func}>{func}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-2">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleChange('region', e.target.value)}
            className="w-full bg-netflix-black text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-netflix-red"
          >
            <option value="all">All Regions</option>
            {filterOptions.regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-2">
            Initiative
          </label>
          <select
            value={filters.initiative}
            onChange={(e) => handleChange('initiative', e.target.value)}
            className="w-full bg-netflix-black text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-netflix-red"
          >
            <option value="all">All Initiatives</option>
            {filterOptions.initiatives.map(initiative => (
              <option key={initiative} value={initiative}>{initiative}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full bg-netflix-black text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-netflix-red"
          >
            <option value="all">All Categories</option>
            {filterOptions.categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
