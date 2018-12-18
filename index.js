// TODO add v4 to pre-v4 convertation
// TODO add tests (for v1, v2, v3, v4 webpacks as a challenge)

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
    compiler.plugin(eventName, (compiler, callback) => {
      fn(compiler, callback || function(){});
    });
  } else { 
    //webpack v4
    eventName = _camelCase(eventName);
    if (compiler.hooks[eventName]) {
      compiler.hooks[eventName].tapAsync({ name: "before-build-webpack-plugin" }, (tap, callback) => {
        fn(tap, callback);
      });
    }
  }
/**
* Converts "aaa-bbb-ccc" to "aaaBbbCcc"
*/
function _camelCase (string) {
  return string.replace(/-([a-z])/g, (all, letter) => {
    return letter.toUpperCase();
  });
}


  /*
  webpack v1-3 events
  
  "make"
  "compile"
  "after-compile"
  "run"
  "watch-run"
  "should-emit"
  "emit"
  "after-emit"
  "invalid"
  "done"
  "this-compilation"
  "compilation"
  "normal-module-factory"
  "context-module-factory"
  "failed"
  
  webpack v4 events
  
  'shouldEmit',
  'done',
  'additionalPass',
  'beforeRun',
  'run',
  'emit',
  'afterEmit',
  'thisCompilation',
  'compilation',
  'normalModuleFactory',
  'contextModuleFactory',
  'beforeCompile',
  'compile',
  'make',
  'afterCompile',
  'watchRun',
  'failed',
  'invalid',
  'watchClose',
  'environment',
  'afterEnvironment',
  'afterPlugins',
  'afterResolvers',
  'entryOption'
  */
}

module.exports = WebpackBeforeBuildPlugin;
