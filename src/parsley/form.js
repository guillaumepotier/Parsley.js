define('parsley/form', [
  'parsley/abstract',
  'parsley/utils'
], function (ParsleyAbstract, ParsleyUtils) {
  var ParsleyForm = function(element, parsleyInstance) {
    this.__class__ = 'ParsleyForm';
    this.__id__ = ParsleyUtils.hash(4);

    if ('Parsley' !== ParsleyUtils.get(parsleyInstance, '__class__'))
      throw new Error('You must give a Parsley instance');

    this.parsleyInstance = parsleyInstance;
    this.init($(element));
  };

  ParsleyForm.prototype = {
    init: function ($element) {
      this.$element = $element;
      this.validationResult = null;

      this.options = this.parsleyInstance.OptionsFactory.get(this);

      this.bindFields();
    },

    onSubmitValidate: function (event) {
      this.validate(undefined, event);

      // prevent form submission if validation fails
      if (false === this.validationResult && event instanceof $.Event)
        event.preventDefault();

      return this;
    },

    // @returns boolean
    validate: function (group, event) {
      this.submitEvent = event;
      this.validationResult = true;

      var fieldValidationResult = [];

      this.refreshFields();

      $.emit('parsley:form:validate', this);

      // loop through fields to validate them one by one
      for (var i = 0; i < this.fields.length; i++) {

        // do not validate a field if not the same as given validation group
        if (group && group !== this.fields[i].options.group)
          continue;

        fieldValidationResult = this.fields[i].validate();

        if (true !== fieldValidationResult && fieldValidationResult.length > 0 && this.validationResult)
          this.validationResult = false;
      }

      $.emit('parsley:form:validated', this);

      return this.validationResult;
    },

    // Iterate over refreshed fields, and stop on first failure
    isValid: function (group) {
      this.refreshFields();

      for (var i = 0; i < this.fields.length; i++) {

        // do not validate a field if not the same as given validation group
        if (group && group !== this.fields[i].options.group)
          continue;

        if (false === this.fields[i].isValid())
          return false;
      }

      return true;
    },

    refreshFields: function () {
      return this.actualizeOptions().bindFields();
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
      var fieldInstance = new window.Parsley(field, {}, this.parsleyInstance);

      // only add valid field children
      if ('ParsleyField' === fieldInstance.__class__)
        this.fields.push(fieldInstance);

      return this;
    },

    removeField: function (field) {},
    reset: function () {},
    destroy: function () {}
  };

  return ParsleyForm;
});
