const { ValidationError, DuplicateUserError, MissingUserIdError, UserNotFoundError, BlogNotFoundError } = require('../errors/errors')

const validateBlog = async (userModel, blog) => {
  if (!blog) {
    throw new ValidationError('Request body must not be empty')
  } else if (!blog.title) {
    throw new ValidationError('Title must not be empty')
  } else if (!blog.url) {
    throw new ValidationError('URL must not be empty')
  } else if (!blog.user) {
    throw new MissingUserIdError()
  }
  const user = await userModel.findById(blog.user)
  if (!user) {
    throw new UserNotFoundError()
  }
  return user
}

const validateBlogsExist = async (blogModel, blogIds) => {
  for (const blogId of blogIds) {
    if (typeof blogId !== 'string') {
      throw new ValidationError('Each blog id must be a string')
    }
    const exists = await blogModel.exists({ _id: blogId })
    if (!exists) {
      throw new BlogNotFoundError(`Blog with id ${blogId} does not exist`)
    }
  }
}

const validateUser = async (userModel, blogModel, user) => {
  if (!user) {
    throw new ValidationError('Request body must not be empty')
  } else if (!user.username) {
    throw new ValidationError('Username must not be empty')
  } else if (!user.password || user.password.length < 3) {
    throw new ValidationError('Password must be at least 3 characters long')
  }
  if (user.blogs !== undefined) {
    if (!Array.isArray(user.blogs)) {
      throw new ValidationError('Blogs must be an array')
    }
    await validateBlogsExist(blogModel, user.blogs)
  }
  const existingUser = await userModel.findOne({ username: user.username })
  if (existingUser) {
    throw new DuplicateUserError('Username must be unique')
  }
}

const validateBlogExist = async (blogModel, blogId) => {
  if (typeof blogId !== 'string') {
    throw new ValidationError('Blog id must be a string')
  }
  const exists = await blogModel.exists({ _id: blogId })
  if (!exists) {
    throw new BlogNotFoundError(`Blog with id ${blogId} does not exist`)
  }
}

const validateUserExist = async (userModel, userId) => {
  if (typeof userId !== 'string') {
    throw new ValidationError('User id must be a string')
  }
  const exists = await userModel.exists({ _id: userId })
  if (!exists) {
    throw new UserNotFoundError(`User with id ${userId} does not exist`)
  }
}

const validateLogin = (body) => {
  if (!body) {
    throw new ValidationError('Request body must not be empty')
  } else if (!body.username) {
    throw new ValidationError('Username must not be empty')
  } else if (!body.password) {
    throw new ValidationError('Password must not be empty')
  }
}

module.exports = { validateBlog, validateUser, validateBlogExist, validateUserExist, validateLogin }
