const ApiError = require('../errors/apiError');

const validatePerson = (person) => {
    if (!person) {
        return new ApiError('request body must not be empty', 400)
    } else if (!person.name) {
        return new ApiError('name must not be empty', 400)
    } else if (!person.number) {
        return new ApiError('number must not be empty', 400)
    } else {
        return null
    }
}

module.exports = {validatePerson};