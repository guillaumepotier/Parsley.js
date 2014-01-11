define('parsley/abstract', function () {
  var ParsleyAbstract = function(options) {};

  ParsleyAbstract.prototype = {
    actualizeOptions: function () {
      this.options = this.parsleyInstance.OptionsFactory.get(this);

      return this;
    },

    registerValidator: function (name, fn, priority) {
      this.parsleyInstance.Validator.addValidator(name, fn, priority);

      return this;
    },

    removeValidator: function (name) {
      this.parsleyInstance.Validator.removeValidator(name);

      return this;
    },

    updateValidator: function (name, fn, priority) {
      return this.registerValidator(name, fn, priority);
    },

    subscribe: function (name, fn) {
      $.subscribeTo(this, name, fn);

      return this;
    },

    unsubscribe: function (name) {
      $.unsubscribeTo(this, name);

      return this;
    }
  };

  return ParsleyAbstract;
});
