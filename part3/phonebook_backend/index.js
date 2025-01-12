const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.use(express.json())
morgan.token('request-body', function (req, res) {
    return JSON.stringify(req.body)
})
const customMorganFormat = ':method :url :status :res[content-length] - :response-time ms :request-body'
morgan.format('customMorganFormat', customMorganFormat)
app.use(morgan('customMorganFormat'))

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>
    `)
})

const generatePersonId = () => {
    const timestamp = Date.now();
    const randomTwoDigits = Math.floor(Math.random() * 1000);
    return `${timestamp}${randomTwoDigits.toString().padStart(3, '0')}`;
}

const validatePerson = (person) => {
    if (!person) {
        return {error: 'request body must not be empty'}
    } else if (!person.name) {
        return {error: 'name must not be empty'}
    } else if (!person.number) {
        return {error: 'number must not be empty'}
    } else if (persons.find(p => p.name.toLowerCase() === person.name.toLowerCase())) {
        return {error: 'name must be unique'}
    } else {
        return null
    }
}

app.post('/api/persons', (request, response) => {
    const person = request.body

    const validationError = validatePerson(person)

    if (validationError) {
        return response.status(400).json(validationError)
    } else {
        person.id = generatePersonId()
        persons = persons.concat(person)
        response.json(person)
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})