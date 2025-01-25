if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Usage: node mongo.js {password} [{name} {number}]')
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
  console.log('db connection established')
  main()
})

const main = () => {
  if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
      result.forEach(person => console.log(person))
      mongoose.connection.close().then(() => console.log('db connection closed'))
    })
  } else if (process.argv.length === 5) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    person.save().then(() => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close().then(() => console.log('db connection closed'))
    })
  }
}