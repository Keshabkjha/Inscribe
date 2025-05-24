// Minimal test to verify test runner works
describe('Minimal Test Suite', () => {
  beforeAll(() => {
    console.log('Setting up test environment...');
  });

  afterAll(() => {
    console.log('Cleaning up test environment...');
  });

  it('should pass a basic assertion', () => {
    console.log('Running basic test...');
    expect(1 + 1).toBe(2);
  });

  it('should handle async code', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
