/*!
* Parsley.js
* <guillaume@wisembly.com>
* MIT Licenced
*
*/

define('src/parsley', [
  'validator',
  'parsley/form',
  'parsley/field',
  'parsley/ui',
  'parsley/utils',
  'parsley/defaults',
  'domReady'
], function(Validator, ParsleyForm, ParsleyForm, ParsleyUI, ParsleyUtils, ParsleyDefaultOptions, domReady) {
  var Parsley = function (element, options) {
    this.__class__ = 'Parsley';

    if ('undefined' === typeof element)
      return this;

    return this.init($(element), options);
  };

  Parsley.prototype = {
    init: function ($element, options) {
      this.$element = $element;
      this.namespace = this.getNamespace(options);
      this.options = this.getOptions(options, this.namespace);

      // if a form elem is given, bind all its input children
      if (this.$element.is('form') || 'undefined' !== typeof ParsleyUtils.attr(this.namespace)['bind']) {
        return this.bind('parsleyForm');

      // if it is a Parsley supported single element, bind it too, except inputs type hidden
      // add here a return instance, cuz' we could call public methods on single elems with data[ option ]() above
      } else if (this.$element.is(this.options.inputs)) {
        return this.bind('parsleyField');
      }
    },

    getNamespace: function (options) {
      return 'undefined' !== typeof this.$element.data('parsleyNamespace') ?
        this.$element.data('parsleyNamespace') : ('undefined' !== typeof options && 'undefined' !== typeof options.namespace ?
          options.namespace : ParsleyDefaultOptions.namespace);
    },

    getOptions: function (options, namespace) {
      return $.extend(true, {}, ParsleyDefaultOptions, 'undefined' !== typeof window.ParsleyConfig ? window.ParsleyConfig : {}, options, ParsleyUtils.attr(namespace));
    },

    bind: function (type) {
      var parsleyInstance = this.$element.data(type);

      // if data never binded, bind it right now!
      if ('undefined' !== parsleyInstance) {
        switch (type) {
          case 'parsleyForm':
            parsleyInstance = new ParsleyForm(this.$element, this.options);
            break;
          case 'parsleyField':
            parsleyInstance = new ParsleyField(this.$element, this.options);
            break;
          default:
            throw new Error(type + 'is not a supported Parsley type');
        }

        this.$element.data(type, parsleyInstance);
      }

      return parsleyInstance;
    }
  };

  /* PARSLEY auto-binding
  * =================================================== */
  domReady(function () {
    $('[parsley-validate], [data-parsley-validate]').each(function () {
      new Parsley(this);
    });
  });

  return (window.Parsley = window.psly = Parsley);
});
