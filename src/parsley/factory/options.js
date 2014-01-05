define('parsley/factory/options', [
  'parsley/utils'
], function (ParsleyUtils) {
  var ParlseyOptionsFactory = function (defaultOptions, globalOptions, userOptions, namespace) {
    this.__class__ = 'OptionsFactory';

    this.formOptions = null;
    this.fieldOptions = null;

    this.baseOptions = $.extend(true, {}, defaultOptions, globalOptions, userOptions, { namespace: namespace });
  };

  ParlseyOptionsFactory.prototype = {
    get: function (parsleyInstance) {
      if ('undefined' === typeof parsleyInstance.__class__)
        throw new Error('Parsley Instance expected');

      switch (parsleyInstance.__class__) {
        case 'Parsley':
          return this.baseOptions;
        case 'ParsleyForm':
          return this.getParent(parsleyInstance);
        case 'ParsleyField':
          return this.getChild(parsleyInstance);
        default:
          throw new Error('Instance ' + parsleyInstance.__class__ + ' is not supported');
      }
    },

    getParent: function (formInstance) {
      this.formOptions = ParsleyUtils.attr(formInstance.$element, this.baseOptions.namespace);

      return $.extend({}, this.baseOptions, this.formOptions);
    },

    getChild: function (fieldInstance) {
      this.fieldOptions = ParsleyUtils.attr(fieldInstance.$element, this.baseOptions.namespace);

      return $.extend({}, this.baseOptions, this.formOptions, this.fieldOptions);
    }
  };

  return ParlseyOptionsFactory;
});
