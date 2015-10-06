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
window.ParsleyConfig.i18n.fi = jQuery.extend(window.ParsleyConfig.i18n.fi || {}, {
  defaultMessage: "Sy&ouml;tetty arvo on virheellinen.",
  type: {
    email:        "S&auml;hk&ouml;postiosoite on virheellinen.",
    url:          "Url-osoite on virheellinen.",
    number:       "Sy&ouml;t&auml; numero.",
    integer:      "Sy&ouml;t&auml; kokonaisluku.",
    digits:       "Sy&ouml;t&auml; ainoastaan numeroita.",
    alphanum:     "Sy&ouml;t&auml; ainoastaan kirjaimia tai numeroita."
  },
  notblank:       "T&auml;m&auml; kentt&auml;&auml; ei voi j&auml;tt&auml;&auml; tyhj&auml;ksi.",
  required:       "T&auml;m&auml; kentt&auml; on pakollinen.",
  pattern:        "Sy&ouml;tetty arvo on virheellinen.",
  min:            "Sy&ouml;t&auml; arvo joka on yht&auml; suuri tai suurempi kuin %s.",
  max:            "Sy&ouml;t&auml; arvo joka on pienempi tai yht&auml; suuri kuin %s.",
  range:          "Sy&ouml;t&auml; arvo v&auml;lilt&auml;: %s-%s.",
  minlength:      "Sy&ouml;tetyn arvon t&auml;ytyy olla v&auml;hint&auml;&auml;n %s merkki&auml; pitk&auml;.",
  maxlength:      "Sy&ouml;tetty arvo saa olla enint&auml;&auml;n %s merkki&auml; pitk&auml;.",
  length:         "Sy&ouml;tetyn arvon t&auml;ytyy olla v&auml;hint&auml;&auml;n %s ja enint&auml;&auml;n %s merkki&auml; pitk&auml;.",
  mincheck:       "Valitse v&auml;hint&auml;&auml;n %s vaihtoehtoa.",
  maxcheck:       "Valitse enint&auml;&auml;n %s vaihtoehtoa.",
  check:          "Valitse %s-%s vaihtoehtoa.",
  equalto:        "Salasanat eiv&auml;t t&auml;sm&auml;&auml;."
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('fi', window.ParsleyConfig.i18n.fi, true);
}));