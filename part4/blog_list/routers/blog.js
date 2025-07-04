const blogRouter = require('express').Router()
const blogModel = require('../models/blog')
const userModel = require('../models/user')
const requestValidator = require('../middleware/requestValidator')
const userExtractor = require('../middleware/userExtractor')
const { AuthorizationError } = require('../errors/errors')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await blogModel.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    await requestValidator.validateBlog(userModel, { ...request.body, user: request.user._id })
    const { ...blogData } = request.body
    const blog = new blogModel({ ...blogData, user: request.user._id })
    const result = await blog.save()
    request.user.blogs = request.user.blogs.concat(result._id)
    await request.user.save()
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    await requestValidator.validateBlogExist(blogModel, request.params.id)
    const blog = await blogModel.findById(request.params.id)
    if (!blog.user.equals(request.user._id)) {
      throw new AuthorizationError('Forbidden: not the blog owner')
    }
    const user = await userModel.findById(blog.user)
    if (user) {
      user.blogs = user.blogs.filter(bid => bid.toString() !== blog._id.toString())
      await user.save()
    }
    await blogModel.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', userExtractor, async (request, response, next) => {
  try {
    await requestValidator.validateBlogExist(blogModel, request.params.id)
    const blog = await blogModel.findById(request.params.id)
    if (!blog.user.equals(request.user._id)) {
      throw new AuthorizationError('Forbidden: not the blog owner')
    }
    const user = await requestValidator.validateBlog(userModel, { ...request.body, user: request.user._id })
    const { ...blogData } = request.body
    const updatedBlog = await blogModel.findByIdAndUpdate(
      request.params.id,
      { ...blogData, user: user._id },
      { new: true, runValidators: true, context: 'query' }
    )
    if (user && !user.blogs.includes(updatedBlog._id)) {
      user.blogs = user.blogs.concat(updatedBlog._id)
      await user.save()
    }
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter