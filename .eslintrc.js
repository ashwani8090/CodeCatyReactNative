// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser', // Use TypeScript parser
  plugins: [
    'react',
    'eslint-plugin-import-helpers',
    '@typescript-eslint', // Add TypeScript plugin
    'react-hooks',
  ],
  rules: {
    'no-empty-function': 'off',
    'no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: 'res|next|^err',
      },
    ],
    'react-hooks/exhaustive-deps': 'warn', // or 'error' if you want it to be an error
    eqeqeq: ['warn', 'always'],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'no-unused-expressions': ['error'],
    'no-param-reassign': [
      0,
      {
        props: false,
      },
    ],
    semi: 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-nested-ternary': 'off',
    // '@typescript-eslint/semi': 'off',
    'no-console': ['error', {allow: ['warn', 'error', 'info']}],
    'space-before-function-paren': 0,
    // '@typescript-eslint/comma-dangle': ['off'],
    'react/jsx-props-no-spreading': 'off',
    'import-helpers/order-imports': [
      'error',
      {
        newlinesBetween: 'always',
        groups: ['module', '/^@/', ['parent', 'sibling', 'index']],
        alphabetize: {order: 'asc', ignoreCase: true},
      },
    ],
  },
};
