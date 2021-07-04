module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    camelcase: 'off',
    'node/no-callback-literal': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-prototype-builtins': 'off',
    'space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
  },
}
