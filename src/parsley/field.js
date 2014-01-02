define('parsley/field', [
    'parsley/ui',
    'parsley/validator',
    'parsley/constraint',
    'parsley/defaults',
    'parsley/utils'
], function (ParsleyUI, ParsleyValidator, ParsleyConstraint, ParsleyDefaults, ParsleyUtils) {
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
      this.Validator = new ParsleyValidator(options);
      this.bind();
    },

    validate: function () {},
    isValid: function () {},
    getVal: function () {

    },

    bind: function () {
      this.bindConstraints();
      this.bindTriggers();
    },

    bindConstraints: function () {
      this.constraints = [];

      for (var name in this.options) {
        this.addConstraint(ParsleyUtils.makeObject(name, this.options[name]));
      }
    },

    bindTriggers: function () {},

    /**
    * Dynamically add a new constraint to a field
    *
    * @method addConstraint
    * @param {Object} constraint { name: requirements }
    */
    addConstraint: function (constraint) {
      constraint = ParsleyUtils.keyValue(constraint);
      constraint.key = constraint.key.toLowerCase();

      if ('function' === typeof this.Validator.validators[constraint.key])
        this.constraints.push(new ParsleyConstraint(this, constraint.key, constraint.value));
    },

    removeConstraint: function (constraint) {},
    updateConstraint: function (constraint) {},


    generateHash: function () {
      if (this.group)
        return 'parsley-' + this.group;

      return 'parsley-' + new String(Math.random()).substring(2, 9);
    },

    reset: function () {},
    destroy: function () {}
  };

  return ParsleyField;
});
