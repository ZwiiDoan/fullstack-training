const logger = require('../utils/logger')

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  switch (error.name) {
  case 'CastError':
  case 'ValidationError':
  case 'DuplicateUserError':
  case 'MissingUserIdError':
    response.status(400).json({ message: error.message || 'Malformed input data' })
    break
  case 'UserNotFoundError':
  case 'BlogNotFoundError':
    response.status(404).json({ message: error.message })
    break
  case 'AuthenticationError':
    response.status(401).json({ message: error.message })
    break
  case 'AuthorizationError':
    response.status(403).json({ message: error.message })
    break
  default:
    logger.error(error)
    response.status(500).json({ message: 'Internal Server Error' })
    break
  }
}


module.exports = errorHandler