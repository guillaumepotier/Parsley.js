define('parsley/field', function () {
  var ParsleyField = function(element, options) {
    this.__class__ = 'ParsleyField';
    this.init(element, options);
  };

  ParsleyField.prototype = {
    init: function(element, options) {
      this.options= options;
    }
  };

  return ParsleyField;
});
