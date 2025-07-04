const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const userModel = require('../models/user')
const blogModel = require('../models/blog')
const requestValidator = require('../middleware/requestValidator')

userRouter.post('/', async (request, response, next) => {
  try {
    await requestValidator.validateUser(userModel, blogModel, request.body)
    const { username, name, password } = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new userModel({ username, name, passwordHash })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

userRouter.get('/', async (request, response, next) => {
  try {
    const users = await userModel.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

module.exports = userRouter
