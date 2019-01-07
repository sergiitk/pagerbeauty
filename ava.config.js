// Ava config object
const avaConfig = {
  files: [
    'test/**/*.js',
    'test/**/*.mjs',
    '!test/helpers',
  ],
  require: ['esm'],
  babel: false,
  compileEnhancements: false,
  extensions: [
    'js',
    'mjs',
  ],
  // https://github.com/avajs/ava/blob/master/docs/03-assertions.md#custom-assertions
  // Chai is used for assertions.
  failWithoutAssertions: false,
};

export default avaConfig; /* eslint-disable-line import/no-default-export */
