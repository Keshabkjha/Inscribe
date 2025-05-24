// Simple test to verify Jest is working
describe('Example Test Suite', () => {
  // Test case 1: Basic assertion
  it('should pass a basic test', () => {
    console.log('Running basic test...');
    expect(1 + 1).toBe(2);
  });

  // Test case 2: Async test
  it('should handle async operations', async () => {
    console.log('Running async test...');
    const result = await new Promise(resolve => {
      setTimeout(() => resolve(42), 10);
    });
    expect(result).toBe(42);
  });

  // Test case 3: Object matching
  it('should match objects', () => {
    const data = { one: 1 };
    data['two'] = 2;
    expect(data).toEqual({ one: 1, two: 2 });
  });
});
