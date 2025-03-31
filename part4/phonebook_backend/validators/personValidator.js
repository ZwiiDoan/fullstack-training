const ApiError = require('../errors/apiError')

const validatePerson = (person) => {
  if (!person) {
    return new ApiError('Request body must not be empty', 400)
  } else if (!person.name) {
    return new ApiError('Name must not be empty', 400)
  } else if (!person.number) {
    return new ApiError('Number must not be empty', 400)
  } else {
    return null
  }
}

module.exports = { validatePerson }