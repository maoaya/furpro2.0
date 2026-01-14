module.exports = {
  displayName: 'frontend',
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx',
    '<rootDir>/src/**/*.spec.js',
    '<rootDir>/src/**/*.spec.jsx',
    '<rootDir>/testing/auto/**/*.spec.js',
    '<rootDir>/testing/auto/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '/src/.*\\.cy\\.spec\\.jsx$',
    '/src/.*\\.cy\\.spec\\.js$'
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { url: 'http://localhost' },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/__mocks__'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/src/jest.canvas.mock.js',
    '<rootDir>/src/jest.chartjs.mock.js',
    '<rootDir>/jest.setup.js'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node']
};
