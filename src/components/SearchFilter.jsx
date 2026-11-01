const REGIONS = [
  { label: 'All Nations', value: '' },
  { label: 'Africa', value: 'Africa' },
  { label: 'Americas', value: 'Americas' },
  { label: 'Asia', value: 'Asia' },
  { label: 'Europe', value: 'Europe' },
  { label: 'Oceania', value: 'Oceania' },
];

function SearchFilter({ searchTerm, region, setSearchParams, totalCount, filteredCount }) {
  const handleSearchChange = (e) => {
    setSearchParams((params) => {
      if (e.target.value) {
        params.set('search', e.target.value);
      } else {
        params.delete('search');
      }
      return params;
    });
  };

  const handleClear = () => {
    setSearchParams((params) => {
      params.delete('search');
      return params;
    });
  };

  const handleRegionSelect = (value) => {
    setSearchParams((params) => {
      if (value) {
        params.set('region', value);
      } else {
        params.delete('region');
      }
      return params;
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-ink-tertiary)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by country, capital, native name, or ISO 3166 code..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full h-10 pl-9 pr-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-tertiary)] focus:outline-none focus:border-[var(--color-ink)] focus:ring-1 focus:ring-[var(--color-ink)] transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Region Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
        {REGIONS.map((r) => {
          const isActive = region === r.value;
          return (
            <button
              key={r.value}
              onClick={() => handleRegionSelect(r.value)}
              className={`h-[26px] px-3 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer border active:scale-[0.97] ${
                isActive
                  ? 'bg-[var(--color-chip-active-bg)] text-[var(--color-chip-active-text)] border-transparent'
                  : 'bg-[var(--color-chip-bg)] text-[var(--color-ink)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              {r.label}
              {r.value === '' && totalCount > 0 && (
                <span className={`ml-1.5 tabular-nums ${isActive ? 'opacity-70' : 'text-[var(--color-ink-tertiary)]'}`}>
                  {totalCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SearchFilter;
