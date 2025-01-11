const CountryEntry = ({ country, handleClick }) => {
    return <div>{country.name.common} <button onClick={handleClick}>show</button></div>;
};

export const CountriesList = ({ countries, selectCountry }) => {
    return <>
        {countries.length > 10 && <div>Too many matches, specify another filter</div>}
        {1 < countries.length && countries.length <= 10 && countries.map(
            country => <CountryEntry key={country.name.common} country={country} handleClick={() => selectCountry(country)} />
        )}
    </>;
};