const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
  })

  test('creates a new user with valid data', async () => {
    const newUser = {
      username: 'testuser2',
      name: 'Test User',
      password: 'password123'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, newUser.username)
    assert.strictEqual(response.body.name, newUser.name)
    assert.ok(!response.body.passwordHash)
  })

  test('fails with status 400 if username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'password123'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('fails with status 400 if password is too short', async () => {
    const newUser = {
      username: 'shortpw',
      name: 'Short Password',
      password: 'pw'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('fails with status 400 if username is not unique', async () => {
    const existingUser = new User({
      username: 'duplicate',
      name: 'Existing User',
      passwordHash: 'password123',
      blogs: []
    })
    await existingUser.save()

    const duplicateUser = {
      username: 'duplicate',
      name: 'Duplicate User',
      password: 'password123'
    }
    await api.post('/api/users').send(duplicateUser)
    await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
  })

  test('get all users returns users with their blogs', async () => {
    // Create user and blog directly in the database
    const user = new User({
      username: 'userwithblog',
      name: 'User With Blog',
      passwordHash: 'hashedpassword',
      blogs: []
    })
    const savedUser = await user.save()
    const blog = new Blog({
      title: 'Blog by user',
      author: 'User With Blog',
      url: 'http://example.com/user-blog',
      likes: 5,
      user: savedUser._id
    })
    const savedBlog = await blog.save()
    await User.findByIdAndUpdate(savedUser._id, { blogs: [savedBlog._id] })

    // Get all users
    const response = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
    const users = response.body
    // Find the user we just created
    const foundUser = users.find(u => u.username === 'userwithblog')
    assert.ok(foundUser, 'User should be present in response')
    assert.ok(Array.isArray(foundUser.blogs), 'User blogs should be an array')
    assert.ok(foundUser.blogs.length > 0, 'User should have at least one blog')
    const foundBlog = foundUser.blogs[0]
    assert.strictEqual(foundBlog.title, 'Blog by user')
    assert.strictEqual(foundBlog.author, 'User With Blog')
    assert.strictEqual(foundBlog.url, 'http://example.com/user-blog')
    assert.strictEqual(foundBlog.likes, 5)
  })
})

after(async () => {
  await mongoose.connection.close()
})