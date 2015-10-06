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
window.ParsleyConfig.i18n.tr = jQuery.extend(window.ParsleyConfig.i18n.tr || {}, {
  defaultMessage: "Girdiğiniz değer geçerli değil.",
  type: {
    email:        "Geçerli bir e-mail adresi yazmanız gerekiyor.",
    url:          "Geçerli bir bağlantı adresi yazmanız gerekiyor.",
    number:       "Geçerli bir sayı yazmanız gerekiyor.",
    integer:      "Geçerli bir tamsayı yazmanız gerekiyor.",
    digits:       "Geçerli bir rakam yazmanız gerekiyor.",
    alphanum:     "Geçerli bir alfanümerik değer yazmanız gerekiyor."
  },
  notblank:       "Bu alan boş bırakılamaz.",
  required:       "Bu alan boş bırakılamaz.",
  pattern:        "Girdiğiniz değer geçerli değil.",
  min:            "Bu alan %s değerinden büyük ya da bu değere eşit olmalı.",
  max:            "Bu alan %s değerinden küçük ya da bu değere eşit olmalı.",
  range:          "Bu alan %s ve %s değerleri arasında olmalı.",
  minlength:      "Bu alanın uzunluğu %s karakter veya daha fazla olmalı.",
  maxlength:      "Bu alanın uzunluğu %s karakter veya daha az olmalı.",
  length:         "Bu alanın uzunluğu %s ve %s karakter arasında olmalı.",
  mincheck:       "En az %s adet seçim yapmalısınız.",
  maxcheck:       "En fazla %s seçim yapabilirsiniz.",
  check:          "Bu alan için en az %s, en fazla %s seçim yapmalısınız.",
  equalto:        "Bu alanın değeri aynı olmalı."
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('tr', window.ParsleyConfig.i18n.tr, true);
}));