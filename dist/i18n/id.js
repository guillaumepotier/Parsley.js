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
window.ParsleyConfig.i18n.id = jQuery.extend(window.ParsleyConfig.i18n.id || {}, {
  defaultMessage: "tidak valid",
  type: {
    email:        "email tidak valid",
    url:          "url tidak valid",
    number:       "nomor tidak valid",
    integer:      "integer tidak valid",
    digits:       "harus berupa digit",
    alphanum:     "harus berupa alphanumeric"
  },
  notblank:       "tidak boleh kosong",
  required:       "tidak boleh kosong",
  pattern:        "tidak valid",
  min:            "harus lebih besar atau sama dengan %s.",
  max:            "harus lebih kecil atau sama dengan %s.",
  range:          "harus dalam rentang %s dan %s.",
  minlength:      "terlalu pendek, minimal %s karakter atau lebih.",
  maxlength:      "terlalu panjang, maksimal %s karakter atau kurang.",
  length:         "panjang karakter harus dalam rentang %s dan %s",
  mincheck:       "pilih minimal %s pilihan",
  maxcheck:       "pilih maksimal %s pilihan",
  check:          "pilih antar %s dan %s pilihan",
  equalto:        "harus sama"
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('id', window.ParsleyConfig.i18n.id, true);
}));