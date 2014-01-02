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

      return this;
    },

    bindConstraints: function () {
      this.constraints = [];

      for (var name in this.options) {
        this.addConstraint(ParsleyUtils.makeObject(name, this.options[name]));
      }

      return this;
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

      if ('function' === typeof this.Validator.validators[constraint.key]) {
        constraint = new ParsleyConstraint(this, constraint.key, constraint.value);

        // if constraint already exist, delete it and push new version
        if (true === this.hasConstraint(constraint.name))
          this.removeConstraint(constraint.name);

        this.constraints.push(constraint);
      }

      return this;
    },

    removeConstraint: function (name) {
      for (var i = 0; i < this.constraints.length; i++)
        if (name === this.constraints[i].name) {
          this.constraints.splice(i, 1);
          break;
        }

      return this;
    },

    updateConstraint: function (constraint) {
      return this.removeConstraint(constraint.name)
        .addConstraint(constraint);
    },

    hasConstraint: function (name) {
      for (var i = 0; i < this.constraints.length; i++)
        if (name === this.constraints[i].name)
          return true;

      return false;
    },

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
