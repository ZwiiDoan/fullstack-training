class MissingUserIdError extends Error {
  constructor(message = 'User id is required') {
    super(message)
    this.name = 'MissingUserIdError'
    this.status = 400
  }
}

class UserNotFoundError extends Error {
  constructor(message = 'User not found') {
    super(message)
    this.name = 'UserNotFoundError'
    this.status = 400
  }
}

class BlogNotFoundError extends Error {
  constructor(message = 'Blog not found') {
    super(message)
    this.name = 'BlogNotFoundError'
    this.status = 404
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
    this.status = 400
  }
}

class DuplicateUserError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DuplicateUserError'
    this.status = 400
  }
}

class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message)
    this.name = 'AuthenticationError'
    this.status = 401
  }
}

class AuthorizationError extends Error {
  constructor(message = 'Forbidden') {
    super(message)
    this.name = 'AuthorizationError'
    this.status = 403
  }
}

module.exports = {
  MissingUserIdError,
  UserNotFoundError,
  BlogNotFoundError,
  ValidationError,
  DuplicateUserError,
  AuthenticationError,
  AuthorizationError,
}
