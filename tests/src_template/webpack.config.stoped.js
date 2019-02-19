const path = require('path');
const WebpackBeforeBuildPlugin = require('../../index');

module.exports = {
  entry: {
    'bundle.js': [
      path.resolve(__dirname, 'src/file1.js'),
      path.resolve(__dirname, 'src/file2.js')
    ]
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new WebpackBeforeBuildPlugin(function(stats, callback) {
      console.log('---before---');
      // callback(); // don't call it if you do want to stop compilation
    })
  ]
};