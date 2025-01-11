export const CountryInfo = ({ country }) => {
    return <>
        {country && <div>
            <h2>{country.name.common}</h2>
            <div>capital {country.capital[0]}</div>
            <div>area {country.area}</div>
            <h3>languages</h3>
            <ul>
                {Object.keys(country.languages).map(key => <li key={key}>{country.languages[key]}</li>)}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
        </div>}
    </>;
};