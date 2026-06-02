const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: ['node_modules/**', 'android/**', 'ios/**', '.expo/**', 'dist/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        __DEV__: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:'],
            ['^react', '^react-native', '^expo'],
            ['^@(?!/)'],
            ['^@/app', '^@/components', '^@/store', '^@/hooks', '^@/constants'],
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
];
