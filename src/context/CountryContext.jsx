import { createContext, useState, useCallback } from "react";

export const CountryContext = createContext();

const API_KEY = import.meta.env.VITE_REST_COUNTRIES_API_KEY;
const CACHE_KEY = "rest_countries_cache_v5";

function mapV5Country(c) {
  const alpha2 = c.codes?.alpha_2?.toLowerCase() || "";
  const flagSvg = c.flag?.url_svg || (alpha2 ? `https://flagcdn.com/${alpha2}.svg` : "");
  const flagPng = c.flag?.url_png || (alpha2 ? `https://flagcdn.com/w320/${alpha2}.png` : "");

  // Currencies formatting
  let currenciesList = [];
  if (Array.isArray(c.currencies)) {
    currenciesList = c.currencies.map((cur) => cur.name ? `${cur.name} (${cur.symbol || cur.code || ''})` : cur).filter(Boolean);
  } else if (typeof c.currencies === 'object' && c.currencies !== null) {
    currenciesList = Object.values(c.currencies).map((cur) => cur.name ? `${cur.name} (${cur.symbol || ''})` : cur);
  }

  // Languages formatting
  let languagesList = [];
  if (Array.isArray(c.languages)) {
    languagesList = c.languages.map((l) => l.name || l).filter(Boolean);
  } else if (typeof c.languages === 'object' && c.languages !== null) {
    languagesList = Object.values(c.languages);
  }

  return {
    name: {
      common: c.names?.common || "",
      official: c.names?.official || "",
    },
    region: c.region || "",
    subregion: c.subregion || "",
    capital: Array.isArray(c.capitals) ? c.capitals.map((cap) => cap.name).filter(Boolean) : [],
    population: typeof c.population === "number" ? c.population : 0,
    area: typeof c.area === "number" ? c.area : 0,
    flags: {
      svg: flagSvg,
      png: flagPng,
    },
    cca2: c.codes?.alpha_2 || "",
    cca3: c.codes?.alpha_3 || "",
    currencies: currenciesList,
    languages: languagesList,
    borders: Array.isArray(c.borders) ? c.borders : [],
    tld: Array.isArray(c.tlds) ? c.tlds : [],
    timezones: Array.isArray(c.timezones) ? c.timezones : [],
  };
}

function normalizeV3Country(c) {
  const currenciesList = c.currencies
    ? Object.values(c.currencies).map((cur) => cur.name ? `${cur.name} (${cur.symbol || ''})` : cur)
    : [];

  const languagesList = c.languages
    ? Object.values(c.languages)
    : [];

  return {
    name: {
      common: c.name?.common || "",
      official: c.name?.official || "",
    },
    region: c.region || "",
    subregion: c.subregion || "",
    capital: Array.isArray(c.capital) ? c.capital : [],
    population: typeof c.population === "number" ? c.population : 0,
    area: typeof c.area === "number" ? c.area : 0,
    flags: c.flags || {},
    cca2: c.cca2 || "",
    cca3: c.cca3 || "",
    currencies: currenciesList,
    languages: languagesList,
    borders: Array.isArray(c.borders) ? c.borders : [],
    tld: Array.isArray(c.tld) ? c.tld : [],
    timezones: Array.isArray(c.timezones) ? c.timezones : [],
  };
}

export function CountryProvider({ children }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountries = useCallback(async () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCountries(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }

    setLoading(true);
    setError(null);

    try {
      if (API_KEY) {
        const headers = { Authorization: `Bearer ${API_KEY}` };
        const pages = await Promise.all([
          fetch("https://api.restcountries.com/countries/v5?limit=100&offset=0", { headers }).then((r) => r.json()),
          fetch("https://api.restcountries.com/countries/v5?limit=100&offset=100", { headers }).then((r) => r.json()),
          fetch("https://api.restcountries.com/countries/v5?limit=100&offset=200", { headers }).then((r) => r.json()),
        ]);

        const rawCountries = pages.flatMap((p) => p?.data?.objects || []);

        if (rawCountries.length > 0) {
          const formatted = rawCountries.map(mapV5Country);
          setCountries(formatted);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(formatted));
          } catch {
            // ignore
          }
          return;
        }
      }

      throw new Error("Using fallback data source");
    } catch (err) {
      console.warn("Using fallback country data:", err);

      try {
        const fallbackRes = await fetch(
          "https://raw.githubusercontent.com/restcountries/restcountries/master/src/main/resources/countriesV3.1.json"
        );
        const fallbackData = await fallbackRes.json();
        if (Array.isArray(fallbackData)) {
          const formatted = fallbackData.map(normalizeV3Country);
          setCountries(formatted);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(formatted));
          } catch {
            // ignore
          }
          return;
        }
      } catch (fallbackErr) {
        console.error("Fallback error:", fallbackErr);
        setError("Failed to load country data.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CountryContext.Provider value={{ countries, fetchCountries, loading, error }}>
      {children}
    </CountryContext.Provider>
  );
}
