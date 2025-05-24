// Setup file for Jest tests
process.env.NODE_ENV = 'test';
process.env.PORT = 5000;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inscribe-test';

// Mock console methods to keep test output clean
const originalConsole = { ...console };

global.console = {
  ...originalConsole,
  // Override console methods to suppress output during tests
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

// Mock Socket.IO client for testing
class MockSocket {
  constructor() {
    this.id = 'test-socket-id';
    this.emit = jest.fn();
    this.on = jest.fn();
    this.disconnect = jest.fn();
  }
}

global.MockSocket = MockSocket;
