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
  const mockModels = new Map();

  const createMockModel = (name) => {
    const MockModel = class {
      constructor(data) {
        Object.assign(this, data);
      }
    };

    MockModel.findOne = jest.fn().mockResolvedValue(null);
    if (name === 'Drawing') {
      MockModel.find = jest.fn().mockImplementation(() => ({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      }));
    } else {
      MockModel.find = jest.fn().mockResolvedValue([]);
    }
    MockModel.updateOne = jest.fn().mockResolvedValue({});
    MockModel.deleteMany = jest.fn().mockResolvedValue({});
    MockModel.prototype.save = jest.fn().mockImplementation(function () {
      return Promise.resolve(this);
    });

    return MockModel;
  };

  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(actualMongoose),
    model: jest.fn((name) => {
      if (!mockModels.has(name)) {
        mockModels.set(name, createMockModel(name));
      }
      return mockModels.get(name);
    }),
    connection: {
      ...actualMongoose.connection,
      on: jest.fn(),
      close: jest.fn().mockResolvedValue(undefined),
    },
  };
});

// Mock socket.io-client
const createMockSocket = () => {
  let lastChatMessage;
  return {
    connected: true,
    disconnect: jest.fn(),
    on: jest.fn((event, callback) => {
      if (event === 'connect') {
        callback();
      }
      if (event === 'chat message' && lastChatMessage) {
        callback(lastChatMessage);
      }
    }),
    emit: jest.fn((event, message) => {
      if (event === 'chat message') {
        lastChatMessage = message;
      }
    }),
    close: jest.fn(),
  };
};

jest.mock(
  'socket.io-client',
  () => {
    const mockIo = jest.fn(() => createMockSocket());
    mockIo.io = mockIo;
    return mockIo;
  },
  { virtual: true }
);
