const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const dbUrl = process.env.DB_URL

console.log('Connecting to DB')

mongoose.connect(dbUrl).then(() => {
  console.log('DB connection established')
}).catch(error => {
  console.log('Failed to connect to DB:', error.message)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name is required'],
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (value) {
        return /\d{2,3}-\d+/.test(value)
      },
      message: props => `${props.value} is not a valid phone number`,
    },
    required: [true, 'Phone number is required'],
  },
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Person', personSchema)