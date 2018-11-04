module.exports = {
  mode: 'development',
  entry: './assets/javascripts/index.js',
  output: {
    path: __dirname + '/assets/dist',
    // publicPath: '/assets',
    filename: 'bundle.js'
  },
};
