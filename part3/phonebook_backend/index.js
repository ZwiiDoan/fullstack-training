require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const ApiError = require('./errors/apiError')
const { validatePerson } = require('./validators/personValidator')
const customMorgan = require('./middlewares/customMorgan')
const personModel = require('./models/person')
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = require('./errors/errorHandler')

const PORT = process.env.PORT || 3001

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(customMorgan)

app.get('/info', (request, response, next) => {
  personModel.find({}).then((result) => {
    response.send(`
            <p>Phonebook has info for ${result.length} people</p>
            <p>${new Date().toString()}</p>
        `)
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  personModel.find({}).then((result) => {
    response.send(result)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  personModel.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      next(new ApiError('Person not found', 404))
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body

  const validationError = validatePerson(person)

  if (validationError) {
    next(validationError)
  } else {
    personModel.findOne({ name: person.name }).then(
      existingPerson => {
        if (existingPerson) {
          next(new ApiError('Name must be unique', 400))
        } else {
          new personModel({
            name: person.name,
            number: person.number,
          }).save().then(savedPerson => {
            response.json(savedPerson)
          }).catch(error => next(error))
        }
      }
    )
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = request.body

  const validationError = validatePerson(person)

  if (validationError) {
    next(validationError)
  } else {
    personModel.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        if (updatedPerson) {
          response.json(updatedPerson)
        } else {
          next(new ApiError('Person not found', 404))
        }
      }).catch(error => next(error))
  }
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  personModel.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))
})

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})