const logger = require('./utils/logger')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  logger.info('Usage: node mongo.js {password} [{name} {number}]')
  process.exit(1)
}

const dbPassword = process.argv[2]
const dbUrl = `mongodb+srv://fullstack:${dbPassword}@cluster0.3g16j.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(dbUrl).then(() => {
  logger.info('db connection established')
  main()
}).catch(error => {
  logger.error('error connecting to MongoDB:', error.message)
})

const main = () => {
  if (process.argv.length === 3) {
    logger.info('phonebook:')
    Person.find({}).then(result => {
      result.forEach(person => logger.info(person))
      mongoose.connection.close().then(() => logger.info('db connection closed'))
    })
  } else if (process.argv.length === 5) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    person.save().then(() => {
      logger.info(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close().then(() => logger.info('db connection closed'))
    })
  }
}