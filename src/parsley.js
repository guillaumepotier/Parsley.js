/*!
* @@name
* @@author
* Version @@version - built @@timestamp
* @@license Licensed
*
*/

define([
  'parsley/utils',
  'parsley/defaults',
  'parsley/abstract',
  'parsley/validator',
  'parsley/ui',
  'parsley/factory/options',
  'parsley/form',
  'parsley/field',
  'vendors/requirejs-domready/domReady'
], function(ParsleyUtils, ParsleyDefaultOptions, ParsleyAbstract, ParsleyValidator, ParsleyUI, ParsleyOptionsFactory, ParsleyForm, ParsleyField, domReady) {
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
      var options = this.OptionsFactory.staticOptions;

      this.Validator = new ParsleyValidator(options);

      // a ParsleyForm instance is obviously a <form> elem but also every node that is not an input and have data-parsley-validate attribute
      if (this.$element.is('form') || ('undefined' !== typeof options.validate && !this.$element.is(options.inputs)))
        return this.bind('parsleyForm', parsleyInstance);

      // else every other element that is supported (inputs) and not excluded (excluded) is binded as a ParsleyField
      else if (this.$element.is(options.inputs) && !this.$element.is(options.excluded))
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

  // lightweight pub/sub
  (function($) {
    var o = $({})
      registered = {};

    // $.subscribe(name, callback);
    // $.subscribe(name, contect, callback);
    $.subscribe = function (name) {
      if ('undefined' === typeof registered[name])
        registered[name] = [];

      if ('object' === typeof arguments[1] && 'function' === typeof arguments[2])
        return registered[name].push({'context': arguments[1], 'callback': arguments[2]});

      if ('function' === typeof arguments[1])
        return registered[name].push({'context': undefined, 'callback': arguments[1]})
    };

    $.unsubscribe = function (name) {
      var context, callback;

      if ('undefined' === typeof registered[name])
        return;

      if ('object' === typeof arguments[1] && 'function' === typeof arguments[2]) {
        context = arguments[1];
        callback = arguments[2];
      } else if ('function' === typeof arguments[1])
        callback = arguments[1];
      else
        throw new Error('wrong arguments');

      for (var i = 0; i < registered[name].length; i++)
        if (registered[name][i]['context'] === context && registered[name]['callback'] === callback)
          registered[name].splice(i, 1);
    };

    $.publish = function (name) {
      if ('undefined' === typeof registered[name])
        return;

      for (var i = 0; i < registered[name].length; i++)
        if ('undefined' !== typeof registered[name][i]['context'])
          registered[name][i]['callback'].apply(registered[name][i]['context'], arguments);
        else
          registered[name][i]['callback'].apply(o, arguments);
    };
  }(jQuery));

  // UI is a class apart that only listen to some events and them modify DOM accordingly
  // Could be overriden by defining a window.ParsleyConfig.ParsleyUI appropriate class (with listen method basically)
  ParsleyUI = 'function' === typeof ParsleyUtils.get(window.ParsleyConfig, 'ParsleyUI') ?
    new window.ParsleyConfig.ParsleyUI().listen() : new ParsleyUI().listen();

  // define now some super globals for window
  window.Parsley = window.psly = Parsley;
  window.ParsleyUtils = ParsleyUtils;
  window.ParsleyValidator = new ParsleyValidator().Validator;

  /* PARSLEY auto-binding. Prevent it by setting ParsleyConfig.autoBind to `false`
  * =================================================== */
  if (false !== ParsleyUtils.get(window, 'ParsleyConfig.autoBind'))
    domReady(function () {
      $('[parsley-validate], [data-parsley-validate]').each(function () {
        new Parsley(this);
      });
    });

  return Parsley;
});
