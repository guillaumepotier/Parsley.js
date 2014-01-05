/*!
* @@name
* @@author
* Version @@version - built @@timestamp
* @@license Licensed
*
*/

define([
  'parsley/form',
  'parsley/field',
  'parsley/utils',
  'parsley/defaults',
  'parsley/abstract',
  'parsley/validator',
  'parsley/factory/options',
  'vendors/requirejs-domready/domReady'
], function(ParsleyForm, ParsleyField, ParsleyUtils, ParsleyDefaultOptions, ParsleyAbstract, ParsleyValidator, ParsleyOptionsFactory, domReady) {
  var Parsley = function (element, options) {
    this.__class__ = 'Parsley';
    this.__version__ = '@@version';

    if ('undefined' === typeof element)
      throw new Error('You must give an element');

    return this.init($(element), options);
  };

  Parsley.prototype = {
    init: function ($element, options) {
      this.$element = $element;
      this.namespace = this.getNamespace(options);

      this.OptionsFactory = new ParsleyOptionsFactory(ParsleyDefaultOptions, ParsleyUtils.get(window, 'ParsleyConfig', {}), options, this.namespace);
      this.options = this.OptionsFactory.get(this);

      this.ParsleyValidator = new ParsleyValidator(this.Options);

      if (this.$element.is('form') || ('undefined' !== typeof this.options.validate && !this.$element.is(this.options.inputs)))
        return this.bind('parsleyForm');

      else if (this.$element.is(this.options.inputs))
        return this.bind('parsleyField');

      return this;
    },

    getNamespace: function (options) {
      if ('undefined' !== typeof this.$element.data('parsleyNamespace'))
          return this.$element.data('parsleyNamespace');
      if ('undefined' !== typeof ParsleyUtils.get(options, 'namespace'))
          return options.namespace;
      if ('undefined' !== typeof ParsleyUtils.get(window, 'ParsleyConfig.namespace'))
          return window.ParsleyConfig.namespace;

      return ParsleyDefaultOptions.namespace;
    },

    bind: function (type) {
      var parsleyInstance = this.$element.data(type);

      // if data never binded, bind it right now!
      if ('undefined' === typeof parsleyInstance) {
        switch (type) {
          case 'parsleyForm':
            parsleyInstance = $.extend(new ParsleyForm(this), new ParsleyAbstract());
            break;
          case 'parsleyField':
            parsleyInstance = $.extend(new ParsleyField(this), new ParsleyAbstract());
            break;
          default:
            throw new Error(type + 'is not a supported Parsley type');
        }

        this.$element.data(type, parsleyInstance);
      }

      return parsleyInstance;
    }
  };

  /* jQuery plugin API */
  $.fn.parsley = function (options) {
    return new Parsley(this, options);
  };

  /* PARSLEY auto-binding. Prevent it by setting ParsleyConfig.autoBind to false
  * =================================================== */
  if (false !== ParsleyUtils.get(window, 'ParsleyConfig.autoBind'))
    domReady(function () {
      $('[parsley-validate], [data-parsley-validate]').each(function () {
        new Parsley(this);
      });
    });

  window.ParsleyUtils = ParsleyUtils;
  window.ParsleyValidator = new ParsleyValidator().Validator;

  return (window.Parsley = window.psly = Parsley);
});
