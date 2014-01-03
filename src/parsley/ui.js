define('parsley/ui', function () {
  var ParsleyUI = function(options) {
    this.__class__ = 'ParsleyUI';
    this.init(options);
  };

  ParsleyUI.prototype = {
    init: function(options) {
      this.options= options;
    }
  };

  return ParsleyUI;
});
