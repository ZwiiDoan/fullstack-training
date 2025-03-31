const morgan = require('morgan')

morgan.token('request-body', function (req) {
  return JSON.stringify(req.body)
})

const customMorganFormat = ':method :url :status :res[content-length] - :response-time ms :request-body'
morgan.format('customMorganFormat', customMorganFormat)

module.exports = morgan('customMorganFormat')