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
window.ParsleyConfig.i18n.ms_MY = jQuery.extend(window.ParsleyConfig.i18n.ms_MY || {}, {
  defaultMessage: "Nilai tidak sah.",
  type: {
    email:        "Nilai mestilah dalam format emel yang sah.",
    url:          "Nilai mestilah dalam bentuk url yang sah.",
    number:       "Hanya nombor dibenarkan.",
    integer:      "Hanya integer dibenarkan.",
    digits:       "Hanya angka dibenarkan.",
    alphanum:     "Hanya alfanumerik dibenarkan."
  },
  notblank:       "Nilai ini tidak boleh kosong.",
  required:       "Nilai ini wajib diisi.",
  pattern:        "Bentuk nilai ini tidak sah.",
  min:            "Nilai perlu lebih besar atau sama dengan %s.",
  max:            "Nilai perlu lebih kecil atau sama dengan %s.",
  range:          "Nilai perlu berada antara %s hingga %s.",
  minlength:      "Nilai terlalu pendek. Ianya perlu sekurang-kurangnya %s huruf.",
  maxlength:      "Nilai terlalu panjang. Ianya tidak boleh melebihi %s huruf.",
  length:         "Panjang nilai tidak sah. Panjangnya perlu diantara %s hingga %s huruf.",
  mincheck:       "Anda mesti memilih sekurang-kurangnya %s pilihan.",
  maxcheck:       "Anda tidak boleh memilih lebih daripada %s pilihan.",
  check:          "Anda mesti memilih diantara %s hingga %s pilihan.",
  equalto:        "Nilai dimasukkan hendaklah sama."
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('ms_MY', window.ParsleyConfig.i18n.ms_MY, true);
}));