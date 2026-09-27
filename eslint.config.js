import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public', '.next']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['src/App.jsx'],
    rules: { 'react-hooks/immutability': 'off' },
  },
  {
    files: ['api/**/*.js', 'app/api/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['src/components/VideoPlayer.jsx'],
    rules: { 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]|^motion$' }] },
  },
])
