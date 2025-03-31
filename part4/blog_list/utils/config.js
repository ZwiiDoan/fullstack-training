require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.DB_URL

module.exports = {
  MONGODB_URI,
  PORT
}