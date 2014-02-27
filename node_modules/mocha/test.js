"use strict"

var assert = require('assert'),
    http = require('http');

var test = function test(req, res) {
  res.writeHead(200);
  res.end();
};

describe( 'canary', function () {
  let OPTIONS, SERVER, TEST_HARNESS;

  beforeEach(function(done) {
    OPTIONS = {
      hostname : 'localhost',
      port : 10211,
      path : '/',
      method : 'GET'
    };

    SERVER = {};

    TEST_HARNESS = http.createServer(test.bind(SERVER));
    TEST_HARNESS.listen(10211, function() {
      done();
    });
  });

  afterEach(function(done) {
    TEST_HARNESS.close(function() {
      console.log('asdf');
      done();
    });
  });

  it('should return 200', function(done) {
    let req = http.request(OPTIONS, function(response) {
      assert.equal(response.statusCode, 200);
      console.log('done');
      done();
    });
    req.end();
  });
});
