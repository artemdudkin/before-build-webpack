# before-build-webpack

[Webpack](http://webpack.github.io/) plugin that gives ability to before callback
after build.

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
      new WebpackBeforeBuildPlugin(function(compiler, callback) {

        // Do whatever you want...

        callback(); //don't call it if you do want to stop compilation
      }),
    ]
  },
// ...
```

