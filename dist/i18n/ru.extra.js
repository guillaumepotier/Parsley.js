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
window.ParsleyConfig.i18n.ru = jQuery.extend(window.ParsleyConfig.i18n.ru || {}, {
  dateiso:  "Это значение должно быть корректной датой (ГГГГ-ММ-ДД).",
  minwords: "Это значение должно содержать не менее %s слов.",
  maxwords: "Это значение должно содержать не более %s слов.",
  words:    "Это значение должно содержать от %s до %s слов."
});
}));