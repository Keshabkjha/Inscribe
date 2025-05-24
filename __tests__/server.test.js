const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server');
const io = require('socket.io-client');

let mongoServer;
let clientSocket;

beforeAll(async () => {
  // Start an in-memory MongoDB server for testing
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Override the MONGODB_URI for testing
  process.env.MONGODB_URI = mongoUri;
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect from the in-memory database and stop it
  if (clientSocket) {
    clientSocket.disconnect();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('HTTP Server', () => {
  it('should respond with 200 for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('should respond with 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.statusCode).toBe(404);
  });

  it('should serve static files from the public directory', async () => {
    const response = await request(app).get('/index.html');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
  });
});

describe('WebSocket Server', () => {
  beforeEach((done) => {
    // Connect to the WebSocket server
    clientSocket = io('http://localhost:3000', {
      transports: ['websocket'],
      forceNew: true,
      reconnection: false
    });
    
    clientSocket.on('connect', () => {
      done();
    });
    
    clientSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      done(err);
    });
  });
  
  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });
  
  it('should connect to the WebSocket server', (done) => {
    expect(clientSocket.connected).toBe(true);
    done();
  });
  
  it('should receive a welcome message on connection', (done) => {
    clientSocket.on('welcome', (message) => {
      expect(message).toBeDefined();
      expect(typeof message).toBe('string');
      done();
    });
  });
});
