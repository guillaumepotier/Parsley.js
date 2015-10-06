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
window.ParsleyConfig.i18n.el = jQuery.extend(window.ParsleyConfig.i18n.el || {}, {
  dateiso:  "Η τιμή πρέπει να είναι μια έγκυρη ημερομηνία (YYYY-MM-DD).",
  minwords: "Το κείμενο είναι πολύ μικρό. Πρέπει να έχει %s ή και περισσότερες λέξεις.",
  maxwords: "Το κείμενο είναι πολύ μεγάλο. Πρέπει να έχει %s ή και λιγότερες λέξεις.",
  words:    "Το μήκος του κειμένου είναι μη έγκυρο. Πρέπει να είναι μεταξύ %s και %s λεξεων.",
  gt:       "Η τιμή πρέπει να είναι μεγαλύτερη.",
  gte:      "Η τιμή πρέπει να είναι μεγαλύτερη ή ίση.",
  lt:       "Η τιμή πρέπει να είναι μικρότερη.",
  lte:      "Η τιμή πρέπει να είναι μικρότερη ή ίση.",
  notequalto: "Η τιμή πρέπει να είναι διαφορετική."
});
}));