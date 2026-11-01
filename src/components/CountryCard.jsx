import { Link } from 'react-router-dom';

function CountryCard({ country }) {
  const capitalDisplay = Array.isArray(country.capital) && country.capital.length > 0
    ? country.capital.join(', ')
    : country.capital || '—';

  const flagSrc = country.flags?.svg || country.flags?.png || '';
  const countryCode = country.cca3 || '';

  return (
    <Link
      to={`/country/${encodeURIComponent(country.name?.common || '')}`}
      className="group block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-dropdown)] hover:border-[var(--color-border-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)] focus:ring-offset-2"
    >
      {/* Flag */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-dim)]">
        {flagSrc ? (
          <img
            src={flagSrc}
            alt={country.name?.common || 'Flag'}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-tertiary)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        )}

        {/* ISO Code Badge */}
        {countryCode && (
          <div className="absolute top-2.5 right-2.5 bg-[var(--color-surface)]/90 backdrop-blur-sm border border-[var(--color-border)] rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--color-ink-secondary)] tabular-nums">
            {countryCode}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Country Name */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)] truncate group-hover:text-[var(--color-ink)] transition-colors leading-tight">
            {country.name?.common}
          </h2>
          {/* Arrow */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[var(--color-ink-tertiary)] group-hover:text-[var(--color-ink)] group-hover:translate-x-0.5 transition-all flex-shrink-0">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>

        {/* Data Rows */}
        <div className="space-y-1.5 pt-2 border-t border-[var(--color-border)]">
          {/* Capital */}
          <div className="flex items-center justify-between text-xs">
            <span className="label-caps text-[var(--color-ink-tertiary)]">Capital</span>
            <span className="font-medium text-[var(--color-ink)] truncate max-w-[55%] text-right">{capitalDisplay}</span>
          </div>
          {/* Population */}
          <div className="flex items-center justify-between text-xs">
            <span className="label-caps text-[var(--color-ink-tertiary)]">Population</span>
            <span className="font-medium text-[var(--color-ink)] tabular-nums">
              {country.population ? country.population.toLocaleString() : '—'}
            </span>
          </div>
        </div>

        {/* Region Chip */}
        {country.region && (
          <div className="pt-1">
            <span className="label-caps text-[var(--color-ink-secondary)] px-2 py-0.5 rounded bg-[var(--color-surface-dim)] border border-[var(--color-border)]">
              {country.region}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default CountryCard;
