const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  }, blogs[0])

  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs) => {
  const counts = Object.create(null) // Plain object without prototype

  let topAuthor = ''
  let topCount = 0

  for (const { author } of blogs) {
    const count = (counts[author] = (counts[author] || 0) + 1)

    if (count > topCount) {
      topAuthor = author
      topCount = count
    }
  }

  return Object.freeze({ author: topAuthor, count: topCount })
}

const mostLikes = (blogs) => {
  const likesCounts = Object.create(null) // Plain object without prototype

  let topAuthor = ''
  let topLikes = 0

  for (const { author, likes } of blogs) {
    const authorLikes = (likesCounts[author] = (likesCounts[author] || 0) + likes)

    if (authorLikes > topLikes) {
      topAuthor = author
      topLikes = authorLikes
    }
  }

  return Object.freeze({ author: topAuthor, likes: topLikes })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}