interface StatsProps {
  totalInsights: number;
  filteredCount: number;
}

export default function Stats({ totalInsights, filteredCount }: StatsProps) {
  return (
    <div className="bg-netflix-gray rounded-lg p-6 shadow-lg border border-gray-700 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-gray-400 text-sm mb-1">Total Insights</div>
          <div className="text-white text-3xl font-bold">{totalInsights}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Filtered Results</div>
          <div className="text-netflix-red text-3xl font-bold">{filteredCount}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm mb-1">Coverage</div>
          <div className="text-white text-3xl font-bold">4 Regions</div>
        </div>
      </div>
    </div>
  );
}
