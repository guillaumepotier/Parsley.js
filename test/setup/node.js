global.expect = require('expect.js');
global.sinon = require('sinon');
global.travis = process.env.TRAVIS;

require('babel-core/register');

import simpleJSDom from 'simple-jsdom';
simpleJSDom.install();

require('./setup')();

