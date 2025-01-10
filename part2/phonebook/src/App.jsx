import { useState } from 'react'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import { PersonsList } from './components/PersonsList'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newPerson, setNewPerson] = useState({
    name: '', number: ''
  })

  const [nameFilter, setNameFilter] = useState('')

  const handlePersonFormSubmit = (event) => {
    event.preventDefault()

    if (persons.find(person => person.name === newPerson.name)) {
      alert(`${newPerson.name} is already added to phonebook`)
    } else {
      setPersons(persons.concat(newPerson))
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

  const personsToShow = nameFilter ? persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterValue={nameFilter} handleFilterChange={handleNameFilterChange} />
      <h3>Add a new</h3>
      <PersonForm newPerson={newPerson} handleSubmit={handlePersonFormSubmit} handleInputChange={handlePersonFormInputChange} />
      <h3>Numbers</h3>
      <PersonsList persons={personsToShow}/>
    </div>
  )
}

export default App