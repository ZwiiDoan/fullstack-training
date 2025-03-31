import { useEffect, useState } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { PersonsList } from './components/PersonsList'
import { Notification } from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    refreshPersons()
  }, [])

  const [newPerson, setNewPerson] = useState({
    name: '', number: ''
  })

  const [nameFilter, setNameFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const refreshPersons = () => {
    personService.getAll().then(data => {
      setPersons(data)
    }).catch(error => {
      console.log(error)
      showErrorMessage(error.response.data.message)
    })
  }

  const showErrorMessage = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const showInfoMessage = (message) => {
    setInfoMessage(message)
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)
  }

  const handleError = (error) => {
    console.log(error)
    showErrorMessage(error.response.data.message)
    personService.getAll().then(data => {
      setPersons(data)
    })
  }

  const handleSuccess = (message) => {
    showInfoMessage(message)
    refreshPersons()
  }

  const handlePersonFormSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newPerson.name)

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace old number with a new one?`)) {
        personService.update(existingPerson.id, newPerson).then(updatedPerson => {
          handleSuccess(`Updated ${updatedPerson.name}`)
          setNewPerson({
            name: '', number: ''
          })
        }).catch(error => handleError(error))
      }
    } else {
      personService.create(newPerson).then(createdPerson => {
        handleSuccess(`Created ${createdPerson.name}`)
        setNewPerson({
          name: '', number: ''
        })
      }).catch(error => handleError(error))
    }
  }

  const handlePersonFormInputChange = (event) => {
    const { name, value } = event.target
    setNewPerson({
      ...newPerson,
      [name]: value
    })
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const handleDeletion = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.deleteById(person.id).then(() => {
        handleSuccess(`Deleted ${person.name}`)
      }).catch(error => handleError(error))
    }
  }

  const personsToShow = nameFilter ? persons.filter(p => p.name.toLowerCase().includes(nameFilter.toLowerCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification errorMessage={errorMessage} infoMessage={infoMessage} />
      <Filter filterValue={nameFilter} handleFilterChange={handleNameFilterChange} />
      <h3>Add a new</h3>
      <PersonForm newPerson={newPerson} handleSubmit={handlePersonFormSubmit} handleInputChange={handlePersonFormInputChange} />
      <h3>Numbers</h3>
      <PersonsList persons={personsToShow} handleDeletion={handleDeletion} />
    </div>
  )
}

export default App