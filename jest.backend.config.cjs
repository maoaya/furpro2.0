module.exports = {
  displayName: 'backend',
  testMatch: ['<rootDir>/testing/**/*.test.mjs'],
  testEnvironment: 'node',
  preset: null,
  transform: {
    '^.+\\.(mjs|js)$': ['babel-jest', { 
      presets: [['@babel/preset-env', { 
        targets: { node: 'current' },
        modules: 'commonjs'
      }]],
      plugins: [
        ['@babel/plugin-syntax-dynamic-import']
      ]
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(supertest|.*\\.(mjs|js)$))'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/__mocks__'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  moduleFileExtensions: ['mjs', 'js', 'jsx', 'json', 'node'],
  testTimeout: 20000,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true
};
