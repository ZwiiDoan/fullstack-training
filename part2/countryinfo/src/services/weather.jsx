import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const api_key = import.meta.env.VITE_SOME_KEY

const cache = {}
const TTL = 5 * 60 * 1000;

const getCurrentWeather = (cityName, countryCode) => {
    const url = `${baseUrl}?q=${cityName},${countryCode}&APPID=${api_key}&units=metric`

    const cachedData = cache[url]

    if (cachedData && (Date.now() - cachedData.timestamp < TTL)) {
        console.log(`Got ${cityName},${countryCode} weather data from cache`)
        return Promise.resolve(cachedData.data)
    } else {
        return axios.get(url).then(response => {
            cache[url] = {
                data: response.data,
                timestamp: Date.now()
            }
            console.log(`Got ${cityName},${countryCode} weather data from ${baseUrl}`)
            return response.data
        })
    }
}

export default { getCurrentWeather }