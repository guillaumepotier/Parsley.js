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
// Parsley localization for Ukrainian language
// Alexander Shepetko
// https://github.com/ashep

// ParsleyConfig definition if not already set
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};
// Define then the messages
window.ParsleyConfig.i18n.uk = jQuery.extend(window.ParsleyConfig.i18n.uk || {}, {
  defaultMessage: "Некоректне значення.",
  type: {
    email:        "Введіть адресу електронної пошти.",
    url:          "Введіть URL-адресу.",
    number:       "Введіть число.",
    integer:      "Введіть ціле число.",
    digits:       "Введіть тільки цифри.",
    alphanum:     "Введіть буквено-цифрове значення."
  },
  notblank:       "Це поле повинно бути заповнено.",
  required:       "Обов'язкове поле",
  pattern:        "Це значення некоректно.",
  min:            "Це значення повинно бути не менше ніж %s.",
  max:            "Це значення повинно бути не більше ніж %s.",
  range:          "Це значення повинно бути від %s до %s.",
  minlength:      "Це значення повинно містити не менше ніж %s символів.",
  maxlength:      "Це значення повинно містити не більше ніж %s символів.",
  length:         "Це значення повинно містити від %s до %s символів.",
  mincheck:       "Виберіть не менше %s значень.",
  maxcheck:       "Виберіть не більше %s значень.",
  check:          "Виберіть від %s до %s значень.",
  equalto:        "Це значення повинно збігатися."
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('uk', window.ParsleyConfig.i18n.uk, true);
}));