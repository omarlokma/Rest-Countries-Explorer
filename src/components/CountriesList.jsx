import CountryCard from './CountryCard';

function CountriesList({ countries }) {
  if (!countries || countries.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="max-w-sm mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--color-surface-dim)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink-tertiary)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M8 11h6" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">No results found</h3>
          <p className="text-xs text-[var(--color-ink-tertiary)]">
            Try adjusting your search query or clearing the region filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {countries.map((country) => (
        <CountryCard key={country.cca3 || country.name?.common} country={country} />
      ))}
    </div>
  );
}

export default CountriesList;
