// @ts-check

import js from '@eslint/js'
import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js';
import functional from 'eslint-plugin-functional';
import reactHooks from 'eslint-plugin-react-hooks'

// /** @type {import('eslint').ESLint.Plugin} */
// // @ts-expect-error
// const reactHooksPlugin = reactHooks

// /** @type {import('eslint').Linter.RulesRecord} */
// const reactHooksRules =
//   reactHooks.configs.recommended.rules

export default tseslint.config(
  {
    ignores: [
      'dist/**/*.ts',
      'dist/**',
      '**/*.mjs',
      '**/*.js',
      'notes/**/*.ts',
      'notes/**'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      // 'react-hooks': reactHooksPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // ...reactHooksRules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ]
    },
  },
  {
    plugins: {
      'functional': functional
    },
    rules: {
      'functional/type-declaration-immutability': ['error', {
        rules: [
          {
            identifiers: '^(?!I?Mutable).+',
            immutability: 'ReadonlyShallow',
            comparator: 'AtLeast',
            fixer: false,
            suggestions: false
          },
        ],
        ignoreInterfaces: false
      }],
    }
  }
)
