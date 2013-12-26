define('parsley/form', [
  "parsley/field"
  ], function (Field) {
  var Form = function(element, options) {
    this.__class__ = 'Form';
    this.init(element, options);
  };

  Form.prototype = {
    init: function(element, options) {
      this.options= options;
    }
  };

  return Form;
});
