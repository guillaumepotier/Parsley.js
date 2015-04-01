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
  // A proxy between Parsley and [Validator.js](http://validatorjs.org)
  'parsley/validator',
  // `ParsleyUI` static class. Handle all UI and UX
  'parsley/ui',
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
], function (ParsleyUtils, ParsleyDefaults, ParsleyAbstract, ParsleyValidator, ParsleyUI, ParsleyForm, ParsleyField, ParsleyMultiple) {
  // ### Parsley factory
  var Parsley = function (element, options, parsleyFormInstance) {
    this.$element = $(element);

    // If element have already been binded, returns its saved Parsley instance
    var savedparsleyFormInstance = this.$element.data('Parsley');
    if (savedparsleyFormInstance) {

      // If saved instance have been binded without a ParsleyForm parent and there is one given in this call, add it
      if ('undefined' !== typeof parsleyFormInstance && !savedparsleyFormInstance.parent) {
        savedparsleyFormInstance.parent = parsleyFormInstance;
        savedparsleyFormInstance._resetOptions(savedparsleyFormInstance.options);
      }

      return savedparsleyFormInstance;
    }

    // Parsley must be instantiated with a DOM element or jQuery $element
    if (!this.$element.length)
      throw new Error('You must bind Parsley on an existing element.');

    if ('undefined' !== typeof parsleyFormInstance && 'ParsleyForm' !== parsleyFormInstance.__class__)
      throw new Error('Parent instance must be a ParsleyForm instance');

    this.parent = parsleyFormInstance;
    return this.init(options);
  };

  Parsley.prototype = {
    init: function (options) {
      this.__class__ = 'Parsley';
      this.__version__ = '@@version';
      this.__id__ = ParsleyUtils.generateID();

      // Pre-compute options
      this._resetOptions(options);

      // A ParsleyForm instance is obviously a `<form>` elem but also every node that is not an input and have `data-parsley-validate` attribute
      if (this.$element.is('form') || (ParsleyUtils.checkAttr(this.$element, this.options.namespace, 'validate') && !this.$element.is(this.options.inputs)))
        return this.bind('parsleyForm');

      // Every other element is binded as a `ParsleyField` or `ParsleyFieldMultiple`
      return this.isMultiple() ? this.handleMultiple() : this.bind('parsleyField');
    },

    isMultiple: function () {
      return (this.$element.is('input[type=radio], input[type=checkbox]')) || (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple'));
    },

    // Multiples fields are a real nightmare :(
    // Maybe some refacto would be appreciated here...
    handleMultiple: function () {
      var
        that = this,
        name,
        multiple,
        parsleyMultipleInstance;

      // Handle multiple name
      if (this.options.multiple)
        multiple = this.options.multiple;
      else if ('undefined' !== typeof this.$element.attr('name') && this.$element.attr('name').length)
        multiple = name = this.$element.attr('name');
      else if ('undefined' !== typeof this.$element.attr('id') && this.$element.attr('id').length)
        multiple = this.$element.attr('id');

      // Special select multiple input
      if (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple')) {
        return this.bind('parsleyFieldMultiple', multiple || this.__id__);

      // Else for radio / checkboxes, we need a `name` or `data-parsley-multiple` to properly bind it
      } else if (!multiple) {
        ParsleyUtils.warn('To be binded by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.', this.$element);

        return this;
      }

      // Remove special chars
      multiple = multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g, '');

      // Add proper `data-parsley-multiple` to siblings if we have a valid multiple name
      if ('undefined' !== typeof name) {
        $('input[name="' + name + '"]').each(function () {
          if ($(this).is('input[type=radio], input[type=checkbox]'))
            $(this).attr(that.options.namespace + 'multiple', multiple);
        });
      }

      // Check here if we don't already have a related multiple instance saved
      var $previouslyRelated = $('[' + this.options.namespace + 'multiple="' + multiple +'"]');
      for (var i = 0; i < $previouslyRelated.length; i++) {
        parsleyMultipleInstance = $($previouslyRelated.get(i)).data('Parsley');
        if ('undefined' !== typeof parsleyMultipleInstance) {

          if (!this.$element.data('ParsleyFieldMultiple')) {
            parsleyMultipleInstance.addElement(this.$element);
            this.$element.attr(this.options.namespace + 'id', parsleyMultipleInstance.__id__);
          }

          break;
        }
      }

      // Create a secret ParsleyField instance for every multiple field. It would be stored in `data('ParsleyFieldMultiple')`
      // And would be useful later to access classic `ParsleyField` stuff while being in a `ParsleyFieldMultiple` instance
      this.bind('parsleyField', multiple, true);

      return parsleyMultipleInstance || this.bind('parsleyFieldMultiple', multiple);
    },

    // Return proper `ParsleyForm`, `ParsleyField` or `ParsleyFieldMultiple`
    bind: function (type, multiple, doNotStore) {
      var parsleyInstance;

      switch (type) {
        case 'parsleyForm':
          parsleyInstance = $.extend(
            new ParsleyForm(this.$element, this.domOptions, this.options),
            window.ParsleyExtend
          )._bindFields();
          break;
        case 'parsleyField':
          parsleyInstance = $.extend(
            new ParsleyField(this.$element, this.domOptions, this.options, this.parent),
            window.ParsleyExtend
          );
          break;
        case 'parsleyFieldMultiple':
          parsleyInstance = $.extend(
            new ParsleyField(this.$element, this.domOptions, this.options, this.parent),
            new ParsleyMultiple(),
            window.ParsleyExtend
          )._init(multiple);
          break;
        default:
          throw new Error(type + 'is not a supported Parsley type');
      }

      if (multiple)
        ParsleyUtils.setAttr(this.$element, this.options.namespace, 'multiple', multiple);

      if ('undefined' !== typeof doNotStore) {
        this.$element.data('ParsleyFieldMultiple', parsleyInstance);

        return parsleyInstance;
      }

      // Store for later access the freshly binded instance in DOM element itself using jQuery `data()`
      this.$element.data('Parsley', parsleyInstance);

      // Tell the world we got a new ParsleyForm or ParsleyField instance!
      parsleyInstance._trigger('init');

      return parsleyInstance;
    }
  };

  // Supplement ParsleyField and Form with ParsleyAbstract
  // This way, the constructors will have access to those methods
  $.extend(ParsleyField.prototype, ParsleyAbstract.prototype);
  $.extend(ParsleyForm.prototype, ParsleyAbstract.prototype);
  // Inherit actualizeOptions and _resetOptions:
  $.extend(Parsley.prototype, ParsleyAbstract.prototype);

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

    return new Parsley(this, options);
  };

  // ### ParsleyField and ParsleyForm extension
  // Ensure that defined if not already the case
  if ('undefined' === typeof window.ParsleyExtend)
    window.ParsleyExtend = {};

  // ### ParsleyConfig
  // Inherit from ParsleyDefault, and copy over any existing values
  window.ParsleyConfig = $.extend(ParsleyUtils.objectCreate(ParsleyDefaults), window.ParsleyConfig);

  // ### ParsleyUI
  // UI is a class apart that only listen to some events and them modify DOM accordingly
  // Could be overriden by defining a `window.ParsleyConfig.ParsleyUI` appropriate class (with `listen()` method basically)
  window.ParsleyUI = 'function' === typeof window.ParsleyConfig.ParsleyUI ?
    new window.ParsleyConfig.ParsleyUI().listen() : new ParsleyUI().listen();

  // ### Globals
  window.Parsley = window.psly = Parsley;
  window.ParsleyUtils = ParsleyUtils;
  window.ParsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);

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
