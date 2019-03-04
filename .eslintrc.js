module.exports = {
  root: true,
  parser: 'typescript-eslint-parser',
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: false,
      modules: true
    }
  },
  plugins: [
    'typescript',
  ],
  extends: [
    'airbnb-base'
  ],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1 }],
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'spaced-comment': 'off',
    align: {
      'mode': 'strict',
    }
  },
}
