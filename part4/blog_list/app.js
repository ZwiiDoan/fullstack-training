const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./routers/blog')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const unknownEndpoint = require('./middleware/unknownEndpoint')
const errorHandler = require('./middleware/errorHandler')
const customMorgan = require('./middleware/customMorgan')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
// app.use(express.static('dist'))
app.use(express.json())
app.use(customMorgan)

app.use('/api/blogs', blogRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app