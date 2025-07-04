const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { validateLogin } = require('../middleware/requestValidator')
const config = require('../utils/config')
const { AuthenticationError } = require('../errors/errors')

loginRouter.post('/', async (request, response, next) => {
  try {
    await validateLogin(request.body)
    const { username, password } = request.body
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      throw new AuthenticationError('invalid username or password')
    }

    const userForToken = {
      username: user.username,
      id: user._id.toString(),
    }

    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: config.TOKEN_EXPIRES_IN })

    response.status(200).json({
      token,
      username: user.username,
      name: user.name
    })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
