global.expect = require('expect.js');
global.sinon = require('sinon');

require('babel-core/register');

import simpleJSDom from 'simple-jsdom';
simpleJSDom.install();

require('./setup')();

