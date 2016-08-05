# Parsley

[![Build Status](https://travis-ci.org/guillaumepotier/Parsley.js.svg?branch=master)](https://travis-ci.org/guillaumepotier/Parsley.js)

JavaScript form validation, without actually writing a single line of JavaScript!

## Version

2.4.4

## Doc

See `index.html` and `doc/`

## Requirements

[jQuery](https://jquery.com/) >= 1.8 (compatible with 2.x and 3.0)
[es5-shim](https://github.com/es-shims/es5-shim) if you want need to support IE8

## Contributing

See the [`CONTRIBUTING.md` file](https://github.com/guillaumepotier/Parsley.js/blob/master/CONTRIBUTING.md)

## Integrations

Create integration with other framework as a separate Github repo and send a pull request for including here.
Some integrations are

* [CakePHP](https://github.com/Codaxis/parsley-helper)
* [Django](https://github.com/agiliq/django-parsley)
* [Rails](https://github.com/mekishizufu/parsley-rails)
* [OSSCDN by MaxCDN](http://osscdn.com/#/parsleyjs)
* [Drupal] (https://www.drupal.org/project/parsley)

## Install dev environment and running tests

First time: install `npm` and:
```
npm install -g gulp
```

then
```
npm install
gulp test
```

## Build `dist/` and `doc/annotated-source`

```
gulp build
```

## Run tests

In the browser: run a server with `gulp test-browser`, then open `test/runner.html`

In the terminal: `gulp test`

## License

Released under the MIT License. See the bundled `LICENSE` file for
details.
