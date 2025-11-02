/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  // Tests run after build so they import compiled CJS files in dist
  roots: ['<rootDir>'],
}

