import { useState, useEffect } from 'react'
import { CountriesFilter } from './components/CountriesFilter'
import { CountriesList } from './components/CountriesList'
import { CountryInfo } from './components/CountryInfo'
import { CapitalWeather } from './components/CapitalWeather'
import countryService from './services/countries'

const App = () => {
  const [filterValue, setFilterValue] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [countriesToShow, setCountriesToShow] = useState([])

  useEffect(() => {
    setLoading(true)
    countryService.getAll().then(data => {
      setAllCountries(data)
      setLoading(false)
    })
  }, [])

  const handleFilterValueChange = (event) => {
    const filterValue = event.target.value
    setFilterValue(filterValue)

    const countriesToShow = filterValue ? allCountries.filter(country => country.name.common.toLowerCase().includes(filterValue.toLowerCase())) : []
    setCountriesToShow(countriesToShow)
  }

  const selectCountry = (country) => {
    setCountriesToShow([country])
  }

  console.log('App component re-render')

  return <>
    {
      loading ? <div>Loading countries data...</div> :
        <div>
          <CountriesFilter filterValue={filterValue} handleFilterValueChange={handleFilterValueChange} />
          {countriesToShow.length > 1 && <CountriesList countries={countriesToShow} selectCountry={selectCountry} />}
          {countriesToShow.length == 1 && <>
            <CountryInfo country={countriesToShow[0]} />
            <CapitalWeather country={countriesToShow[0]} />
          </>}
        </div>
    }
  </>
}

export default App