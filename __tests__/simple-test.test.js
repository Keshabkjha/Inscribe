// Simple test file
const add = (a, b) => a + b;

test('adds 1 + 2 to equal 3', () => {
  console.log('Running simple test...');
  expect(add(1, 2)).toBe(3);
});
