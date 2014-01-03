define('parsley/validator', [
  'validator'
], function (Validator) {
  var ParsleyValidator = function(options) {
    this.__class__ = 'ParsleyValidator';
    this.init(options);
  };

  ParsleyValidator.prototype = {
    init: function(options) {
      this.options= options;
    },

    validate: function () {
      return new Validator.Validator().validate.apply(new Validator.Validator(), arguments);
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
            throw new Error('validator type ' + type + ' is not supported');
        }
      }
    }
  };

  return ParsleyValidator;
});
