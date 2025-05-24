module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: false,
  collectCoverageFrom: ['**/*.js'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js'],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};
