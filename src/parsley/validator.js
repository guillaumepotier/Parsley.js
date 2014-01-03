define('parsley/validator', [
  'validator'
], function (Validator) {
  var ParsleyValidator = function(options) {
    this.__class__ = 'ParsleyValidator';
    this.Validator = Validator;
    this.options = options;
  };

  ParsleyValidator.prototype = {
    validate: function () {
      return new this.Validator.Validator().validate.apply(new Validator.Validator(), arguments);
    },

    addValidator: function (name, fn, priority) {
      this.validators[name] = function (requirements) {
        return $.extend(new Validator.Assert().Callback(fn, requirements), { priority: priority });
      }

      return this;
    },

    updateValidator: function (name, fn, priority) {
      return addValidator(name, fn, priority);
    },

    removeValidator: function (name) {
      delete(this.validators[name]);

      return this;
    },

    validators: {
      notnull: function () {
        return $.extend(new Validator.Assert().NotNull(), { priority: 2 });
      },
      notblank: function () {
        return $.extend(new Validator.Assert().NotBlank(), { priority: 2 });
      },
      required: function () {
        return $.extend(new Validator.Assert().Required(), { priority: 512 });
      },
      type: function (type) {
        switch (type) {
          case 'email':
            return $.extend(new Validator.Assert().Email(), { priority: 256 });
          case 'number':
            return $.extend(new Validator.Assert().Regexp(
              '/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/'), { priority: 256 });
          default:
            throw new Error('validator type `' + type + '` is not supported');
        }
      }
    }
  };

  return ParsleyValidator;
});
