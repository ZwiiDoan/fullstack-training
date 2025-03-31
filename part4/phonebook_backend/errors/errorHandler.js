const errorHandler = (error, request, response, next) => {
  switch (error.name) {
  case 'CastError':
    return response.status(400).send({ message: 'Malformed input data' })
  case 'ApiError':
    response.status(error.statusCode).json({
      message: error.message
    })
    break
  case 'ValidationError':
    response.status(400).send({ message: error.message })
    break
  default:
    response.status(500).json({
      message: 'Internal Server Error'
    })
    break
  }
}

module.exports = errorHandler