import { useEffect, useContext } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import CountriesList from './components/CountriesList';
import CountryDetails from './components/CountryDetails';
import { CountryContext } from './context/CountryContext';

function App() {
  const { countries, fetchCountries, loading, error } = useContext(CountryContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const region = searchParams.get("region") || "";

  useEffect(() => {
    fetchCountries(); // تحميل الدول عند بداية تشغيل التطبيق
  }, [fetchCountries]);

  const countryList = Array.isArray(countries) ? countries : [];
  const filtered = countryList.filter((country) =>
    country.name?.common?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (region === "" || country.region === region)
  );

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchFilter
                searchTerm={searchTerm}
                region={region}
                setSearchParams={setSearchParams}
              />
              {loading && <p style={{ textAlign: "center", padding: "2rem" }}>Loading countries...</p>}
              {error && <p style={{ textAlign: "center", color: "red", padding: "1rem" }}>{error}</p>}
              {!loading && <CountriesList countries={filtered} />}
            </>
          }
        />
        <Route path="/country/:name" element={<CountryDetails />} />
      </Routes>
    </>
  );
}

export default App;
