define('parsley/form', [
  'parsley/field'
  ], function (ParsleyField) {
  var ParsleyForm = function(element, options) {
    this.__class__ = 'ParsleyForm';
    this.init(element, options);
  };

  ParsleyForm.prototype = {
    init: function(element, options) {
      this.options= options;
    }
  };

  return ParsleyForm;
});
