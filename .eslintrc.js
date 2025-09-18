module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  ignorePatterns: [
    'node_modules/',
    'dist/**',
    'public/**',
    'target/**',
    'uploads/**',
    'sqlite3.exe/**',
    'sqlite3_*.exe',
    '*.log'
  ],
  // Config base para JS/JSX
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  // Usamos el parser por defecto (espree) para JS y habilitamos JSX
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    // React 17+ no requiere React en scope para JSX
    'react/react-in-jsx-scope': 'off',
    // Opcional: no exigir prop-types si se usa TS o no se mantiene activamente
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    // Soporte JSX y globals en tests de Cypress/Jest escritos en .js
    {
      files: [
        '**/*.spec.js',
        '**/*.test.js',
        '**/*.cy.js',
        '**/*.cy.jsx',
        '**/*.cy.ts',
        '**/*.cy.tsx',
        'cypress/**/*.{js,jsx,ts,tsx}'
      ],
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      env: { jest: true, mocha: true, browser: true, node: true, es2021: true },
      globals: { cy: 'readonly', Cypress: 'readonly' },
      rules: {
        'react/display-name': 'off',
        // Algunos tests usan regex con caracteres de control para casos límite
        'no-control-regex': 'off'
      }
    },
    // Reglas y parser específicos para TypeScript
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      plugins: ['@typescript-eslint'],
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  ]
};
