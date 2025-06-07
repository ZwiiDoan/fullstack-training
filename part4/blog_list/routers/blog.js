const blogRouter = require('express').Router()
const blogModel = require('../models/blog')
const modelValidator = require('../middleware/modelValidator')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await blogModel.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request, response, next) => {
  const blog = new blogModel(request.body)

  const validationError = modelValidator.validateBlog(blog)

  if (validationError) {
    next(validationError)
  } else {
    try {
      const result = await blog.save()
      response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const deletedBlog = await blogModel.findByIdAndDelete(request.params.id)
    if (deletedBlog) {
      response.status(204).end()
    } else {
      response.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true, context: 'query' }
    )
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter