// Simple Jest test file
describe('Jest Test Suite', () => {
  beforeAll(() => {
    console.log('Jest setup...');
  });

  it('should pass a basic test', () => {
    console.log('Running Jest test...');
    expect(1 + 1).toBe(2);
  });

  it('should handle async code', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
