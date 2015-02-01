define('parsley/factory/constraint', [
  'parsley/utils'
], function (ParsleyUtils) {
  var ConstraintFactory = function (parsleyField, name, requirements, priority, isDomConstraint) {
    var assert = {};

    if (!new RegExp('ParsleyField').test(parsleyField.__class__))
      throw new Error('ParsleyField or ParsleyFieldMultiple instance expected');

    if ('function' === typeof window.ParsleyValidator.validators[name])
      assert = window.ParsleyValidator.validators[name](requirements);
    if ('Assert' !== assert.__parentClass__)
      throw new Error('Valid validator expected');

    var getPriority = function () {
      if ('undefined' !== typeof parsleyField.options[name + 'Priority'])
        return parsleyField.options[name + 'Priority'];

      return assert.priority || 2;
    };

    priority = priority || getPriority();

    // If validator have a requirementsTransformer, execute it
    if ('function' === typeof assert.requirementsTransformer) {
      requirements = assert.requirementsTransformer();
      // rebuild assert with new requirements
      assert = window.ParsleyValidator.validators[name](requirements);
    }

    return $.extend(assert, {
      name: name,
      requirements: requirements,
      priority: priority,
      groups: [priority],
      isDomConstraint: isDomConstraint || ParsleyUtils.checkAttr(parsleyField.$element, parsleyField.options.namespace, name)
    });
  };

  return ConstraintFactory;
});
