import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const cache = {}

const getAll = () => {
    const url = `${baseUrl}/all`

    const cachedData = cache[url]

    if (cachedData) {
        console.log(`Got ${cachedData.length} countries data from cache`)
        return Promise.resolve(cachedData)
    } else {
        return axios.get(url).then(response => {
            cache[url] = response.data
            console.log(`Got ${response.data.length} countries data from ${url}`)
            return response.data
        })
    }
}

export default { getAll }