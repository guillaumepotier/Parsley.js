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
window.ParsleyConfig.i18n.ja = jQuery.extend(window.ParsleyConfig.i18n.ja || {}, {
  defaultMessage: "無効な値です。",
  type: {
    email:        "正しいメールアドレスを入力してください。",
    url:          "正しいURLを入力してください。",
    number:       "正しい数字を入力してください。",
    integer:      "正しい数値を入力してください。",
    digits:       "正しい桁数で入力してください。",
    alphanum:     "正しい英数字を入力してください。"
  },
  notblank:       "この値を入力してください",
  required:       "この値は必須です。",
  pattern:        "この値は無効です。",
  min:            "%s 以上の値にしてください。",
  max:            "%s 以下の値にしてください。",
  range:          "%s から %s の値にしてください。",
  minlength:      "%s 文字以上で入力してください。",
  maxlength:      "%s 文字以下で入力してください。",
  length:         "%s から %s 文字の間で入力してください。",
  mincheck:       "%s 個以上選択してください。",
  maxcheck:       "%s 個以下選択してください。",
  check:          "%s から %s 個選択してください。",
  equalto:        "値が違います。"
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('ja', window.ParsleyConfig.i18n.ja, true);
}));