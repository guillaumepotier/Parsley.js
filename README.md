# Parsley

[![Build Status](https://travis-ci.org/guillaumepotier/Parsley.js.png?branch=master)](https://travis-ci.org/guillaumepotier/Parsley.js)

Javascript form validation, without actually writing a single line of javascript!

## Version

2.0.0-rc5

## Doc

See `index.html` and `doc/`

## Requirements

jQuery >= 1.6

## Contributing

See `CONTRIBUTING.md` file

## Install dev environment

```
npm install
npm install -g grunt-cli
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
