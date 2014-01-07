define('parsley/form', [
  'parsley/abstract',
  'parsley/utils'
  ], function (ParsleyAbstract, ParsleyUtils) {
  var ParsleyForm = function(element, parsleyInstance) {
    this.__class__ = 'ParsleyForm';
    this.__id__ = ParsleyUtils.hash(4);

    if ('Parsley' !== ParsleyUtils.get(parsleyInstance, '__class__'))
      throw new Error('You must give a Parsley instance');

    this.parsleyInstance = parsleyInstance;
    this.init($(element));
  };

  ParsleyForm.prototype = {
    init: function ($element) {
      this.$element = $element;
      this.validationResult = null;

      this.options = this.parsleyInstance.OptionsFactory.get(this);

      this.bindFields();

      // jQuery stuff
      this.$element.attr('novalidate', 'novalidate');
      this.$element.on('submit.' + this.__class__, false, $.proxy(this.validate, this));
    },

    validate: function (event) {
      var isValid = true,
        validationResult = [];

      this.refreshFields();

      for (var i = 0; i < this.fields.length; i++) {
        validationResult = this.fields[i].validate().validationResult;
        if (true !== validationResult && validationResult.length > 0 && isValid)
          isValid = false;
      }

      // form validation listener.
      // form submission can be prevented here too, event if form is valid
      this.options.listeners.onFormValidate(isValid, event, this);

      // prevent form submission if validation fails
      if (false === isValid)
        event.preventDefault();

      return this;
    },

    isValid: function () {
      this.refreshFields();

      for (var i = 0; i < this.fields.length; i++)
        if (false === this.fields[i].isValid())
          return false;

      return true;
    },

    refreshFields: function () {
      return this.actualizeOptions().bindFields();
    },

    bindFields: function () {
      var self = this;
      this.fields = [];

      this.$element.find(this.options.inputs).each(function () {
        self.addField(this);
      });

      return this;
    },

    addField: function (field) {
      var fieldInstance = new window.Parsley(field, {}, this.parsleyInstance);

      // only add valid field children
      if ('ParsleyField' === fieldInstance.__class__)
        this.fields.push(fieldInstance);

      return this;
    },

    removeField: function (field) {},
    reset: function () {},
    destroy: function () {}
  };

  return ParsleyForm;
});
