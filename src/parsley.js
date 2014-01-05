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
  var Parsley = function (element, options, parsleyInstance) {
    this.__class__ = 'Parsley';
    this.__version__ = '@@version';
    this.__id__ = ParsleyUtils.hash(4);

    if ('undefined' === typeof element)
      throw new Error('You must give an element');

    return this.init($(element), options, parsleyInstance);
  };

  Parsley.prototype = {
    init: function ($element, options, parsleyInstance) {
      this.$element = $element;

      this.OptionsFactory = new ParsleyOptionsFactory(ParsleyDefaultOptions, ParsleyUtils.get(window, 'ParsleyConfig', {}), options, this.getNamespace(options));

      var options = this.OptionsFactory.get(this);
      this.ParsleyValidator = new ParsleyValidator(options);

      if (this.$element.is('form') || ('undefined' !== typeof options.validate && !this.$element.is(options.inputs)))
        return this.bind('parsleyForm', parsleyInstance);

      else if (this.$element.is(options.inputs))
        return this.bind('parsleyField', parsleyInstance);

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

    bind: function (type, parentParsleyInstance) {
      var parsleyInstance = this.$element.data(type);

      // if data never binded, bind it right now!
      if ('undefined' === typeof parsleyInstance) {
        switch (type) {
          case 'parsleyForm':
            parsleyInstance = $.extend(new ParsleyForm(this.$element, parentParsleyInstance || this), new ParsleyAbstract());
            break;
          case 'parsleyField':
            parsleyInstance = $.extend(new ParsleyField(this.$element, parentParsleyInstance || this), new ParsleyAbstract());
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
