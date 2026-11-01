import { useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CountryContext } from '../context/CountryContext';

function CountryDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(name || "");

  const { countries, fetchCountries, loading } = useContext(CountryContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (countries.length === 0) fetchCountries();
  }, [name, countries, fetchCountries]);

  const country = countries.find(
    (c) => c.name?.common?.toLowerCase() === decodedName.toLowerCase()
  );

  if (!country) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 text-center">
        <div className="max-w-md mx-auto space-y-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8">
          <div className="w-10 h-10 mx-auto rounded-full bg-[var(--color-surface-dim)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink-tertiary)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[var(--color-ink)]">
            {loading ? 'Retrieving country dossier...' : 'Country not found'}
          </h3>
          <p className="text-xs text-[var(--color-ink-secondary)]">
            {loading
              ? 'Fetching records from the global index...'
              : `No record matching "${decodedName}" could be located.`}
          </p>
          <button
            onClick={() => navigate('/')}
            className="h-8 px-4 rounded-md bg-[var(--color-ink)] text-[var(--color-accent-text)] text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
          >
            ← Back to Explorer
          </button>
        </div>
      </div>
    );
  }

  const capitalDisplay = Array.isArray(country.capital) && country.capital.length > 0
    ? country.capital.join(', ')
    : country.capital || '—';

  const languagesDisplay = Array.isArray(country.languages) && country.languages.length > 0
    ? country.languages.join(', ')
    : '—';

  const currenciesDisplay = Array.isArray(country.currencies) && country.currencies.length > 0
    ? country.currencies.join(', ')
    : '—';

  const tldDisplay = Array.isArray(country.tld) && country.tld.length > 0
    ? country.tld.join(', ')
    : '—';

  const timezoneDisplay = Array.isArray(country.timezones) && country.timezones.length > 0
    ? country.timezones.join(', ')
    : '—';

  // Neighbor countries lookup
  const borderCountries = Array.isArray(country.borders)
    ? country.borders.map((code) => {
        const match = countries.find((c) => c.cca3 === code);
        return {
          code,
          name: match?.name?.common || code,
          flag: match?.flags?.svg || match?.flags?.png || '',
        };
      })
    : [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 space-y-6">

      {/* Top Nav Line / Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-strong)] transition-all font-medium cursor-pointer active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Back to Explorer</span>
        </button>

        <div className="flex items-center gap-2 text-[var(--color-ink-tertiary)] font-mono text-[11px]">
          <span>Geographic Repository</span>
          <span>/</span>
          <span>{country.region || 'World'}</span>
          <span>/</span>
          <span className="text-[var(--color-ink)] font-semibold">{country.name?.common}</span>
          {country.cca3 && (
            <span className="px-1.5 py-0.5 rounded bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[var(--color-ink-secondary)]">
              {country.cca3}
            </span>
          )}
        </div>
      </div>

      {/* Main Dossier Card */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-[var(--shadow-card)]">

        {/* Hero Section */}
        <div className="p-6 sm:p-8 border-b border-[var(--color-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Flag Showcase */}
            <div className="lg:col-span-4 space-y-3">
              <div className="aspect-[16/10] w-full rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-dim)] relative group">
                <img
                  src={country.flags?.svg || country.flags?.png}
                  alt={country.name?.common || 'National Flag'}
                  className="w-full h-full object-cover"
                />
                {country.cca2 && (
                  <div className="absolute top-2 left-2 bg-[var(--color-surface)]/90 backdrop-blur-sm border border-[var(--color-border)] rounded px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-ink-secondary)] tabular-nums">
                    ISO {country.cca2}
                  </div>
                )}
              </div>
            </div>

            {/* Country Titles & Meta */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="label-caps px-2 py-0.5 rounded bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[var(--color-ink-secondary)]">
                  {country.region || 'Sovereign State'}
                </span>
                {country.subregion && (
                  <span className="label-caps px-2 py-0.5 rounded bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[var(--color-ink-tertiary)]">
                    {country.subregion}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-ink)] leading-none">
                {country.name?.common}
              </h1>

              {country.name?.official && country.name?.official !== country.name?.common && (
                <p className="text-sm text-[var(--color-ink-secondary)] font-normal leading-relaxed">
                  {country.name.official}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Key Indicators Grid */}
        <div className="p-6 sm:p-8">
          <h2 className="label-caps text-[var(--color-ink-tertiary)] mb-4">Geopolitical & Analytical Ledger</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 pt-2">

            {/* Metric 1 */}
            <div className="space-y-1">
              <div className="label-caps text-[var(--color-ink-tertiary)]">Demographic Count</div>
              <div className="text-xl font-medium text-[var(--color-ink)] tabular-nums">
                {country.population ? country.population.toLocaleString() : '—'}
              </div>
              <div className="text-[11px] text-[var(--color-ink-tertiary)]">Total recorded citizens</div>
            </div>

            {/* Metric 2 */}
            <div className="space-y-1">
              <div className="label-caps text-[var(--color-ink-tertiary)]">Federal Capital</div>
              <div className="text-xl font-medium text-[var(--color-ink)] truncate">
                {capitalDisplay}
              </div>
              <div className="text-[11px] text-[var(--color-ink-tertiary)]">Seat of government</div>
            </div>

            {/* Metric 3 */}
            <div className="space-y-1">
              <div className="label-caps text-[var(--color-ink-tertiary)]">Total Surface Area</div>
              <div className="text-xl font-medium text-[var(--color-ink)] tabular-nums">
                {country.area ? `${country.area.toLocaleString()} km²` : '—'}
              </div>
              <div className="text-[11px] text-[var(--color-ink-tertiary)]">Geographic landmass</div>
            </div>

            {/* Metric 4 */}
            <div className="space-y-1">
              <div className="label-caps text-[var(--color-ink-tertiary)]">Sovereign Currency</div>
              <div className="text-base font-medium text-[var(--color-ink)] truncate">
                {currenciesDisplay}
              </div>
              <div className="text-[11px] text-[var(--color-ink-tertiary)]">Primary legal tender</div>
            </div>

            {/* Metric 5 */}
            <div className="space-y-1 pt-3 sm:border-t sm:border-[var(--color-border)]">
              <div className="label-caps text-[var(--color-ink-tertiary)]">Official Languages</div>
              <div className="text-sm font-medium text-[var(--color-ink)] leading-snug">
                {languagesDisplay}
              </div>
            </div>

            {/* Metric 6 */}
            <div className="space-y-1 pt-3 sm:border-t sm:border-[var(--color-border)]">
              <div className="label-caps text-[var(--color-ink-tertiary)]">Top-Level Domain</div>
              <div className="text-sm font-mono font-medium text-[var(--color-ink)]">
                {tldDisplay}
              </div>
            </div>

            {/* Metric 7 */}
            <div className="space-y-1 pt-3 sm:border-t sm:border-[var(--color-border)]">
              <div className="label-caps text-[var(--color-ink-tertiary)]">Standard Timezone</div>
              <div className="text-sm font-mono font-medium text-[var(--color-ink)]">
                {timezoneDisplay}
              </div>
            </div>

            {/* Metric 8 */}
            <div className="space-y-1 pt-3 sm:border-t sm:border-[var(--color-border)]">
              <div className="label-caps text-[var(--color-ink-tertiary)]">ISO Alpha-3 / Alpha-2</div>
              <div className="text-sm font-mono font-medium text-[var(--color-ink)]">
                {country.cca3 || '—'} / {country.cca2 || '—'}
              </div>
            </div>

          </div>
        </div>

        {/* Bordering Nations Ledger */}
        {borderCountries.length > 0 && (
          <div className="p-6 sm:p-8 bg-[var(--color-surface-dim)] border-t border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="label-caps text-[var(--color-ink-secondary)]">
                Bordering Nations ({borderCountries.length} Adjacent)
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {borderCountries.map((b) => (
                <Link
                  key={b.code}
                  to={`/country/${encodeURIComponent(b.name)}`}
                  className="inline-flex items-center gap-2 h-7 px-2.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-strong)] transition-all active:scale-[0.98]"
                >
                  {b.flag && (
                    <img src={b.flag} alt="" className="w-3.5 h-2.5 object-cover rounded-[1px]" />
                  )}
                  <span className="font-medium">{b.name}</span>
                  <span className="text-[10px] text-[var(--color-ink-tertiary)] font-mono">{b.code}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default CountryDetails;
