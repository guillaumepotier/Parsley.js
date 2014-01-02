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

    validators: {
      notnull: function () {
        return $.extend(new Validator.Assert().NotNull(), {priority: 2});
      },
      notblank: function () {
        return $.extend(new Validator.Assert().NotBlank(), {priority: 2});
      },
      required: function () {
        return $.extend(new Validator.Assert().Required(), {priority: 512});
      }
    }
  };

  ParsleyValidator.Assert = Validator.Assert;

  return ParsleyValidator;
});
