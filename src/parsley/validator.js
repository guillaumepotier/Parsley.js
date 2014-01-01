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
    }
  };

  return ParsleyValidator;
});
