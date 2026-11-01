import { createContext, useState, useCallback } from "react";

export const CountryContext = createContext();

const API_KEY = import.meta.env.VITE_REST_COUNTRIES_API_KEY;
const CACHE_KEY = "rest_countries_cache_v5";

function mapV5Country(c) {
  const alpha2 = c.codes?.alpha_2?.toLowerCase() || "";
  const flagSvg = c.flag?.url_svg || (alpha2 ? `https://flagcdn.com/${alpha2}.svg` : "");
  const flagPng = c.flag?.url_png || (alpha2 ? `https://flagcdn.com/w320/${alpha2}.png` : "");

  return {
    name: {
      common: c.names?.common || "",
      official: c.names?.official || "",
    },
    region: c.region || "",
    capital: Array.isArray(c.capitals) ? c.capitals.map((cap) => cap.name).filter(Boolean) : [],
    population: typeof c.population === "number" ? c.population : 0,
    flags: {
      svg: flagSvg,
      png: flagPng,
    },
    cca3: c.codes?.alpha_3 || "",
  };
}

export function CountryProvider({ children }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountries = useCallback(async () => {
    // 1. استخدام التخزين المؤقت أولاً لتفادي استهلاك حد الطلبات الشهري (1000 طلب/شهر في الخطة المجانية)
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
      // تجاوز أي خطأ في localStorage
    }

    setLoading(true);
    setError(null);

    try {
      // 2. طلب البيانات من الإصدار الخامس الجديد v5 في حال توفر الـ API Key
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

      throw new Error("استخدام المصدر البديل");
    } catch (err) {
      console.warn("جاري استخدام المصدر الاحتياطي للبيانات:", err);

      // 3. مصدر احتياطي مباشر في حال عدم توفر المفتاح أو نفاد الكوتة الشهرية
      try {
        const fallbackRes = await fetch(
          "https://raw.githubusercontent.com/restcountries/restcountries/master/src/main/resources/countriesV3.1.json"
        );
        const fallbackData = await fallbackRes.json();
        if (Array.isArray(fallbackData)) {
          setCountries(fallbackData);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(fallbackData));
          } catch {
            // ignore
          }
          return;
        }
      } catch (fallbackErr) {
        console.error("فشل المصدر الاحتياطي أيضاً:", fallbackErr);
        setError("تعذر تحميل بيانات الدول");
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
