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
// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};
// Define then the messages
window.ParsleyConfig.i18n.bg = jQuery.extend(window.ParsleyConfig.i18n.bg || {}, {
  defaultMessage: "Невалидна стойност.",
  type: {
    email:        "Невалиден имейл адрес.",
    url:          "Невалиден URL адрес.",
    number:       "Невалиден номер.",
    integer:      "Невалиден номер.",
    digits:       "Невалидни цифри.",
    alphanum:     "Стойността трябва да садържа само букви или цифри."
  },
  notblank:       "Полето е задължително.",
  required:       "Полето е задължително.",
  pattern:        "Невалидна стойност.",
  min:            "Стойността трябва да бъде по-голяма или равна на %s.",
  max:            "Стойността трябва да бъде по-малка или равна на %s.",
  range:          "Стойността трябва да бъде между %s и %s.",
  minlength:      "Стойността е прекалено кратка. Мин. дължина: %s символа.",
  maxlength:      "Стойността е прекалено дълга. Макс. дължина: %s символа.",
  length:         "Дължината на стойността трябва да бъде между %s и %s символа.",
  mincheck:       "Трябва да изберете поне %s стойности.",
  maxcheck:       "Трябва да изберете най-много %s стойности.",
  check:          "Трябва да изберете между %s и %s стойности.",
  equalto:        "Стойността трябва да съвпада."
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('bg', window.ParsleyConfig.i18n.bg, true);
}));