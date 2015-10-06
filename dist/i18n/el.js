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
window.ParsleyConfig.i18n.el = jQuery.extend(window.ParsleyConfig.i18n.el || {}, {
  defaultMessage: "Η τιμή φαίνεται να είναι μη έγκυρη.",
  type: {
    email:        "Η τιμή πρέπει να είναι ένα έγκυρο email.",
    url:          "Η τιμή πρέπει να είναι ένα έγκυρο url.",
    number:       "Η τιμή πρέπει να είναι ένας έγκυρος αριθμός.",
    integer:      "Η τιμή πρέπει να είναι ένας έγκυρος ακέραιος.",
    digits:       "Η τιμή πρέπει να είναι ψηφία.",
    alphanum:     "Η τιμή πρέπει να είναι αλφαριθμητικό."
  },
  notblank:       "Η τιμή δεν πρέπει να είναι κενή.",
  required:       "Η τιμή αυτή απαιτείται.",
  pattern:        "Η τιμή φαίνεται να είναι μη έγκυρη.",
  min:            "Η τιμή πρέπει να είναι μεγαλύτερη ή ίση με %s.",
  max:            "Η τιμή πρέπει να είναι μικρότερη ή ίση με %s.",
  range:          "Η τιμή πρέπει να είναι μεταξύ %s και %s.",
  minlength:      "Το κείμενο είναι πολύ μικρό. Πρέπει να είναι %s ή και περισσότεροι χαρακτήρες.",
  maxlength:      "Η κείμενο είναι πολύ μεγάλο. Πρέπει να είναι %s ή και λιγότεροι χαρακτήρες.",
  length:         "Το μήκος του κειμένου είναι μη έγκυρο. Πρέπει να είναι μεταξύ %s και %s χαρακτήρων.",
  mincheck:       "Πρέπει να επιλέξετε τουλάχιστον %s επιλογές.",
  maxcheck:       "Πρέπει να επιλέξετε %s ή λιγότερες επιλογές.",
  check:          "Πρέπει να επιλέξετε μεταξύ %s και %s επίλογων.",
  equalto:        "Η τιμή πρέπει να είναι η ίδια."
});
// If file is loaded after Parsley main file, auto-load locale
if ('undefined' !== typeof window.ParsleyValidator)
  window.ParsleyValidator.addCatalog('el', window.ParsleyConfig.i18n.el, true);
}));