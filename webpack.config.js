module.exports = {
  mode: 'development',
  entry: './assets/javascripts/index.js',
  output: {
    path: __dirname + '/assets/dist',
    // publicPath: '/assets',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
};
