const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('Login API', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await require('bcrypt').hash('password123', 10)
    await new User({ username: 'testuser', name: 'Test User', passwordHash }).save()
  })

  test('succeeds with valid credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'password123' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.ok(response.body.token, 'Token should be returned')
    assert.strictEqual(response.body.username, 'testuser')
    assert.strictEqual(response.body.name, 'Test User')
  })

  test('fails with status 401 for invalid password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(401)
  })

  test('fails with status 401 for non-existent user', async () => {
    await api
      .post('/api/login')
      .send({ username: 'nouser', password: 'password123' })
      .expect(401)
  })

  test('fails with status 400 for missing username', async () => {
    await api
      .post('/api/login')
      .send({ password: 'password123' })
      .expect(400)
  })

  test('fails with status 400 for missing password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'testuser' })
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
