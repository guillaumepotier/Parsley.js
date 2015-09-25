global.expect = require('expect.js');
global.sinon = require('sinon');

require('babel-core/register');
require('./setup')();

import simpleJSDom from 'simple-jsdom';
simpleJSDom.install();
