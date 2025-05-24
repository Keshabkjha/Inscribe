/* eslint-env jest */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Mock the logger to avoid logging during tests
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('Server', () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inscribe-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Close the database connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /', () => {
    it('should return 200 and a welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Welcome to Inscribe API');
    });
  });
});
