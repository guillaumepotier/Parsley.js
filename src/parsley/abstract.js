define('parsley/abstract', function () {
  var ParsleyAbstract = function(options) {};

  ParsleyAbstract.prototype = {
    actualizeOptions: function () {
      this.options = this.parsleyInstance.OptionsFactory.get(this);

      return this;
    },

    registerValidator: function (name, fn, priority) {
      window.ParsleyValidator.addValidator(name, fn, priority);

      return this;
    },

    removeValidator: function (name) {
      window.ParsleyValidator.removeValidator(name);

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
    },

    reset: function () {
      if ('ParsleyField' === this.__class__)
        return $.emit('parsley:field:reset', this);

      for (var i = 0; i < this.fields.length; i++)
        this.fields[i].reset();
    },

    destroy: function () {
      if ('ParsleyField' === this.__class__) {
        $.emit('parsley:field:destroy', this);
        this.$element.removeData('Parsley');
        return;
      }

      for (var i = 0; i < this.fields.length; i++)
        this.fields[i].destroy();
    }
  };

  return ParsleyAbstract;
});
