module.exports = {
  'extends': 'airbnb-base',
  'rules': {
    // https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
  },
}
