define('parsley/factory/options', [
  'parsley/utils'
], function (ParsleyUtils) {
  var ParsleyOptionsFactory = function (defaultOptions, globalOptions, userOptions, namespace) {
    this.__class__ = 'OptionsFactory';
    this.__id__ = ParsleyUtils.hash(4);

    this.formOptions = null;
    this.fieldOptions = null;

    this.staticOptions = $.extend(true, {}, defaultOptions, globalOptions, userOptions, { namespace: namespace });
  };

  ParsleyOptionsFactory.prototype = {
    get: function (parsleyInstance) {
      if ('undefined' === typeof parsleyInstance.__class__)
        throw new Error('Parsley Instance expected');

      switch (parsleyInstance.__class__) {
        case 'Parsley':
          return this.staticOptions;
        case 'ParsleyForm':
          return this.getFormOptions(parsleyInstance);
        case 'ParsleyField':
        case 'ParsleyFieldMultiple':
          return this.getFieldOptions(parsleyInstance);
        default:
          throw new Error('Instance ' + parsleyInstance.__class__ + ' is not supported');
      }
    },

    getFormOptions: function (formInstance) {
      this.formOptions = ParsleyUtils.attr(formInstance.$element, this.staticOptions.namespace);

      // not deep extend, since formOptions is a 1 level deep object
      return $.extend({}, this.staticOptions, this.formOptions);
    },

    getFieldOptions: function (fieldInstance) {
      this.fieldOptions = ParsleyUtils.attr(fieldInstance.$element, this.staticOptions.namespace);

      if (null === this.formOptions && 'undefined' !== typeof fieldInstance.parent)
        this.formOptions = this.getFormOptions(fieldInstance.parent);

      // not deep extend, since formOptions and fieldOptions is a 1 level deep object
      return $.extend({}, this.staticOptions, this.formOptions, this.fieldOptions);
    }
  };

  return ParsleyOptionsFactory;
});
