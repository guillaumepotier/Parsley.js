/*!
* Parsleyjs
* Guillaume Potier - <guillaume@wisembly.com>
* Version 2.2.0-rc2 - built Tue Oct 06 2015 10:20:13
* MIT Licensed
*
*/
!(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module depending on jQuery.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Register plugin with global jQuery object.
    factory(jQuery);
  }
}(function ($) {
  // small hack for requirejs if jquery is loaded through map and not path
  // see http://requirejs.org/docs/jquery.html
  if ('undefined' === typeof $ && 'undefined' !== typeof window.jQuery)
    $ = window.jQuery;
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};
window.ParsleyConfig.i18n.nl = jQuery.extend(window.ParsleyConfig.i18n.nl || {}, {
  dateiso:  "Deze waarde moet een datum in het volgende formaat zijn: (YYYY-MM-DD).",
  minwords: "Deze waarde moet minstens %s woorden bevatten.",
  maxwords: "Deze waarde mag maximaal %s woorden bevatten.",
  words:    "Deze waarde moet tussen de %s en %s woorden bevatten.",
  gt:       "Deze waarde moet groter dan %s zijn.",
  lt:       "Deze waarde moet kleiner dan %s zijn."
});
}));