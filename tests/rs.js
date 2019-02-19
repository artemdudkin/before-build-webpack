const spawn = require('child_process').spawn;

/**
 * Runs shell command and returns Promise
 *
 * @param command    {string} some (lonely) bash command
 * @param opt        {Object} optional data object
 *        opt.onData {Function} callback that will be called when script writes new line
 *
 * @returns {Promise} promise that will return {Object} on reject or resolve with fields:
 *    resultCode {int} -1=error at node code, 0=process completed successfully, >0=process exit code
 *    command    {string} shell command (equals to param command)
 *    lines      {Array of string} shell command output (both stdout and stderr) or error with prefix ERROR
*/
function run(command, opt) {
  return new Promise(function(resolve, reject){
    if (!command || typeof command != 'string') {
      reject({
        resultCode:-1,
        command:command,
        lines:["ERROR NO_COMMAND"]
      });
    }

    const result = {resultCode:0, command:command, lines:[]}    

    try{
      const cmd_args = command.split(" ");
      const cmd = cmd_args[0];
      cmd_args.shift();
    
      const proc = spawn(cmd, cmd_args);

      proc.stdout.on('data', function (data) {
        const s = data.toString('utf8');
        const s2 = s.split('\n'); // some strings can contain \n and we will split it
        result.lines.push.apply(result.lines, s2);
        if (opt && opt.onData) {
          if (typeof opt.onData == 'function'){
            opt.onData(s);
          } else {
            result.lines.push('ERROR opt.onData is not a function');
          }
        }
      });

      proc.stderr.on('data', function (data) {
        const s = data.toString('utf8');
        result.lines.push(s);
        if (opt && opt.onData) {
          if (typeof opt.onData == 'function'){
            opt.onData(s);
          } else {
            result.lines.push('ERROR opt.onData is not a function');
          }
        }
      });

      proc.on('exit', function (code) {
        result.lines.push('EXIT '+ code);
        if (code == 0) { 
          resolve(result);
        } else {
          result.resultCode = code;
          reject(result);
        }
      });

      proc.on('error', function (data) {
        result.lines.push('ERROR '+ data.toString('utf8'));
        reject(result);
      });

    } catch (err) {
      result.resultCode = -1;
      result.lines.push('ERROR '+ err.stack);
      reject(result);
    }
  })
}

module.exports = {runScript:run};
/*
const argv = require('yargs').argv
if (argv.bash) {
    run(argv.bash)
    .then(res=>{
        console.log('+++++');
        console.log(res);
    })    
    .catch(res=>{
        console.log('------');
        console.log(res);
    })
}
*/