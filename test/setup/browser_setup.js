import setup from './setup';
import mocha from '../../tools/mocha_options';

window.global = window;
global.travis = false;
global.mocha.setup('bdd');
global.onload = function() {
  global.mocha.checkLeaks();
  global.mocha.globals(mocha.globals);
  global.mocha.run();
  setup();
};
