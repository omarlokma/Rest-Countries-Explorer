import { Link } from 'react-router-dom';

function CountryCard({ country }) {
  const capitalDisplay = Array.isArray(country.capital)
    ? country.capital.join(', ')
    : country.capital || 'N/A';

  return (
    <Link to={`/country/${encodeURIComponent(country.name.common)}`} className="country-card">
      <img src={country.flags?.svg || country.flags?.png} alt={country.name?.common || 'Country Flag'} />
      <div className="card-body">
        <h2>{country.name?.common}</h2>
        <p><strong>Population:</strong> {country.population?.toLocaleString()}</p>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Capital:</strong> {capitalDisplay}</p>
      </div>
    </Link>
  );
}

export default CountryCard;
