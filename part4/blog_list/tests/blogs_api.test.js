const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogModel = require('../models/blog')

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

beforeEach(async () => {
  await blogModel.deleteMany({})
  await blogModel.insertMany(initialBlogs)
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
  const newBlog = {
    title: 'Async/Await in Node.js',
    author: 'Jane Doe',
    url: 'http://example.com/async-await',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await blogModel.find({})
  assert.strictEqual(blogsAtEnd.length, 7)
  const titles = blogsAtEnd.map(b => b.title)
  assert.ok(titles.includes('Async/Await in Node.js'))
})

test('if likes property is missing from request, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog with no likes',
    author: 'No Likes Author',
    url: 'http://example.com/no-likes'
  }

  const response = await api
    .post('/api/blogs')
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
    .expect(204)

  const blogsAtEnd = await blogModel.find({})
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  const ids = blogsAtEnd.map(b => b.id)
  assert.ok(!ids.includes(blogToDelete.id))
})

test('deleting a non-existing blog returns 404', async () => {
  const nonExistingId = new mongoose.Types.ObjectId()
  await api
    .delete(`/api/blogs/${nonExistingId}`)
    .expect(404)
})

test('the number of likes of a blog can be updated', async () => {
  const blogsAtStart = await blogModel.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedData = { ...blogToUpdate.toJSON(), likes: blogToUpdate.likes + 1 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

  const blogInDb = await blogModel.findById(blogToUpdate.id)
  assert.strictEqual(blogInDb.likes, blogToUpdate.likes + 1)
})

test('updating a non-existing blog returns 404', async () => {
  const nonExistingId = new mongoose.Types.ObjectId()
  await api
    .put(`/api/blogs/${nonExistingId}`)
    .send({ likes: 100 })
    .expect(404)
})

after(async () => {
  await mongoose.connection.close()
})