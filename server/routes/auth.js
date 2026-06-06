const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory users storage (fallback when MongoDB is not available)
let users = [];
let userIdCounter = 1;

// Import User model
const User = require('../models/User');

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email and password are required' 
    });
  }
  
  try {
    // Check if MongoDB is connected
    if (User.db && User.db.readyState === 1) {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: 'User already exists' 
        });
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword
      });
      
      await newUser.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      });
    } else {
      // MongoDB not available - use in-memory storage
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: 'User already exists' 
        });
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new user
      const newUser = {
        id: userIdCounter++,
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      });
    }
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to register user' 
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
  
  try {
    // Check if MongoDB is connected
    if (User.db && User.db.readyState === 1) {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
      
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(200).json({
        success: true,
        token
      });
    } else {
      // MongoDB not available - use in-memory storage
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
      
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(200).json({
        success: true,
        token
      });
    }
  } catch (err) {
    console.error('Error logging in user:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to login' 
    });
  }
});

// Helper function to clear users (for testing)
router.clearUsers = () => {
  users = [];
  userIdCounter = 1;
};

// Helper function to get users (for testing)
router.getUsers = () => users;

module.exports = router;
