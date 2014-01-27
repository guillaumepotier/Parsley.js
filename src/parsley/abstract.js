define('parsley/abstract', function () {
  var ParsleyAbstract = function(options) {};

  ParsleyAbstract.prototype = {
    actualizeOptions: function () {
      this.options = this.parsleyInstance.OptionsFactory.get(this);

      return this;
    },

    subscribe: function (name, fn) {
      $.listenTo(this, name, fn);

      return this;
    },

    unsubscribe: function (name) {
      $.unsubscribeTo(this, name);

      return this;
    },

    reset: function () {
      // Field case
      if ('ParsleyField' === this.__class__)
        return $.emit('parsley:field:reset', this);

      // Form case
      for (var i = 0; i < this.fields.length; i++)
        $.emit('parsley:field:reset', this.fields[i]);

      $.emit('parsley:form:reset', this);
    },

    destroy: function () {
      // Field case: emit destroy event to clean UI and then destroy stored instance
      if ('ParsleyField' === this.__class__) {
        $.emit('parsley:field:destroy', this);
        this.$element.removeData('Parsley');

        return;
      }

      // Form case: destroy all its fields and then destroy stored instance
      for (var i = 0; i < this.fields.length; i++)
        this.fields[i].destroy();

      $.emit('parsley:form:destroy', this);
      this.$element.removeData('Parsley');
    }
  };

  return ParsleyAbstract;
});
