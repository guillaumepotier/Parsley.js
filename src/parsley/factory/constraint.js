define('parsley/factory/constraint', [
  'parsley/utils',
  'parsley/validator',
], function (ParsleyUtils, ParsleyValidator) {
  var ConstraintFactory = function (parsleyField, name, requirements, priority, isDomConstraint) {
    if (!new RegExp('ParsleyField').test(parsleyField.__class__))
      throw new Error('ParsleyField or ParsleyFieldMultiple instance expected');

    var validatorSpec = window.ParsleyValidator.validators[name];
    var validator = new ParsleyValidator(validatorSpec);

    return {
      validator: validator,
      name: name,
      requirements: requirements,
      priority: priority || parsleyField.options[name + 'Priority'] || validator.priority,
      isDomConstraint: true === isDomConstraint
    };
  };

  return ConstraintFactory;
});
