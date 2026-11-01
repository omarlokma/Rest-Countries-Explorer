import { useEffect, useContext, useMemo } from 'react';
import { Routes, Route, useSearchParams, useLocation } from 'react-router-dom';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import CountriesList from './components/CountriesList';
import CountryDetails from './components/CountryDetails';
import { CountryContext } from './context/CountryContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
}

function App() {
  const { countries, fetchCountries, loading, error } = useContext(CountryContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('search') || '';
  const region = searchParams.get('region') || '';

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const countryList = Array.isArray(countries) ? countries : [];

  // Filter countries
  const filtered = useMemo(() => {
    return countryList.filter((country) => {
      const matchSearch =
        searchTerm === '' ||
        country.name?.common?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.name?.official?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.cca3?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(country.capital) && country.capital.some((cap) => cap.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchRegion = region === '' || country.region === region;

      return matchSearch && matchRegion;
    });
  }, [countryList, searchTerm, region]);

  // Aggregate stats
  const totalWorldPop = useMemo(() => {
    return countryList.reduce((acc, c) => acc + (c.population || 0), 0);
  }, [countryList]);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col font-sans transition-colors duration-300">
      <ScrollToTop />
      {/* Navigation Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        <Routes>
          <Route
            path="/"
            element={
              <div className="space-y-6">
                
                {/* Catalog Hero Banner */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="label-caps text-[var(--color-ink-tertiary)]">
                        Geographic Repository
                      </span>
                      <span className="text-[var(--color-ink-tertiary)] text-xs">•</span>
                      <span className="label-caps text-[var(--color-ink-secondary)]">
                        UN-Recognized + Territories
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
                        Nations & Territories
                      </h1>
                      {countryList.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-surface-dim)] border border-[var(--color-border)] text-[var(--color-ink-secondary)] tabular-nums">
                          {countryList.length} records
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--color-ink-secondary)] font-normal leading-relaxed">
                      Explore global demographics, geographic landmasses, and administrative subdivisions with fine quantitative accuracy.
                    </p>
                  </div>

                  {/* Summary Metric Badges */}
                  {countryList.length > 0 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-2 min-w-[120px] shadow-[var(--shadow-card)]">
                        <div className="label-caps text-[var(--color-ink-tertiary)]">World Pop.</div>
                        <div className="text-sm font-semibold tabular-nums text-[var(--color-ink)]">
                          {(totalWorldPop / 1e9).toFixed(2)}B
                        </div>
                      </div>

                      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-2 min-w-[120px] shadow-[var(--shadow-card)]">
                        <div className="label-caps text-[var(--color-ink-tertiary)]">Cataloged</div>
                        <div className="text-sm font-semibold tabular-nums text-[var(--color-ink)]">
                          {countryList.length} Entities
                        </div>
                      </div>

                      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3.5 py-2 min-w-[120px] shadow-[var(--shadow-card)]">
                        <div className="label-caps text-[var(--color-ink-tertiary)]">Filtered</div>
                        <div className="text-sm font-semibold tabular-nums text-[var(--color-ink)]">
                          {filtered.length} Visible
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter and Search Bar */}
                <SearchFilter
                  searchTerm={searchTerm}
                  region={region}
                  setSearchParams={setSearchParams}
                  totalCount={countryList.length}
                  filteredCount={filtered.length}
                />

                {/* Loading / Error States */}
                {loading && countryList.length === 0 && (
                  <div className="py-24 text-center space-y-3">
                    <div className="w-8 h-8 mx-auto border-2 border-[var(--color-ink-secondary)] border-t-[var(--color-ink)] rounded-full animate-spin" />
                    <p className="text-xs text-[var(--color-ink-secondary)]">Loading global records...</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs text-center font-medium">
                    {error}
                  </div>
                )}

                {/* Countries Grid */}
                {(!loading || countryList.length > 0) && (
                  <CountriesList countries={filtered} />
                )}

              </div>
            }
          />

          <Route path="/country/:name" element={<CountryDetails />} />
        </Routes>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[var(--color-border)] py-6 mt-12 bg-[var(--color-surface)] transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--color-ink-tertiary)]">
          <p>© {new Date().getFullYear()} World Countries Explorer. All sovereign and territorial metrics recorded.</p>
          <p>Powered by REST Countries v5 • Curated ISO 3166-1 standard</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
