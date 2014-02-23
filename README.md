# Parsley

Next [Parsley](http://parsleyjs.org) version, still in heavy development.

## Version

2.0.0-rc1

## Doc

See `doc/`

## Install

```
npm install
npm install -g grunt-cli
grunt configure
```

## Requirements

jQuery >= 1.6


## Contributing

See `CONTRIBUTING.md` file


## Build dist versions

```
grunt build
grunt build-remote
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
