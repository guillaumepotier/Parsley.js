define('parsley/factory/constraint', [
  'parsley/validator'
], function (ParsleyValidator) {
  var ConstraintFactory = function (parsleyField, name, requirements, priority, isDomConstraint) {
    if (!new RegExp('ParsleyField').test(parsleyField.__class__))
      throw new Error('ParsleyField or ParsleyFieldMultiple instance expected');

    var validator = new ParsleyValidator(window.ParsleyValidator.validators[name]);

    $.extend(this, {
      validator: validator,
      name: name,
      requirements: requirements,
      priority: priority || parsleyField.options[name + 'Priority'] || validator.priority,
      isDomConstraint: true === isDomConstraint
    });

    this._parseRequirements(parsleyField.options);
  };

  var capitalize = function (str) {
    return str[0].toUpperCase() + str.slice(1);
  };

  ConstraintFactory.prototype = {
    validate: function (value, instance) {
      var args = this.requirementList.slice(0); // Make a copy
      args.unshift(value);
      args.push(instance);

      return this.validator.validate.apply(this.validator, args);
    },

    _parseRequirements: function (options) {
      var that = this;
      this.requirementList = this.validator.parseRequirements(this.requirements, function(key) {
        return options[that.name + capitalize(key)];
      });
    }
  };

  return ConstraintFactory;
});
