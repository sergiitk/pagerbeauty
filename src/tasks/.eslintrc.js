module.exports = {
  rules: {
    // Don't requre `this` in task hooks for consitency.
    'class-methods-use-this': ['error', {
      exceptMethods: [
        'onRunError',
        'onRunSkip',
        'onRunSuccess',
        'onStart',
        'onStop',
        'run',
      ],
    }],
  },
};
