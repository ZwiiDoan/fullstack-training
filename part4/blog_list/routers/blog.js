const blogRouter = require('express').Router()
const blogModel = require('../models/blog')
const modelValidator = require('../middleware/modelValidator')

blogRouter.get('/', (request, response, next) => {
  blogModel
    .find({})
    .then(blogs => {
      response.json(blogs)
    }).catch(error => next(error))
})

blogRouter.post('/', (request, response, next) => {
  const blog = new blogModel(request.body)

  const validationError = modelValidator.validateBlog(blog)

  if (validationError) {
    next(validationError)
  } else {
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(error => next(error))
  }
})

module.exports = blogRouter