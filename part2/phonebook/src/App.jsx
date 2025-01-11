import { useEffect, useState } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { PersonsList } from './components/PersonsList'
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

  const handlePersonFormSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newPerson.name)
    
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace old number with a new one?`)) {
        personService.update(existingPerson.id, newPerson).then(updatedPerson => {
          setPersons(persons.filter(person => person.id !== updatedPerson.id).concat(updatedPerson))
        })
      }
    } else {
      personService.create(newPerson).then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewPerson({
          name: '', number: ''
        })
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
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })
    }
  }

  const personsToShow = nameFilter ? persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterValue={nameFilter} handleFilterChange={handleNameFilterChange} />
      <h3>Add a new</h3>
      <PersonForm newPerson={newPerson} handleSubmit={handlePersonFormSubmit} handleInputChange={handlePersonFormInputChange} />
      <h3>Numbers</h3>
      <PersonsList persons={personsToShow} handleDeletion={handleDeletion} />
    </div>
  )
}

export default App