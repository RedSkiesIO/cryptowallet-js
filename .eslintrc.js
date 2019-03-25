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
    'header'
  ],
  extends: [
    'airbnb-base'
  ],
  rules: {
    'header/header': [2, 'license-header.js'],
    'object-curly-spacing': ['error', 'always'],
    'no-magic-numbers': ['error', {'ignore': [0, 1, 10], 'ignoreArrayIndexes': true }],
    'lines-between-class-members': ['off'],
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1 }],
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'spaced-comment': 'off',
    align: {
      'mode': 'strict'
    }
  },
}
