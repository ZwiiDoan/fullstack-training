require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SECRET = process.env.SECRET || 'AppSecret' // Default to AppSecret if not set
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '1h' // Default to 1 hour if not set

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  TOKEN_EXPIRES_IN
}