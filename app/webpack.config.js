const path = require('path');

module.exports = {
  entry: './js/src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'js/dist')
  },
  devServer: {
    contentBase: './',
    publicPath: '/js/dist/',
    host: 'localhost'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  }
};
