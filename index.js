// TODO tests for _dashToCamelCase and _camelCaseToDash

/**
* @module BeforeBuildWebpackPlugin
*/

/**
* @constructor
* @param {onBuildCallback} callback - will be called on specified event of webpack ("before run" by default).
*/
function WebpackBeforeBuildPlugin(callback, eventNames) {
  this.callback = callback;

  this.eventNames = eventNames || ["run", "watch-run"];
  if (!(this.eventNames instanceof Array)) this.eventNames = [this.eventNames];
};

/**
* @callback beforeBuildCallback
* @param {object} compiler - webpack compiler object
*/
WebpackBeforeBuildPlugin.prototype.apply = function (compiler) {
  for (var i in this.eventNames) {
    _applyPlugin(compiler, this.eventNames[i], this.callback);
  }
};

function _applyPlugin (compiler, eventName, fn) {
  if (!compiler.hooks) { 
    //webpack v1-3
    eventName = _camelCaseToDash(eventName);
    compiler.plugin(eventName, (compiler, callback) => {
      fn(compiler, callback || function(){});
    });
  } else { 
    //webpack v4
    eventName = _dashToCamelCase(eventName);
    if (compiler.hooks[eventName]) {
      compiler.hooks[eventName].tapAsync({ name: "before-build-webpack-plugin" }, (tap, callback) => {
        fn(tap, callback);
      });
    }
  }
}

/**
* Converts "aaa-bbb-ccc" to "aaaBbbCcc"
*/
function _dashToCamelCase (string) {
  return string.replace(/-([a-z])/g, (all, letter) => {
    return letter.toUpperCase();
  });
}

/**
* Converts "aaaBbbCcc" to "aaa-bbb-ccc"
* [source https://gist.github.com/youssman/745578062609e8acac9f]
*/
function _camelCaseToDash( myStr ) {
    return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

module.exports = WebpackBeforeBuildPlugin;
