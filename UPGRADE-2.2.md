# UPGRADE FROM 2.1.x to 2.2.0

## Where's parsley.remote?

Both versions (remote and basic) of Parsley have been merged. There is now a single version that is remote & promise aware, and it is lighter than both of the 2.1.x versions.

## Compatibility

2.2.0 version should be compatible with 2.1.x except that you need to include `es5-shim` if you need compatibility with IE8.

Please check the console for **deprecation notices** and adapt your code accordingly.

Note that `type="number"` now follows HTML5 spec. In particular, commas are no longer accepted. (#1037)

## Source changes

Parsley's source is now in EcmaScript 6.

The `i18n` folder is now part of the `dist` folder.
