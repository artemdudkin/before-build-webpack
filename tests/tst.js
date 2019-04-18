const fs = require("fs");
const { expect }  = require('chai');
const { runScript } = require('./rs');
const { del_folder, make_folder, copy_files, copy_file, replace_at_file } = require('./fs');

/**
 * Retuns npm command (OS dependent)
 */
function npmCmd() {
  return (/^win/.test(process.platform) ? 'npm.cmd' : 'npm');
}

/**
 * Create src folder, copy template project to it, download given webpack version (by 'npm install')
 */
async function prepare(version, folder) {
  del_folder(folder);
  make_folder(folder);
  await copy_files('./src_template', folder);
  replace_at_file(folder+'/package.json', /{webpack_version}/g, version);
  await copy_file('./fs.js', folder + '/fs.js');
  process.chdir(folder);
  return await runScript(npmCmd() +  ' install')
}

/**
 * 'npm run build' at sample project folder
 */
async function runBuild() {
  const res = await runScript(npmCmd() + ' run build', {onData:data=>console.log(data)})
  // delete all empty lines and lines that starts with ">"
  return res.lines.filter(i => !!i && !i.startsWith('>'));
}

/**
 * 'npm run build-stop' at sample project folder (build that will be stopped)
 */
async function runStoppedBuild() {
  const res = await runScript(npmCmd() + ' run build-stop', {onData:data=>console.log(data)})
  // delete all empty lines and lines that starts with ">"
  return res.lines.filter(i => !!i && !i.startsWith('>'));
}       
 
/**
 * Delete sample project folder
 */
function clear(folder) {
  process.chdir('..');
  del_folder(folder);
}

/**
 * Test suite for before-build-webpack @ given version of webpack. 
 *
 * Creates folder and copies sample project to it, then fix webpack version at packages.json,
 * then builds project as simple as just printing 'this is abc', 
 * but under the cover source code prints 'this is 123' and webpack 
 * hooks changes source file (file1.js) before build (to print 'abc') 
 * and after build (to demonstrate that it can do it).
 *
 * @param opt {Object}
 *          opt.webpack_version {string} version of webpack
 *          opt.before  {async function} (optional) something you should do at before() hook of Mocha
 */
function tst(opt) {

  describe("webpack v"+opt.webpack_version, function() {
    const version = opt.webpack_version;
    const folder = './v'+version;
    this.timeout(300000); //5 min

    before(async function(){
      await prepare(version, folder);
      if (opt.before) await opt.before();
    });

    after(function(){
      clear(folder);
    });

    it("should start 'run' and 'done' event hooks", async function() {
      const data = fs.readFileSync('./src/file1.js', 'utf8');
      //check that file1.js goes to return '123' originally
      expect(data.indexOf('123')).to.not.equal(-1);
      expect(data.indexOf('abc')).to.equal(-1);
      expect(data.indexOf('xyz')).to.equal(-1);

      const res = await runBuild();
      expect(res[0]).to.equal("---before---");
      expect(res[1]).to.equal("---after---");
    });

    it("should change function output to 'abc' at 'run' event hook", async function() {
      const res = await runScript('node ./dist/bundle' );
      expect(res.lines[0]).to.equal('this is abc');
    });

    it("should change original file to 'xyz' at 'done' event hook", async function() {
      const data = fs.readFileSync('./src/file1.js', 'utf8');
      //omg file1.js was changed twice. what a mess!
      expect(data.indexOf('123')).to.equal(-1);
      expect(data.indexOf('abc')).to.equal(-1);
      expect(data.indexOf('xyz')).to.not.equal(-1);
    });

    it("should stop if callback was not called", async function() {
      const res = await runStoppedBuild();
      expect(res.length).to.equal(2);
      expect(res[0]).to.equal("---before---");
      expect(res[1]).to.equal("EXIT 0");
    });
  });

}

module.exports = {tst, npmCmd};
