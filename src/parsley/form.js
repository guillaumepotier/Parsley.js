define('parsley/form', [
  'parsley/field',
  'parsley/abstract',
  'parsley/utils'
  ], function (ParsleyField, ParsleyAbstract, ParsleyUtils) {
  var ParsleyForm = function(parsleyInstance) {
    this.__class__ = 'ParsleyForm';

    if ('Parsley' !== ParsleyUtils.get(parsleyInstance, '__class__'))
      throw new Error('You must give a Parsley instance');

    this.parsleyInstance = parsleyInstance;
    this.init(parsleyInstance.$element, parsleyInstance.options);
  };

  ParsleyForm.prototype = {
    init: function ($element, options) {
      this.options = options;
      this.$element = $element;

      this.bindFields();
      this.$element.on('submit.' + this.__class__, false, $.proxy(this.validate, this));
    },

    validate: function () {
      this.bindFields();

      for (var i = 0; i < this.fields.length; i++) {
        this.fields[i].validate();
      }
    },

    isValid: function () {
      this.bindFields();

      for (var i = 0; i < this.fields.length; i++)
        if (false === this.fields[i].isValid())
          return false;

      return true;
    },

    bindFields: function () {
      var self = this;
      this.fields = [];

      this.$element.find(this.options.inputs).each(function () {
        self.addField(this);
      });

      return this;
    },

    addField: function (field) {
      this.fields.push($.extend(new ParsleyField(this.parsleyInstance), new ParsleyAbstract()));

      return this;
    },

    removeField: function (field) {},
    addListener: function (listener) {},
    removeListener: function(listener) {},
    updateListener: function(listener) {},
    reset: function () {},
    destroy: function () {}
  };

  return ParsleyForm;
});
