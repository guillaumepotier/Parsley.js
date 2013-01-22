#Parsley.js

[![Build Status](https://travis-ci.org/guillaumepotier/Parsley.js.png?branch=master)](https://travis-ci.org/guillaumepotier/Parsley.js)

Javascript form validation, without actually writing a single line of javascript!

#TODOs

See TODO.md

#Version

1.1.2

# Browser compatibility

No idea yet.. You tell me !

#Install dependencies for documentation and tests

`bower install jquery`
`bower install bootstrap`

#Run tests

* In your browser: go to `tests/index.html`
* Headless tests: install mocha-phantomjs with npm: `npm install -g mocha-phantomjs` and then run `./bin/test-suite.sh`

#Make production minified versions

You'll need ruby, and Google Closure compiler: `gem install closure-compiler`. Then, just call:

`./bin/build.sh version` where version is the build release. eg: `./bin/build.sh 1.1.2`

They'll be created and dumped in the dist/ directory

#Contribute!

##Validators

Add new validators in `parsley.extend.js` and minify it. No validators will be allowed directly into parsley.js
(but great validators could move from extra to parsley ;))

##Localization

If file does not existe, create it into `ì18n/` directory with same synthax as others

## Global

* fork repository
* add your changes to parsley.js
* add / update tests to test suite (tests/index.html / tests/tests.js)
* run tests (see above)
* create new minified versions with minify script (see above)
* make a Pull Request!

#Licence

See LICENCE.md
