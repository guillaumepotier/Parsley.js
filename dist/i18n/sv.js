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
window.ParsleyConfig.i18n.sv = jQuery.extend(window.ParsleyConfig.i18n.sv || {}, {
  defaultMessage: "Ogiltigt värde.",
  type: {
    email:        "Ange en giltig e-postadress.",
    url:          "Ange en giltig URL.",
    number:       "Ange ett giltigt nummer.",
    integer:      "Ange ett heltal.",
    digits:       "Ange endast siffror.",
    alphanum:     "Ange endast bokstäver och siffror."
  },
  notblank:       "Värdet får inte vara tomt.",
  required:       "Måste fyllas i.",
  pattern:        "Värdet är ej giltigt.",
  min:            "Värdet måste vara större än eller lika med %s.",
  max:            "Värdet måste vara mindre än eller lika med %s.",
  range:          "Värdet måste vara mellan %s och %s.",
  minlength:      "Värdet måste vara minst %s tecken.",
  maxlength:      "Värdet får maximalt innehålla %s tecken.",
  length:         "Värdet måste vara mellan %s och %s tecken.",
  mincheck:       "Minst %s val måste göras.",
  maxcheck:       "Maximalt %s val får göras.",
  check:          "Mellan %s och %s val måste göras.",
  equalto:        "Värdena måste vara lika."
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('sv', window.ParsleyConfig.i18n.sv, true);
}));