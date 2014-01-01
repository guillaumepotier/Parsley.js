define('parsley/field', [
    'parsley/ui',
    'parsley/validator',
    'parsley/defaults'
], function (ParsleyUI, ParsleyValidator, ParsleyDefaults) {
  var ParsleyField = function(element, options) {
    this.__class__ = 'ParsleyField';

    if ('undefined' === typeof element)
      throw new Error('You must give an element');

    this.init($(element), options || ParsleyDefaults);
  };

  ParsleyField.prototype = {
    init: function ($element, options) {
      this.options = options;
      this.$element = $element;
      this.hash = this.generateHash();
    },

    validate: function () {},
    isValid: function () {},

    bindConstraints: function () {},
    bindTriggers: function () {},

    addConstraint: function (constraint) {},
    removeConstraint: function (constraint) {},
    updateConstraint: function (constraint) {},


    generateHash: function () {
      if (this.group)
        return 'parsley-' + this.group;

      return 'parsley-' + new String(Math.random()).substring(2, 9);
    }
  };

  return ParsleyField;
});
