const path = require('path');
const WebpackBeforeBuildPlugin = require('../../index');
const { replace_at_file } = require('./fs');

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
      replace_at_file('./src/file1.js', /123/g, 'abc');
      callback();
    }),
    new WebpackBeforeBuildPlugin(function(stats, callback) {
      console.log('---after---');
      replace_at_file('./src/file1.js', /abc/g, 'xyz');
      callback();
    }, 'done')
  ]
};