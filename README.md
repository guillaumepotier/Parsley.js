# Parsley

[![Build Status](https://travis-ci.org/guillaumepotier/Parsley.js.png?branch=master)](https://travis-ci.org/guillaumepotier/Parsley.js)

Javascript form validation, without actually writing a single line of javascript!

## Version

2.0.0

## Doc

See `index.html` and `doc/`

## Requirements

jQuery >= 1.6

## Contributing

See `CONTRIBUTING.md` file

##Integrations

Create integration with other framework as a separate Github repo and send a pull request for including here.
Some integrations are

* [CakePHP](https://github.com/Codaxis/parsley-helper)
* [Django](https://github.com/agiliq/django-parsley)
* [Rails](https://github.com/mekishizufu/parsley-rails)
* [OSSCDN by MaxCDN](http://osscdn.com/#/parsleyjs)

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
sudo npm install -g docco

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
