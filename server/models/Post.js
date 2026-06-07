const mongoose = require('mongoose');

// Post Schema - includes coverImage field for storing Cloudinary URL
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Anonymous'
  },
  // Cover image from Cloudinary - optional, allows text-only posts
  coverImage: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Export Post model
module.exports = mongoose.model('Post', postSchema);
