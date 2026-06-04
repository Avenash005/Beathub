const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true  // Add index for faster login queries
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Export User model
module.exports = mongoose.model('User', userSchema);
