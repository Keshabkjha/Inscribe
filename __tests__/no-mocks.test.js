// Simple test without any mocks
const sum = (a, b) => a + b;

describe('No Mocks Test Suite', () => {
  it('should add two numbers', () => {
    console.log('Running test without mocks...');
    expect(sum(1, 2)).toBe(3);
  });
});
