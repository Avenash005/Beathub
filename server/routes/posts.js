const express = require('express');
const router = express.Router();

// In-memory posts storage (replace with MongoDB in production)
let posts = [];
let postIdCounter = 1;

// Create posts router that accepts io as parameter
module.exports = function(io) {
  // POST /api/posts - Create a new post
  router.post('/posts', (req, res) => {
    const { title, content, author, coverImage } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    // Create new post
    const newPost = {
      id: postIdCounter++,
      title,
      content,
      author: author || 'Anonymous',
      coverImage: coverImage || null,
      createdAt: new Date().toISOString()
    };
    
    // Save post to memory
    posts.push(newPost);
    
    // Emit newPost event to all connected clients
    io.emit('newPost', {
      message: `New post created by ${newPost.author}!`,
      post: newPost
    });
    
    console.log('Post created and newPost event emitted:', newPost.title);
    
    // Return the created post
    res.status(201).json(newPost);
  });
  
  // GET /api/posts - Get all posts
  router.get('/posts', (req, res) => {
    res.json(posts);
  });
  
  return router;
};
