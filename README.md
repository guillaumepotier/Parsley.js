# Parsley

[![Build Status](https://travis-ci.org/guillaumepotier/Parsley.js.svg?branch=master)](https://travis-ci.org/guillaumepotier/Parsley.js)

JavaScript form validation, without actually writing a single line of JavaScript!

## Version

2.1.2

## Doc

See `index.html` and `doc/`

## Requirements

jQuery >= 1.8

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

## Install dev environment

```
npm install
npm install -g grunt-cli
npm install -g bower
grunt configure
```

## Build `dist/`

```
grunt build
grunt build-all
```

## Generate annotated documentation

First time:
```
npm install -g docco
```

then
```
grunt build-annotated-source
```

## Run tests

In the browser: open `test/index.html`

In the terminal: `npm test`

## License

Released under the MIT License. See the bundled `LICENSE` file for
details.
