import Utils from './utils';
import Validator from './validator';

const Constraint = function(parsleyField, name, requirements, priority, isDomConstraint) {
  const validatorSpec = window.Parsley._validatorRegistry.validators[name];
  const validator = new Validator(validatorSpec);
  priority = priority || parsleyField.options[name + 'Priority'] || validator.priority;
  isDomConstraint = (true === isDomConstraint);

  Object.assign(this, {
    validator,
    name,
    requirements,
    priority,
    isDomConstraint
  });
  this._parseRequirements(parsleyField.options);
};

const capitalize = function(str) {
  const cap = str[0].toUpperCase();
  return cap + str.slice(1);
};

Constraint.prototype = {
  validate: function(value, instance) {
    return this.validator.validate(value, ...this.requirementList, instance);
  },

  _parseRequirements: function(options) {
    this.requirementList = this.validator.parseRequirements(this.requirements,
      key => options[this.name + capitalize(key)]
    );
  }
};

export default Constraint;
