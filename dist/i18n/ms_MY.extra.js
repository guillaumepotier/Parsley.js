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
window.ParsleyConfig.i18n.ms_MY = jQuery.extend(window.ParsleyConfig.i18n.ms_MY || {}, {
  dateiso:  "Nilai hendaklah berbentuk tarikh yang sah (YYYY-MM-DD).",
  minwords: "Ayat terlalu pendek. Ianya perlu sekurang-kurangnya %s patah perkataan.",
  maxwords: "Ayat terlalu panjang. Ianya tidak boleh melebihi %s patah perkataan.",
  words:    "Panjang ayat tidak sah. Jumlah perkataan adalah diantara %s hingga %s patah perkataan.",
  gt:       "Nilai lebih besar diperlukan.",
  gte:      "Nilai hendaklah lebih besar atau sama.",
  lt:       "Nilai lebih kecil diperlukan.",
  lte:      "Nilai hendaklah lebih kecil atau sama."
});
}));