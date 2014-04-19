define('parsley/form', [
  'parsley/abstract',
  'parsley/utils'
], function (ParsleyAbstract, ParsleyUtils) {
  var ParsleyForm = function (element, OptionsFactory) {
    this.__class__ = 'ParsleyForm';
    this.__id__ = ParsleyUtils.hash(4);

    if ('OptionsFactory' !== ParsleyUtils.get(OptionsFactory, '__class__'))
      throw new Error('You must give an OptionsFactory instance');

    this.OptionsFactory = OptionsFactory;
    this.$element = $(element);

    this.validationResult = null;
    this.options = this.OptionsFactory.get(this);
  };

  ParsleyForm.prototype = {
    onSubmitValidate: function (event) {
      this.validate(undefined, undefined, event);

      // prevent form submission if validation fails
      if (false === this.validationResult && event instanceof $.Event) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }

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
      this.fieldsMappedById = {};

      this.$element.find(this.options.inputs).each(function () {
        var fieldInstance = new window.Parsley(this, {}, self);

        // Only add valid and not excluded `ParsleyField` and `ParsleyFieldMultiple` children
        if (('ParsleyField' === fieldInstance.__class__ || 'ParsleyFieldMultiple' === fieldInstance.__class__) && !fieldInstance.$element.is(fieldInstance.options.excluded))
          if ('undefined' === typeof self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__]) {
            self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__] = fieldInstance;
            self.fields.push(fieldInstance);
          }
      });

      return this;
    }
  };

  return ParsleyForm;
});
