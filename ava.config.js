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
};

export default avaConfig; /* eslint-disable-line import/no-default-export */
