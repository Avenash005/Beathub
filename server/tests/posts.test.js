const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { app } = require('../app');

// Import models
const User = require('../models/User');
const Post = require('../models/Post');

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Test database URI
const MONGODB_URI_TEST = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/creators-platform-test';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate a test token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

describe('Posts Routes', () => {
  let testUser;
  let testToken;

  // Connect to test database before all tests
  beforeAll(async () => {
    try {
      await mongoose.connect(MONGODB_URI_TEST);
      console.log('Connected to test database');
    } catch (err) {
      console.log('Test DB connection failed, using in-memory storage');
    }
  });

  // Create a test user and get token before each test
  beforeEach(async () => {
    try {
      // Create a test user
      const user = await User.create({
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'password123'
      });
      testUser = user;
      testToken = generateToken(user);
    } catch (err) {
      // If DB not connected, create in-memory user
      testToken = jwt.sign(
        { id: 1, email: 'test@example.com', name: 'Test User' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
    }
  });

  // Clear collections after each test
  afterEach(async () => {
    try {
      if (Post.db && Post.db.readyState === 1) {
        await Post.deleteMany({});
      }
      if (User.db && User.db.readyState === 1 && testUser) {
        await User.deleteMany({});
      }
    } catch (err) {
      // Ignore cleanup errors
    }
  });

  // Close database connection after all tests
  afterAll(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
      }
    } catch (err) {
      console.log('Error closing DB connection:', err);
    }
  });

  describe('GET /api/posts', () => {
    test('should get all posts successfully', async () => {
      const res = await request(app)
        .get('/api/posts');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    test('should return empty array when no posts exist', async () => {
      const res = await request(app)
        .get('/api/posts');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('POST /api/posts', () => {
    test('should create a new post successfully', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post',
          content: 'This is test content',
          author: testUser ? testUser.name : 'Test User'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Post');
      expect(res.body).toHaveProperty('content', 'This is test content');
    });

    test('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          content: 'This is test content'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should return 400 when content is missing', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should return 201 when only title and content are provided', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Minimal Post',
          content: 'Minimal content'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'Minimal Post');
    });
  });
});
