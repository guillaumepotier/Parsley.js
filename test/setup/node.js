global.expect = require('expect.js');
global.sinon = require('sinon');
global.travis = process.env.TRAVIS;

require('babel-core/register');


var jsdom = require('jsdom').jsdom;
var document = jsdom('<html><head></head><body></body></html>');
var window = document.defaultView;
var navigator = window.navigator = {
  userAgent: 'NodeJS JSDom',
  appVersion: ''
};

global.jsdom = jsdom;
global.document = document;
global.window = window;
global.navigator = navigator;

require('./setup')();

