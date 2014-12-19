define('parsley/abstract', [
], function () {
  var ParsleyAbstract = function() {};

  ParsleyAbstract.prototype = {
    asyncSupport: false,

    actualizeOptions: function () {
      this.options = this.OptionsFactory.get(this);

      return this;
    },

    // ParsleyValidator validate proxy function . Could be replaced by third party scripts
    validateThroughValidator: function (value, constraints, priority) {
      return window.ParsleyValidator.validate(value, constraints, priority);
    },

    // Subscribe an event and a handler for a specific field or a specific form
    // If on a ParsleyForm instance, it will be attached to form instance and also
    // To every field instance for this form
    subscribe: function (name, fn) {
      $.listenTo(this, name.toLowerCase(), fn);

      return this;
    },

    // Same as subscribe above. Unsubscribe an event for field, or form + its fields
    unsubscribe: function (name) {
      $.unsubscribeTo(this, name.toLowerCase());

      return this;
    },

    // Reset UI
    reset: function () {
      // Field case: just emit a reset event for UI
      if ('ParsleyForm' !== this.__class__)
        return this._trigger('reset');

      // Form case: emit a reset event for each field
      for (var i = 0; i < this.fields.length; i++)
        this.fields[i]._trigger('reset');

      this._trigger('reset');
    },

    // Destroy Parsley instance (+ UI)
    destroy: function () {
      // Field case: emit destroy event to clean UI and then destroy stored instance
      if ('ParsleyForm' !== this.__class__) {
        this.$element.removeData('Parsley');
        this.$element.removeData('ParsleyFieldMultiple');
        this._trigger('destroy');

        return;
      }

      // Form case: destroy all its fields and then destroy stored instance
      for (var i = 0; i < this.fields.length; i++)
        this.fields[i].destroy();

      this.$element.removeData('Parsley');
      this._trigger('destroy');
    }
  };

  return ParsleyAbstract;
});
