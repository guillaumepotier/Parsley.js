var config = require('../../package.json').babelBoilerplateOptions;

global.mocha.setup('bdd');
global.onload = function() {
  global.mocha.checkLeaks();
  global.mocha.globals(config.mochaGlobals);
  global.mocha.run();
  require('./setup')();
};
