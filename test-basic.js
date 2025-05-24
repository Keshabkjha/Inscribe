// Simple test file using Node's built-in test module
const test = require('node:test');
const assert = require('node:assert');

// Simple function to test
const sum = (a, b) => a + b;

// Test case
test('should add two numbers', (t) => {
  console.log('Running test...');
  assert.strictEqual(sum(1, 2), 3);
  console.log('Test passed!');
});
