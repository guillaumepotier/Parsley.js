define('parsley/constraint', [
  'parsley/utils'
], function (ParsleyUtils) {
  var Constraint = function(parsleyField, name, requirements) {
    this.__class__ = 'Constraint';

    if ('ParsleyField' !== ParsleyUtils.get(parsleyField, '__class__'))
      throw new Error('instance of ParsleyField expected');

    this.name = name;
    this.requirements = requirements;

    this.priority = ParsleyUtils.get(parsleyField.Validator.validators[name], 'priority', 2);
    this.isDomConstraint = ParsleyUtils.attr(parsleyField.$element, parsleyField.options.namespace, name);

    this.isViolated = false;
  };

  return Constraint;
});
