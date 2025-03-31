const ApiError = require('../errors/apiError')

const validateBlog = (blog) => {
  if (!blog) {
    return new ApiError('Request body must not be empty', 400)
  } else if (!blog.title) {
    return new ApiError('Title must not be empty', 400)
  } else if (!blog.url) {
    return new ApiError('URL must not be empty', 400)
  } else {
    return null
  }
}

module.exports = { validateBlog }