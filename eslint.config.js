import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
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
    files: ['src/context/LanguageContext.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['src/components/VideoPlayer.jsx'],
    rules: { 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]|^motion$' }] },
  },
])
