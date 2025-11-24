export default function Header() {
  return (
    <header className="bg-netflix-black border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-netflix-red text-3xl font-bold">N</div>
            <div>
              <h1 className="text-white text-2xl font-bold">
                Executive Talent Intelligence
              </h1>
              <p className="text-gray-400 text-sm">
                Research & Insights Platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-gray-400 text-xs">Last Updated</div>
              <div className="text-white text-sm font-semibold">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
