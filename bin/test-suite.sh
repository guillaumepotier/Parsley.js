#!/usr/bin/env bash

mocha-phantomjs tests/index.html -R dot && mocha-phantomjs tests/index.html#jquery-min -R dot && mocha-phantomjs tests/index.html#zepto -R dot && mocha-phantomjs tests/index.html#zepto-min -R dot