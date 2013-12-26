define('parsley/field', function () {
  var Field = function(element, options) {
    this.__class__ = 'Field';
    this.init(element, options);
  };

  Field.prototype = {
    init: function(element, options) {
      this.options= options;
    }
  };

  return Field;
});
