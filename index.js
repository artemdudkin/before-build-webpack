/**
 * @module WebpackBeforeBuildPlugin
 */

/**
 * @constructor
 * @param {beforeBuildCallback} callback - will be called before build.
 */
function WebpackBeforeBuildPlugin(callback) {
  this.callback = callback;
};

/**
 * @callback beforeBuildCallback
 * @param {object} compiler - webpack compiler object
 * @param {object} callback - callback you should call if you want to continue compilation
  */

/**
 * @param {object} compiler
 */
WebpackBeforeBuildPlugin.prototype.apply = function(compiler) {
  compiler.plugin('run', this.callback);
  compiler.plugin('watchRun', this.callback);  
};

module.exports = WebpackBeforeBuildPlugin;

