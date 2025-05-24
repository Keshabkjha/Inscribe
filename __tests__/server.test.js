const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const io = require('socket.io-client');

// Mock the server's socket.io instance
jest.mock('socket.io', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn((event, callback) => {
      if (event === 'connection') {
        // Simulate a new connection with a mock socket
        const mockSocket = {
          id: 'test-socket-id',
          handshake: { address: '127.0.0.1' },
          disconnect: jest.fn(),
          on: jest.fn(),
          emit: jest.fn()
        };
        callback(mockSocket);
      }
      return this;
    }),
    close: jest.fn()
  }));
});

// Mock the User model
jest.mock('../models/User', () => ({
  findOne: jest.fn().mockResolvedValue(null),
  find: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockImplementation((user) => Promise.resolve({ ...user, save: jest.fn() })),
  updateOne: jest.fn().mockResolvedValue({})
}));

// Mock the Drawing model
jest.mock('../models/Drawing', () => ({
  find: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockImplementation((drawing) => Promise.resolve(drawing)),
  deleteMany: jest.fn().mockResolvedValue({})
}));

describe('HTTP Server', () => {
  beforeAll(() => {
    // Start the server before tests
    return new Promise((resolve) => {
      server.listen(0, () => {
        process.env.PORT = server.address().port;
        resolve();
      });
    });
  });

  afterAll((done) => {
    // Close the server after tests
    server.close(done);
  });

  it('should respond with 200 for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('should respond with 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.statusCode).toBe(404);
  });

  it('should respond with 200 for GET /api/health', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});

describe('WebSocket Server', () => {
  let clientSocket;
  
  beforeAll((done) => {
    // Start the server
    server.listen(0, () => {
      const port = server.address().port;
      // Connect to the WebSocket server
      clientSocket = io(`http://localhost:${port}`, {
        transports: ['websocket'],
        forceNew: true,
        reconnection: false
      });
      
      clientSocket.on('connect', () => {
        done();
      });
    });
  });
  
  afterAll(() => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
    server.close();
  });
  
  it('should connect to the WebSocket server', () => {
    expect(clientSocket.connected).toBe(true);
  });
  
  it('should handle chat messages', (done) => {
    const testMessage = { text: 'Hello, world!', user: 'test-user' };
    
    clientSocket.emit('chat message', testMessage);
    
    // The server should broadcast the message back
    clientSocket.on('chat message', (message) => {
      expect(message).toMatchObject(testMessage);
      done();
    });
  });
});
