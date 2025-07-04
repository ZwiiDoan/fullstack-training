const logger = require('../utils/logger')

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  switch (error.name) {
  case 'CastError':
    response.status(400).json({ message: 'Malformed input data' })
    break
  case 'ValidationError':
    response.status(400).json({ message: error.message })
    break
  case 'ApiError':
    response.status(error.statusCode).json({ message: error.message })
    break
  default:
    logger.error(error)
    response.status(500).json({ message: 'Internal Server Error' })
    break
  }
}


module.exports = errorHandler