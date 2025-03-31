const personRouter = require('express').Router()
const personModel = require('../models/person')
const ApiError = require('../errors/apiError')
const modelValidator = require('../middleware/modelValidator')

personRouter.get('/info', (request, response, next) => {
  personModel.find({}).then((result) => {
    response.send(`
              <p>Phonebook has info for ${result.length} people</p>
              <p>${new Date().toString()}</p>
          `)
  }).catch(error => next(error))
})

personRouter.get('/', (request, response, next) => {
  personModel.find({}).then((result) => {
    response.send(result)
  }).catch(error => next(error))
})

personRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  personModel.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      next(new ApiError('Person not found', 404))
    }
  }).catch(error => next(error))
})

personRouter.post('/', (request, response, next) => {
  const person = request.body

  const validationError = modelValidator.validatePerson(person)

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

personRouter.put('/:id', (request, response, next) => {
  const person = request.body

  const validationError = modelValidator.validatePerson(person)

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

personRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  personModel.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))
})

module.exports = personRouter