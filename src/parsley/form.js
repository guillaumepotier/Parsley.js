define('parsley/form', [
  'parsley/abstract',
  'parsley/utils'
], function (ParsleyAbstract, ParsleyUtils) {
  var ParsleyForm = function (element, domOptions, options) {
    this.__class__ = 'ParsleyForm';
    this.__id__ = ParsleyUtils.generateID();

    this.$element = $(element);
    this.domOptions = domOptions;
    this.options = options;

    this.fields = [];
    this.validationResult = null;
  };

  ParsleyForm.prototype = {
    onSubmitValidate: function (event) {
      this.validate(undefined, undefined, event);

      // prevent form submission if validation fails
      if ((false === this.validationResult || !this._trigger('submit')) && event instanceof $.Event) {
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

      // fire validate event to eventually modify things before very validation
      this._trigger('validate');

      // Refresh form DOM options and form's fields that could have changed
      this._refreshFields();

      this._withoutReactualizingFormOptions(function(){
        // loop through fields to validate them one by one
        for (var i = 0; i < this.fields.length; i++) {

          // do not validate a field if not the same as given validation group
          if (group && !this._isFieldInGroup(this.fields[i], group))
            continue;

          fieldValidationResult = this.fields[i].validate(force);

          if (true !== fieldValidationResult && fieldValidationResult.length > 0 && this.validationResult)
            this.validationResult = false;
        }
      });

      this._trigger(this.validationResult ? 'success' : 'error');
      this._trigger('validated');

      return this.validationResult;
    },

    // Iterate over refreshed fields, and stop on first failure
    isValid: function (group, force) {
      this._refreshFields();

      return this._withoutReactualizingFormOptions(function(){
        for (var i = 0; i < this.fields.length; i++) {

          // do not validate a field if not the same as given validation group
          if (group && !this._isFieldInGroup(this.fields[i], group))
            continue;

          if (false === this.fields[i].isValid(force))
            return false;
        }

        return true;
      });
    },

    _isFieldInGroup: function (field, group) {
      if($.isArray(field.options.group))
        return -1 !== $.inArray(group, field.options.group);
      return field.options.group === group;
    },

    _refreshFields: function () {
      return this.actualizeOptions()._bindFields();
    },

    _bindFields: function () {
      var self = this,
        oldFields = this.fields;

      this.fields = [];
      this.fieldsMappedById = {};

      this._withoutReactualizingFormOptions(function(){
        this.$element.find(this.options.inputs).each(function () {
          var fieldInstance = new window.Parsley(this, {}, self);

          // Only add valid and not excluded `ParsleyField` and `ParsleyFieldMultiple` children
          if (('ParsleyField' === fieldInstance.__class__ || 'ParsleyFieldMultiple' === fieldInstance.__class__) && !fieldInstance.$element.is(fieldInstance.options.excluded))
            if ('undefined' === typeof self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__]) {
              self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__] = fieldInstance;
              self.fields.push(fieldInstance);
            }
        });

        $(oldFields).not(self.fields).each(function () {
          this._trigger('reset');
          // If DOM element is detached or removed from the form, also trigger
          // at the form level:
          if (!jQuery.contains(self.$element[0], this.$element[0])) {
            self.$element.trigger('field:reset.parsley', [this]);
          }
        });
      });
      return this;
    },

    // Internal only.
    // Looping on a form's fields to do validation or similar
    // will trigger reactualizing options on all of them, which
    // in turn will reactualize the form's options.
    // To avoid calling actualizeOptions so many times on the form
    // for nothing, _withoutReactualizingFormOptions temporarily disables
    // the method actualizeOptions on this form while `fn` is called.
    _withoutReactualizingFormOptions: function (fn) {
      var oldActualizeOptions = this.actualizeOptions;
      this.actualizeOptions = $.noop;
      var result = fn.call(this); // Keep the current `this`.
      this.actualizeOptions = oldActualizeOptions;
      return result;
    },

    // Internal only.
    // Shortcut to trigger an event
    // Returns true iff event is not interrupted and default not prevented.
    _trigger: function (eventName) {
      var event = jQuery.Event('form:' + eventName + '.parsley');
      this.$element.trigger(event, [this]);
      return !(event.isDefaultPrevented() || event.isImmediatePropagationStopped() || event.isPropagationStopped());
    }

  };

  return ParsleyForm;
});
