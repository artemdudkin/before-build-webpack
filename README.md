# before-build-webpack

[Webpack](http://webpack.github.io/) (v1-4) plugin that gives ability to add callback
before build (or after or any other [event hook](https://webpack.js.org/api/compiler-hooks/)). Can stop compilation by by condition.

## Installation

```
npm install --save-dev before-build-webpack
```

## Usage

In config file:

``` javascript
var WebpackBeforeBuildPlugin = require('before-build-webpack');
// ...
  module: {
    plugins: [
      new WebpackBeforeBuildPlugin(function(stats, callback) {
        // Do whatever you want...
        callback(); // don't call it if you do want to stop compilation
      }),
    ]
  },
// ...
```

## OR (more power)

``` javascript
// ...
  module: {
    plugins: [
      new WebpackBeforeBuildPlugin(function(stats, callback) {
        // ...
      }, ['run', 'watch-run', 'done']), // will fire before build and after build
    ]
  },
// ...
```
