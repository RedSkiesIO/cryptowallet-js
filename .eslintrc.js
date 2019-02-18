module.exports = {
  root: true,
  parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: false
    }
  },
  plugins: [
    'typescript'
  ],
  extends: [
    'plugin:vue-libs/recommended',
    'airbnb-base'
  ],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1 }],
    'no-undef': 'off',
    'no-unused-vars': 'off'
  }
}
