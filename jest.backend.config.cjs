module.exports = {
  displayName: 'backend',
  testMatch: ['<rootDir>/testing/**/*.test.js'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/__mocks__'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node']
};
