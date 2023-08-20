module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['google', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'new-cap': 'off',
    'require-jsdoc': 'off',
    camelcase: 'off',
  },
};
