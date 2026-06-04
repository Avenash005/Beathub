const express = require('express');
const router = express.Router();

// In-memory posts storage (fallback when MongoDB is not available)
let posts = [];
let postIdCounter = 1;

// Import Post model
const Post = require('../models/Post');

// Create posts router that accepts io as parameter
module.exports = function(io) {
  // POST /api/posts - Create a new post
  router.post('/posts', async (req, res) => {
    const { title, content, author, coverImage } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    try {
      // Check if MongoDB is connected by trying to use the Post model
      if (Post.db && Post.db.readyState === 1) {
        // MongoDB is available - use Mongoose to save
        const newPost = new Post({
          title,
          content,
          author: author || 'Anonymous',
          coverImage: coverImage || null
        });
        
        await newPost.save();
        
        // Emit newPost event to all connected clients
        io.emit('newPost', {
          message: `New post created by ${newPost.author}!`,
          post: newPost
        });
        
        console.log('Post created in MongoDB and newPost event emitted:', newPost.title);
        
        // Return the created post
        return res.status(201).json(newPost);
      } else {
        // MongoDB not available - use in-memory storage
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
        
        console.log('Post created in memory and newPost event emitted:', newPost.title);
        
        // Return the created post
        return res.status(201).json(newPost);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  });
  
  // GET /api/posts - Get all posts
  router.get('/posts', async (req, res) => {
    try {
      // Check if MongoDB is connected
      if (Post.db && Post.db.readyState === 1) {
        // MongoDB is available - fetch from database
        const posts = await Post.find().sort({ createdAt: -1 });
        return res.json(posts);
      } else {
        // MongoDB not available - return in-memory posts
        return res.json(posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      return res.json(posts);
    }
  });
  
  return router;
};
