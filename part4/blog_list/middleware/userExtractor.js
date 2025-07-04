const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const userModel = require('../models/user')
const { AuthenticationError } = require('../errors/errors')

const userExtractor = async (request, response, next) => {
  try {
    const authorization = request.get('authorization')
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      throw new AuthenticationError('token missing or invalid')
    }
    const token = authorization.substring(7)
    let decodedToken
    try {
      decodedToken = jwt.verify(token, config.SECRET)
    } catch (_error) { //eslint-disable-line no-unused-vars
      throw new AuthenticationError('token invalid')
    }
    if (!decodedToken.id) {
      throw new AuthenticationError('token invalid')
    }
    const user = await userModel.findById(decodedToken.id)
    if (!user) {
      throw new AuthenticationError('user not found')
    }
    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = userExtractor
