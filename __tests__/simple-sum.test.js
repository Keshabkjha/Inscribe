// Simple test to verify Jest is working
function sum(a, b) {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  console.log('Running simple test...');
  const result = sum(1, 2);
  console.log('Result:', result);
  expect(result).toBe(3);
});
