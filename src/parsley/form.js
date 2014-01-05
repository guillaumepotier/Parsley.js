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
    this.init(parsleyInstance.$element);
  };

  ParsleyForm.prototype = {
    init: function ($element) {
      this.$element = $element;
      this.validationResult = null;

      this.options = this.parsleyInstance.OptionsFactory.get(this);

      this.bindFields();
      this.$element.on('submit.' + this.__class__, false, $.proxy(this.validate, this));
    },

    validate: function (event) {
      var isValid = true,
        focusedField = false;

      this.bindFields();

      for (var i = 0; i < this.fields.length; i++) {
        isValid = isValid && this.fields[i].validate();

        if (!isValid && (!focusedField && 'first' === this.options.focus || 'last' === this.options.focus))
          focusedField = this.fields[i];
      }

      // form validation listener.
      // form submission can be prevented here too, event if form is valid
      this.options.onFormValidate(isValid, event, this);

      // prevent form submission if validation fails
      if (false === isValid)
        event.preventDefault();

      // TODO animate
      // focus on an error field
      if ('none' !== this.options.focus && false !== focusedField)
        focusedField.$element.focus();

      return this;
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
    reset: function () {},
    destroy: function () {}
  };

  return ParsleyForm;
});
