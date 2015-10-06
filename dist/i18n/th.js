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
window.ParsleyConfig.i18n.th = jQuery.extend(window.ParsleyConfig.i18n.th || {}, {
  defaultMessage: "ค่านี้ดูเหมือนว่าจะไม่ถูกต้อง",
  type: {
    email:        "ค่านี้ควรจะเป็นอีเมลที่ถูกต้อง",
    url:          "ค่านี้ควรจะเป็น url ที่ถูกต้อง",
    number:       "ค่านี้ควรจะเป็นตัวเลขที่ถูกต้อง",
    integer:      "ค่านี้ควรจะเป็นจำนวนเต็มที่ถูกต้อง",
    digits:       "ค่านี้ควรเป็นทศนิยมที่ถูกต้อง",
    alphanum:     "ค่านี้ควรเป็นอักขระตัวอักษรหรือตัวเลขที่ถูกต้อง"
  },
  notblank:       "ค่านี้ไม่ควรจะว่าง",
  required:       "ค่านี้จำเป็น",
  pattern:        "ค่านี้ดูเหมือนว่าจะไม่ถูกต้อง",
  min:            "ค่านี้ควรมากกว่าหรือเท่ากับ %s.",
  max:            "ค่านี้ควรจะน้อยกว่าหรือเท่ากับ %s.",
  range:          "ค่ายี้ควรจะอยู่ระหว่าง %s และ %s.",
  minlength:      "ค่านี้สั้นเกินไป ควรจะมี %s อักขระหรือมากกว่า",
  maxlength:      "ค่านี้ยาวเกินไป ควรจะมี %s อักขระหรือน้อยกว่า",
  length:         "ความยาวของค่านี้ไม่ถูกต้อง ควรมีความยาวอยู่ระหว่าง %s และ %s อักขระ",
  mincheck:       "คุณควรเลือกอย่างน้อย %s ตัวเลือก",
  maxcheck:       "คุณควรเลือก %s ตัวเลือกหรือน้อยกว่า",
  check:          "คุณควรเลือกระหว่าง %s และ %s ตัวเลือก",
  equalto:        "ค่านี้ควรจะเหมือนกัน"
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('th', window.ParsleyConfig.i18n.th, true);
}));