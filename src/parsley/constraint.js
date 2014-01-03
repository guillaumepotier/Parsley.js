define('parsley/constraint', [
  'parsley/utils'
], function (ParsleyUtils) {
  var Constraint = function(parsleyField, name, requirements, priority) {
    this.__class__ = 'Constraint';

    if ('ParsleyField' !== ParsleyUtils.get(parsleyField, '__class__'))
      throw new Error('instance of ParsleyField expected');

    this.name = name;
    this.requirements = requirements;

    this.priority = priority || this.getPriority(parsleyField);
    this.isDomConstraint = ParsleyUtils.attr(parsleyField.$element, parsleyField.options.namespace, name);

    this.isViolated = false;
  };

  Constraint.prototype = {
    getPriority: function (parsleyField) {
      if ('undefined' !== typeof parsleyField.options[this.name + 'Priority'])
        return parsleyField.options[this.name + 'Priority'];

      return ParsleyUtils.get(parsleyField.Validator.validators[this.name](), 'priority', 2);
    }
  };

  return Constraint;
});
