module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
    amd: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  globals: {
    __DEV__: true,
    __TEST__: true,
    __PRODUCTION__: true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-cond-assign': [2, 'always'],
    semi: [0, 'never'],
    'comma-dangle': [0, 'never'],
    indent: [
      0,
      4,
      {
        SwitchCase: 1,
        MemberExpression: 1,
        ObjectExpression: 1
      }
    ],
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    'space-infix-ops': [
      2,
      {
        int32Hint: false
      }
    ],
    'linebreak-style': [2, 'unix'],
    quotes: [2, 'single'],
    'no-unexpected-multiline': [2],
    'object-curly-newline': [
      0,
      {
        ObjectExpression: {
          minProperties: 1
        },
        ObjectPattern: {
          multiline: true
        }
      }
    ],
    'object-property-newline': 2
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
