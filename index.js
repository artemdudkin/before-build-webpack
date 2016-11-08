/**
 * @module WebpackBeforeBuildPlugin
 */

/**
 * @constructor
 * @param {onBuildCallback} callback - will be called right after build.
 */
function WebpackBeforeBuildPlugin(callback) {
  this.callback = callback;
};

/**
 * @callback onBuildCallback
 * @param {object} stats - webpack stats object
 */

/**
 * @param {object} compiler
 */
WebpackBeforeBuildPlugin.prototype.apply = function(compiler) {
  compiler.plugin('run', this.callback);
  compiler.plugin('run-watch', this.callback);  
};

module.exports = WebpackBeforeBuildPlugin;

