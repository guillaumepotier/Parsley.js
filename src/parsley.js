//     Parsley.js @@version
//     http://parsleyjs.org
//     (c) 2012-2015 Guillaume Potier, Wisembly
//     Parsley may be freely distributed under the MIT license.

define([

  // ### Requirements

  // Handy third party functions
  'parsley/utils',
  // Parsley default configuration
  'parsley/defaults',
  // An abstract class shared by `ParsleyField` and `ParsleyForm`
  'parsley/abstract',
  // A registry of all Parsley validators (built-in and custom)
  'parsley/validator_registry',
  // `ParsleyUI` static class. Handles all UI and UX
  'parsley/ui',
  // `ParsleyForm` Class. Handles form validation
  'parsley/form',
  // `ParsleyField` Class. Handles field validation
  'parsley/field',
  // `Multiple` Class. Extend `ParsleyField` to generate `ParsleyFieldMultiple`
  'parsley/multiple',
  // Factory to create Parsley instances (Form, Field or FieldMultiple)
  'parsley/factory',
  // Tiny Parsley Pub / Sub mechanism, used for `ParsleyUI` and Listeners
  'parsley/pubsub',
  // Default en constraints messages
  'i18n/en'
], function (ParsleyUtils, ParsleyDefaults, ParsleyAbstract, ParsleyValidatorRegistry, ParsleyUI, ParsleyForm, ParsleyField, ParsleyMultiple, ParsleyFactory) {

  // Inherit `on`, `off` & `trigger` to Parsley:
  var Parsley = $.extend(new ParsleyAbstract(), {
      $element: $(document),
      actualizeOptions: null,
      _resetOptions: null,
      Factory: ParsleyFactory,
      version: '@@version'
    });

  // Supplement ParsleyField and Form with ParsleyAbstract
  // This way, the constructors will have access to those methods
  $.extend(ParsleyField.prototype, ParsleyAbstract.prototype);
  $.extend(ParsleyForm.prototype, ParsleyAbstract.prototype);
  // Inherit actualizeOptions and _resetOptions:
  $.extend(ParsleyFactory.prototype, ParsleyAbstract.prototype);

  // ### jQuery API
  // `$('.elem').parsley(options)` or `$('.elem').psly(options)`
  $.fn.parsley = $.fn.psly = function (options) {
    if (this.length > 1) {
      var instances = [];

      this.each(function () {
        instances.push($(this).parsley(options));
      });

      return instances;
    }

    // Return undefined if applied to non existing DOM element
    if (!$(this).length) {
      ParsleyUtils.warn('You must bind Parsley on an existing element.');

      return;
    }

    return new ParsleyFactory(this, options);
  };

  // ### ParsleyField and ParsleyForm extension
  // Ensure the extension is now defined if it wasn't previously
  if ('undefined' === typeof window.ParsleyExtend)
    window.ParsleyExtend = {};

  // ### Parsley config
  // Inherit from ParsleyDefault, and copy over any existing values
  Parsley.options = $.extend(ParsleyUtils.objectCreate(ParsleyDefaults), window.ParsleyConfig);
  window.ParsleyConfig = Parsley.options; // Old way of accessing global options

  // ### Globals
  window.Parsley = window.psly = Parsley;
  window.ParsleyUtils = ParsleyUtils;

  // ### Define methods that forward to the registry, and deprecate all access except through window.Parsley
  var registry = window.Parsley._validatorRegistry = new ParsleyValidatorRegistry(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);
  window.ParsleyValidator = {};
  $.each('setLocale addCatalog addMessage getErrorMessage formatMessage addValidator updateValidator removeValidator'.split(' '), function (i, method) {
    window.Parsley[method] = $.proxy(registry, method);
    window.ParsleyValidator[method] = function () {
      ParsleyUtils.warnOnce('Accessing the method `'+ method +'` through ParsleyValidator is deprecated. Simply call `window.Parsley.' + method + '(...)`');
      return window.Parsley[method].apply(window.Parsley, arguments);
    };
  });

  // ### ParsleyUI
  // UI is a separate class that only listens to some events and then modifies the DOM accordingly
  // Could be overriden by defining a `window.ParsleyConfig.ParsleyUI` appropriate class (with `listen()` method basically)
  window.ParsleyUI = 'function' === typeof window.ParsleyConfig.ParsleyUI ?
    new window.ParsleyConfig.ParsleyUI().listen() : new ParsleyUI().listen();

  // ### PARSLEY auto-binding
  // Prevent it by setting `ParsleyConfig.autoBind` to `false`
  if (false !== window.ParsleyConfig.autoBind)
    $(function () {
      // Works only on `data-parsley-validate`.
      if ($('[data-parsley-validate]').length)
        $('[data-parsley-validate]').parsley();
    });

  return Parsley;
});
