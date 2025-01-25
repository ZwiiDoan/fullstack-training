const errorHandler = (error, request, response, next) => {
    console.log('error handler caught: ', error)

    if (error.name === 'CastError') {
        return response.status(400).send({ message: 'Malformed input data' })
    } else if (error.name === 'ApiError') {
        response.status(error.statusCode).json({
            message: error.message
        });
    } else {
        response.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

module.exports = errorHandler