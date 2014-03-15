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
    this.$element = $(element);
  };

  ParsleyForm.prototype = {
    init: function () {
      this.validationResult = null;

      this.options = this.parsleyInstance.OptionsFactory.get(this);

      this._bindFields();

      return this;
    },

    onSubmitValidate: function (event) {
      this.validate(undefined, undefined, event);

      // prevent form submission if validation fails
      if (false === this.validationResult && event instanceof $.Event)
        event.preventDefault();

      return this;
    },

    // @returns boolean
    validate: function (group, force, event) {
      this.submitEvent = event;
      this.validationResult = true;

      var fieldValidationResult = [];

      // Refresh form DOM options and form's fields that could have changed
      this._refreshFields();

      $.emit('parsley:form:validate', this);

      // loop through fields to validate them one by one
      for (var i = 0; i < this.fields.length; i++) {

        // do not validate a field if not the same as given validation group
        if (group && group !== this.fields[i].options.group)
          continue;

        fieldValidationResult = this.fields[i].validate(force);

        if (true !== fieldValidationResult && fieldValidationResult.length > 0 && this.validationResult)
          this.validationResult = false;
      }

      $.emit('parsley:form:validated', this);

      return this.validationResult;
    },

    // Iterate over refreshed fields, and stop on first failure
    isValid: function (group, force) {
      this._refreshFields();

      for (var i = 0; i < this.fields.length; i++) {

        // do not validate a field if not the same as given validation group
        if (group && group !== this.fields[i].options.group)
          continue;

        if (false === this.fields[i].isValid(force))
          return false;
      }

      return true;
    },

    _refreshFields: function () {
      return this.actualizeOptions()._bindFields();
    },

    _bindFields: function () {
      var self = this;
      this.fields = [];

      this.$element.find(this.options.inputs).each(function () {
        var fieldInstance = new window.Parsley(this, {}, self.parsleyInstance);

        // Only add valid and not excluded ParsleyField children
        if ('ParsleyField' === fieldInstance.__class__  && !fieldInstance.$element.is(fieldInstance.options.excluded))
          self.fields.push(fieldInstance);
      });

      return this;
    }
  };

  return ParsleyForm;
});
