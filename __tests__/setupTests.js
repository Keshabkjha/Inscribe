// Global test setup
process.env.NODE_ENV = 'test';

// Set a test port
process.env.PORT = '0';

// Mock console methods to keep test output clean
global.console = {
  ...console,
  // Uncomment these to see logs during tests
  // log: console.log,
  // debug: console.debug,
  // info: console.info,
  // warn: console.warn,
  // error: console.error,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Increase timeout for tests that need more time (like database operations)
jest.setTimeout(30000);
