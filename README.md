# before-build-webpack

[Webpack](http://webpack.github.io/) plugin that gives ability to add callback
before build (or at any other event).

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
      new WebpackBeforeBuildPlugin(function(compiler) {
        // Do whatever you want...
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
      new WebpackBeforeBuildPlugin(function(compiler) {
        // ...
      }, ['run', 'watch-run', 'done']), // starts before build and after build
    ]
  },
// ...
```
