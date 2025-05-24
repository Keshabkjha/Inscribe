// Basic Jest test without any dependencies

// Simple function to test
function multiply(a, b) {
  return a * b;
}

// Test suite
describe('Basic Jest Test', () => {
  // Test case 1: Basic assertion
  it('should multiply two numbers correctly', () => {
    const result = multiply(2, 3);
    expect(result).toBe(6);
  });

  // Test case 2: Async test
  it('should handle async operations', async () => {
    const asyncResult = await Promise.resolve(10);
    expect(asyncResult).toBe(10);
  });

  // Test case 3: Object matching
  it('should match objects', () => {
    const obj = { a: 1, b: 2 };
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});
