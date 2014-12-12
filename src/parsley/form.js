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
      if (true !== this.validationResult && event instanceof $.Event) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }

      return this;
    },

    // @returns boolean
    validate: function (group, force, event) {
      this.submitEvent = event;

      var fieldValidationResult,
        violationLists = [];

      // Refresh form DOM options and form's fields that could have changed
      this._refreshFields();

      $.emit('parsley:form:validate', this);

      // loop through fields to validate them one by one
      for (var i = 0; i < this.fields.length; i++) {

        // do not validate a field if not the same as given validation group
        if (group && !this._isFieldInGroup(this.fields[i], group))
          continue;

        fieldValidationResult = this.fields[i].validate(force);

        if (true !== fieldValidationResult && fieldValidationResult.length > 0)
          violationLists.push(fieldValidationResult);
      }
      if (violationLists.length > 0) {
        this.validationResult = Array.prototype.concat.apply([], violationLists);
        $.emit('parsley:form:error', this);
      } else {
        this.validationResult = true;
        $.emit('parsley:form:success', this);
      }
      $.emit('parsley:form:validated', this);

      return violationLists.length === 0;
    },

    // Iterate over refreshed fields, and stop on first failure
    isValid: function (group, force) {
      this._refreshFields();

      for (var i = 0; i < this.fields.length; i++) {

        // do not validate a field if not the same as given validation group
        if (group && !this._isFieldInGroup(this.fields[i], group))
          continue;

        if (false === this.fields[i].isValid(force))
          return false;
      }

      return true;
    },

    _isFieldInGroup: function (field, group) {
      if(ParsleyUtils.isArray(field.options.group))
        return -1 !== $.inArray(group, field.options.group);
      return field.options.group === group;
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
