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
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', personSchema)