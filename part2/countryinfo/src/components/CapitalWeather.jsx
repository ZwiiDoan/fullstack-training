import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

export const CapitalWeather = ({ country }) => {
    const [capitalWeather, setCapitalWeather] = useState(null)

    useEffect(() => {
        weatherService.getCurrentWeather(country.capital, country.cca2).then(data => setCapitalWeather(data))
    }, [])

    console.log('CapitalWeather component re-render')

    if (capitalWeather) {
        const weatherIcon = capitalWeather.weather[0].icon

        return <>
            <h2>Weather in {capitalWeather.name}</h2>
            <div>temparature {capitalWeather.main.temp} Celcius</div>
            <img src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt={`weather icon ${weatherIcon}`} />
            <div>wind {capitalWeather.wind.speed} m/s</div>
        </>
    } else {
        return <></>
    }
}