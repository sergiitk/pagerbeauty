module.exports = {
  'extends': 'airbnb',
  'rules': {
    // Because we build assets in dev mode and then publish to prod.
    'import/no-extraneous-dependencies': 'off',
  },
  'env': {
    'browser': true,
    'node': true,
  },
}
