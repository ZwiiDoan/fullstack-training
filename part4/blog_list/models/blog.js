const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
  },
  url: {
    type: String,
    validate: {
      validator: (v) => {
        return /^https?:\/\//.test(v)
      },
      message: 'URL must start with http or https',
    },
    required: [true, 'URL is required'],
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative'],
  },
})

blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)