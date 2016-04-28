global.expect = require('expect.js');
global.sinon = require('sinon');
global.travis = process.env.TRAVIS;

require('babel-core/register');

var jsdom = require('jsdom').jsdom;
global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator = {
  userAgent: 'NodeJS JSDom',
  appVersion: ''
};

require('./setup')();

