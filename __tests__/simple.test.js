// Simple test to verify the testing environment
const sum = (a, b) => a + b;

describe('Simple Test', () => {
  beforeAll(() => {
    console.log('Running simple test...');
  });

  it('should add two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should handle async operations', async () => {
    const result = await new Promise(resolve => setTimeout(() => resolve(42), 10));
    expect(result).toBe(42);
  });
});
