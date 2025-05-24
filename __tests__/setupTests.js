// Global test setup
process.env.NODE_ENV = 'test';
process.env.PORT = '0';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

// Mock console methods to keep test output clean
const originalConsole = { ...console };

global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn((...args) => {
    // Log actual errors to help with debugging
    if (args[0]?.includes('error') || args[0]?.includes('Error')) {
      originalConsole.error('Test Error:', ...args);
    }
  }),
};

// Increase timeout for tests that need more time (like database operations)
jest.setTimeout(30000);

// Mock mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(actualMongoose),
    connection: {
      ...actualMongoose.connection,
      close: jest.fn().mockResolvedValue(undefined),
    },
  };
});

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    connected: true,
    disconnect: jest.fn(),
    on: jest.fn(),
    emit: jest.fn(),
    close: jest.fn(),
  })),
  io: jest.fn(() => ({
    connected: true,
    disconnect: jest.fn(),
    on: jest.fn(),
    emit: jest.fn(),
    close: jest.fn(),
  })),
}));
