const { tst, npmCmd } = require('./tst');
const { runScript } = require('./rs');

tst({ webpack_version: '1.15.0'});
tst({ webpack_version: '2.7.0'});
tst({ webpack_version: '3.12.0'});
tst({ webpack_version: '4.44.2',
      // webpack v4 forces to install webpack-cli
      before: async () => { await runScript(npmCmd()+' i webpack-cli@3.3.12') }
});
tst({ webpack_version: '5.2.0',
      before: async () => { await runScript(npmCmd()+' i webpack-cli@4.1.0') }
});