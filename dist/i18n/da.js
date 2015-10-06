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
window.ParsleyConfig.i18n.da = jQuery.extend(window.ParsleyConfig.i18n.da || {}, {
  defaultMessage: "Indtast venligst en korrekt værdi.",
  type: {
    email:        "Indtast venligst en korrekt emailadresse.",
    url:          "Indtast venligst en korrekt internetadresse.",
    number:       "Indtast venligst et tal.",
    integer:      "Indtast venligst et heltal.",
    digits:       "Dette felt må kun bestå af tal.",
    alphanum:     "Dette felt skal indeholde både tal og bogstaver."
  },
  notblank:       "Dette felt må ikke være tomt.",
  required:       "Dette felt er påkrævet.",
  pattern:        "Ugyldig indtastning.",
  min:            "Dette felt skal indeholde et tal som er større end eller lig med %s.",
  max:            "Dette felt skal indeholde et tal som er mindre end eller lig med %s.",
  range:          "Dette felt skal indeholde et tal mellem %s og %s.",
  minlength:      "Indtast venligst mindst %s tegn.",
  maxlength:      "Dette felt kan højst indeholde %s tegn.",
  length:         "Længden af denne værdi er ikke korrekt. Værdien skal være mellem %s og %s tegn lang.",
  mincheck:       "Vælg mindst %s muligheder.",
  maxcheck:       "Vælg op til %s muligheder.",
  check:          "Vælg mellem %s og %s muligheder.",
  equalto:        "De to felter er ikke ens."
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('da', window.ParsleyConfig.i18n.da, true);
}));