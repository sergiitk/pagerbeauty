module.exports = {
  'extends': 'airbnb',
  'rules': {
    // Because we build assets in dev mode and then publish to prod.
    'import/no-extraneous-dependencies': 'off',
    // https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad
    'import/prefer-default-export': 'off',
    // Basically same thing
    'react/no-multi-comp': 'off',
    // Classes FTW
    'react/prefer-stateless-function': 'off',
    // Source: https://github.com/airbnb/javascript/blob/80920a07c5144148d2987f39fb9558246552648e/packages/eslint-config-airbnb-base/rules/style.js#L396
    'object-curly-newline': [
      'error',
      {
        'ObjectExpression': {
          'minProperties': 4,
          'multiline': true,
          'consistent': true
        },
        // Only changeing this: don't require newlines in object destruction.
        // This is not convenient with required props and state destruction
        'ObjectPattern': {
          'minProperties': 20,
          'multiline': true,
          'consistent': true
        },
        'ImportDeclaration': {
          'minProperties': 4,
          'multiline': true,
          'consistent': true
        },
        'ExportDeclaration': {
          'minProperties': 4,
          'multiline': true,
          'consistent': true
        }
      }
    ],
  },
  'env': {
    'browser': true,
    'node': true,
  },
}
