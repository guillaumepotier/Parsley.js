define('parsley/ui', function () {
  var UI = function(options) {
    this.__class__ = 'UI';
    this.init(options);
  };

  UI.prototype = {
    init: function(options) {
      this.options= options;
    }
  };

  return UI;
});
