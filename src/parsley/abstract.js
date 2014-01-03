define('parsley/abstract', function () {
  var ParsleyAbstract = function(options) {
  };

  ParsleyAbstract.prototype = {
    registerValidator: function (name, fn, priority) {
      this.parsleyInstance.ParsleyValidator.addValidator(name, fn, priority);

      return this;
    }
  };

  return ParsleyAbstract;
});
