global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));

require('babel-core/register');
require('./setup')();

import simpleJSDom from 'simple-jsdom';
simpleJSDom.install();
