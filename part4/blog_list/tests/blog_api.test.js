const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogModel = require('../models/blog')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

describe('Blog API', () => {
  let authToken

  beforeEach(async () => {
    await blogModel.deleteMany({})
    await userModel.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = await userModel.create({
      username: 'testuser1',
      name: 'Test User',
      passwordHash,
      blogs: []
    })

    const blogsWithUser = initialBlogs.map(blog => ({ ...blog, user: user._id }))
    const createdBlogs = await blogModel.insertMany(blogsWithUser)
    await userModel.findByIdAndUpdate(user._id, { blogs: createdBlogs.map(b => b._id) })

    const loginRes = await api.post('/api/login').send({ username: 'testuser1', password: 'sekret' })
    authToken = loginRes.body.token
  })

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 6)
    assert.strictEqual(response.body[0].title, 'React patterns')
    assert.strictEqual(response.body[1].title, 'Go To Statement Considered Harmful')
  })

  test('unique identifier property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok(blog.id, 'Blog should have an id property')
      assert.strictEqual(blog._id, undefined, 'Blog should not have an _id property')
    })
  })

  test('a valid blog can be added', async () => {
    const users = await userModel.find({})
    const userId = users[0]._id
    const newBlog = {
      title: 'Async/Await in Node.js',
      author: 'Jane Doe',
      url: 'http://example.com/async-await',
      likes: 3
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogModel.find({})
    assert.strictEqual(blogsAtEnd.length > 6, true)
    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Async/Await in Node.js'))
    const user = await userModel.findById(userId).populate('blogs')
    assert.ok(user.blogs.some(b => b.title === 'Async/Await in Node.js'))
  })

  test('if likes property is missing from request, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog with no likes',
      author: 'No Likes Author',
      url: 'http://example.com/no-likes'
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)

    const blogInDb = await blogModel.findOne({ title: 'Blog with no likes' })
    assert.ok(blogInDb)
    assert.strictEqual(blogInDb.likes, 0)
  })

  test('blog without title is not added and returns 400', async () => {
    const newBlog = {
      author: 'No Title Author',
      url: 'http://example.com/no-title',
      likes: 1
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await blogModel.find({})
    assert.strictEqual(blogsAtEnd.length, 6)
  })

  test('blog without url is not added and returns 400', async () => {
    const newBlog = {
      title: 'No URL Blog',
      author: 'No URL Author',
      likes: 1
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await blogModel.find({})
    assert.strictEqual(blogsAtEnd.length, 6)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await blogModel.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)

    const blogsAtEnd = await blogModel.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    const ids = blogsAtEnd.map(b => b.id)
    assert.ok(!ids.includes(blogToDelete.id))
  })

  test('a blog can be deleted by its owner', async () => {
    const blogsAtStart = await blogModel.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)

    const blogsAtEnd = await blogModel.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    const ids = blogsAtEnd.map(b => b.id)
    assert.ok(!ids.includes(blogToDelete.id))
  })

  test('a blog cannot be deleted by a different user', async () => {
    // Create a second user and login
    const bcrypt = require('bcrypt')
    const passwordHash = await bcrypt.hash('otherpass', 10)
    await userModel.create({
      username: 'otheruser',
      name: 'Other User',
      passwordHash,
      blogs: []
    })
    const loginRes = await api.post('/api/login').send({ username: 'otheruser', password: 'otherpass' })
    const otherToken = loginRes.body.token

    const blogsAtStart = await blogModel.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403)

    const blogsAtEnd = await blogModel.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('deleting a non-existing blog returns 404', async () => {
    const nonExistingId = new mongoose.Types.ObjectId()
    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  })

  test('a blog can be updated by its owner', async () => {
    const blogsAtStart = await blogModel.find({})
    const blogToUpdate = blogsAtStart[0]
    const updatedData = { ...blogToUpdate.toJSON(), likes: blogToUpdate.likes + 1 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    const blogInDb = await blogModel.findById(blogToUpdate.id)
    assert.strictEqual(blogInDb.likes, blogToUpdate.likes + 1)
  })

  test('a blog cannot be updated by a different user', async () => {
    // Create a second user and login
    const bcrypt = require('bcrypt')
    const passwordHash = await bcrypt.hash('otherpass', 10)
    await userModel.create({
      username: 'otheruser',
      name: 'Other User',
      passwordHash,
      blogs: []
    })
    const loginRes = await api.post('/api/login').send({ username: 'otheruser', password: 'otherpass' })
    const otherToken = loginRes.body.token

    const blogsAtStart = await blogModel.find({})
    const blogToUpdate = blogsAtStart[0]
    const updatedData = { ...blogToUpdate.toJSON(), likes: blogToUpdate.likes + 2 }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send(updatedData)
      .expect(403)

    const blogInDb = await blogModel.findById(blogToUpdate.id)
    assert.strictEqual(blogInDb.likes, blogToUpdate.likes)
  })

  test('updating a non-existing blog returns 404', async () => {
    const nonExistingId = new mongoose.Types.ObjectId()
    await api
      .put(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ likes: 100 })
      .expect(404)
  })

  test('blogs are returned as json and include user info', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 6)
    assert.strictEqual(response.body[0].title, 'React patterns')
    assert.strictEqual(response.body[1].title, 'Go To Statement Considered Harmful')
    // Check that user is populated with exact username and name
    response.body.forEach(blog => {
      assert.ok(blog.user, 'Blog should have a user field')
      assert.strictEqual(blog.user.username, 'testuser1', 'User should have correct username')
      assert.strictEqual(blog.user.name, 'Test User', 'User should have correct name')
      assert.strictEqual(Object.keys(blog.user).includes('passwordHash'), false, 'User should not have passwordHash')
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})