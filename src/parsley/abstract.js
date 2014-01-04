define('parsley/abstract', function () {
  var ParsleyAbstract = function(options) {};

  ParsleyAbstract.prototype = {
    registerValidator: function (name, fn, priority) {
      this.parsleyInstance.ParsleyValidator.addValidator(name, fn, priority);

      return this;
    },
    removeValidator: function (name) {},
    updateValidator: function (name, fn, priority) {
      return this.registerValidator(name, fn, priority);
    },
    addListener: function (listener) {},
    removeListener: function(listener) {},
    updateListener: function(listener) {}
  };

  return ParsleyAbstract;
});
