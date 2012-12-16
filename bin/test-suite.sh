#!/usr/bin/env bash

mocha-phantomjs tests/index.html && mocha-phantomjs tests/index.html#jquery-min && mocha-phantomjs tests/index.html#zepto && mocha-phantomjs tests/index.html#zepto-min && mocha-phantomjs tests/index.html#standalone