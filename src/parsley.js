//     Parsley.js @@version
//     http://parsleyjs.org
//     (c) 20012-2014 Guillaume Potier, Wisembly
//     Parsley may be freely distributed under the MIT license.

define([

  // ### Requirements

  // Handy third party functions
  'parsley/utils',
  // Parsley default configuration
  'parsley/defaults',
  // An abstract class shared by `ParsleyField` and `ParsleyForm`
  'parsley/abstract',
  // A proxy between Parsley and [Validator.js](http://validatorjs.org)
  'parsley/validator',
  // `ParsleyUI` static class. Handle all UI and UX
  'parsley/ui',
  // Handle default javascript config and DOM-API config
  'parsley/factory/options',
  // `ParsleyForm` Class. Handle form validation
  'parsley/form',
  // `ParsleyField` Class. Handle field validation
  'parsley/field',
  // `Multiple` Class. Extend `ParsleyField` to generate `ParsleyFieldMultiple`
  'parsley/multiple',
  // Tiny Parsley Pub / Sub mechanism, used for `ParsleyUI` and Listeners
  'parsley/pubsub',
  // Default en constraints messages
  'i18n/en'
], function (ParsleyUtils, ParsleyDefaults, ParsleyAbstract, ParsleyValidator, ParsleyUI, ParsleyOptionsFactory, ParsleyForm, ParsleyField, ParsleyMultiple) {
  // ### Parsley factory
  var Parsley = function (element, options, parsleyInstance) {
    this.__class__ = 'Parsley';
    this.__version__ = '@@version';
    this.__id__ = ParsleyUtils.hash(4);

    // Parsley must be instanciated with a DOM element or jQuery $element
    if ('undefined' === typeof element)
      throw new Error('You must give an element');

    return this.init($(element), options, parsleyInstance);
  };

  Parsley.prototype = {
    init: function ($element, options, parsleyInstance) {
      if (!$element.length)
        throw new Error('You must bind Parsley on an existing element.');

      this.$element = $element;

      // If element have already been binded, returns its saved Parsley instance
      if (this.$element.data('Parsley')) {
        var savedParsleyInstance = this.$element.data('Parsley');

        // If saved instance have been binded without a ParsleyForm parent and there is one given in this call, add it
        if ('undefined' !== typeof parsleyInstance && 'ParsleyField' === savedParsleyInstance.parsleyInstance.__proxy__)
          savedParsleyInstance.parsleyInstance = parsleyInstance;

        return savedParsleyInstance;
      }

      // Handle 'static' options
      this.OptionsFactory = new ParsleyOptionsFactory(ParsleyDefaults, ParsleyUtils.get(window, 'ParsleyConfig', {}), options, this.getNamespace(options));
      options = this.OptionsFactory.get(this);

      // A ParsleyForm instance is obviously a `<form>` elem but also every node that is not an input and have `data-parsley-validate` attribute
      if (this.$element.is('form') || (ParsleyUtils.attr(this.$element, options.namespace, 'validate') && !this.$element.is(options.inputs))) {
        return this.bind('parsleyForm', parsleyInstance);

      // Else every other element that is supported is binded as a `ParsleyField`
      } else if (this.$element.is(options.inputs)) {

        if ((this.$element.is('input[type=radio], input[type=checkbox]') && 'undefined' === typeof options.multiple) || (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple'))) {
          if ('undefined' !== typeof this.$element.attr('name') && this.$element.attr('name').length)
            options.multiple = this.$element.attr('name');
          else if ('undefined' !== typeof this.$element.attr('id') && this.$element.attr('id').length)
            options.multiple = this.$element.attr('id');

          if ('undefined' === typeof options.multiple) {
            if (window.console && window.console.warn)
              window.console.warn('To be binded by Parsley, a radio, a checkbox and a multiple select input must have either a name, and id or a multiple option.', this.$element);

            return this;
          }

          options.multiple = options.multiple.replace(/(:|\.|\[|\]|\$)/g, '');

          return this.bind('parsleyFieldMultiple', parsleyInstance, options.multiple);
        }

        return this.bind('parsleyField', parsleyInstance);
      }

      return this;
    },

    // Retrieve namespace used for DOM-API
    getNamespace: function (options) {
      // `data-parsley-namespace=<namespace>`
      if ('undefined' !== typeof this.$element.data('parsleyNamespace'))
        return this.$element.data('parsleyNamespace');
      if ('undefined' !== typeof ParsleyUtils.get(options, 'namespace'))
        return options.namespace;
      if ('undefined' !== typeof ParsleyUtils.get(window, 'ParsleyConfig.namespace'))
        return window.ParsleyConfig.namespace;

      return ParsleyDefaults.namespace;
    },

    // Return proper `ParsleyForm`, `ParsleyField` or `ParsleyFieldMultiple`
    bind: function (type, parentParsleyInstance, multiple) {
      var parsleyInstance;

      switch (type) {
        case 'parsleyForm':
          parsleyInstance = $.extend(
            new ParsleyForm(this.$element, parentParsleyInstance || this),
            new ParsleyAbstract(),
            window.ParsleyExtend
          ).init();
          break;
        case 'parsleyField':
          parsleyInstance = $.extend(
            new ParsleyField(this.$element, parentParsleyInstance || this),
            new ParsleyAbstract(),
            window.ParsleyExtend
          ).init();
          break;
        case 'parsleyFieldMultiple':
          parsleyInstance = $.extend(
            new ParsleyField(this.$element, parentParsleyInstance || this),
            new ParsleyAbstract(),
            new ParsleyMultiple(),
            window.ParsleyExtend
          ).init(multiple);
          break;
        default:
          throw new Error(type + 'is not a supported Parsley type');
      }

      if ('ParsleyForm' === parsleyInstance.__class__ || 'ParsleyField' === parsleyInstance.__class__) {
        // Store for later access the freshly binded instance in DOM element itself using jQuery `data()`
        this.$element.data('Parsley', parsleyInstance);
        this.__proxy__ = parsleyInstance.__class__;

        // Tell the world we got a new ParsleyForm or ParsleyField instance!
        $.emit('parsley:' + ('parsleyForm' === type ? 'form' : 'field') + ':init', parsleyInstance);
      }

      return parsleyInstance;
    }
  };

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
      if (window.console && window.console.warn)
        window.console.warn('You must bind Parsley on an existing element.');

      return;
    }

    return new Parsley(this, options);
  };

  // ### ParsleyUI
  // UI is a class apart that only listen to some events and them modify DOM accordingly
  // Could be overriden by defining a `window.ParsleyConfig.ParsleyUI` appropriate class (with `listen()` method basically)
  window.ParsleyUI = 'function' === typeof ParsleyUtils.get(window.ParsleyConfig, 'ParsleyUI') ?
    new window.ParsleyConfig.ParsleyUI().listen() : new ParsleyUI().listen();

  // ### ParsleyField and ParsleyForm extension
  // Ensure that defined if not already the case
  if ('undefined' === typeof window.ParsleyExtend)
    window.ParsleyExtend = {};

  // ### ParsleyConfig
  // Ensure that defined if not already the case
  if ('undefined' === typeof window.ParsleyConfig)
    window.ParsleyConfig = {};

  // ### Globals
  window.Parsley = window.psly = Parsley;
  window.ParsleyUtils = ParsleyUtils;
  window.ParsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);

  // ### PARSLEY auto-binding
  // Prevent it by setting `ParsleyConfig.autoBind` to `false`
  if (false !== ParsleyUtils.get(window, 'ParsleyConfig.autoBind'))
    $(document).ready(function () {
      // Works only on `data-parsley-validate`.
      $('[data-parsley-validate]').parsley();
    });

  return Parsley;
});
