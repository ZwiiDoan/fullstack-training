import { useEffect, useState } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { PersonsList } from './components/PersonsList'
import { Notification } from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService.getAll().then(data => {
      setPersons(data)
    })
  }, [])

  const [newPerson, setNewPerson] = useState({
    name: '', number: ''
  })

  const [nameFilter, setNameFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const handlePersonFormSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newPerson.name)

    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace old number with a new one?`)) {
        personService.update(existingPerson.id, newPerson).then(updatedPerson => {
          setPersons(persons.filter(p => p.id !== updatedPerson.id).concat(updatedPerson))
          showInfoMessage(`Updated ${updatedPerson.name}`)
          setNewPerson({
            name: '', number: ''
          })
        }).catch(error => {
          console.log(error)
          showErrorMessage(`Information of ${existingPerson.name} has already been removed from server`)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
      }
    } else {
      personService.create(newPerson).then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewPerson({
          name: '', number: ''
        })
        showInfoMessage(`Created ${createdPerson.name}`)
      }).catch(error => {
        console.log(error)
        showErrorMessage(`Failed to create ${createdPerson.name}`)
      })
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
      personService.deleteById(person.id).then(deletedPerson => {
        setPersons(persons.filter(p => p.id !== deletedPerson.id))
      }).catch(error => {
        console.log(error)
        showErrorMessage(`Information of ${person.name} has already been removed from server`)
        setPersons(persons.filter(p => p.id !== person.id))
      })
    }
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