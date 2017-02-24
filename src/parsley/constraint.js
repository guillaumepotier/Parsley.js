import $ from 'jquery';
import Utils from './utils';
import Validator from './validator';

var Constraint = function (parsleyField, name, requirements, priority, isDomConstraint) {
  var validatorSpec = window.Parsley._validatorRegistry.validators[name];
  var validator = new Validator(validatorSpec);

  $.extend(this, {
    validator: validator,
    name: name,
    requirements: requirements,
    priority: priority || parsleyField.options[name + 'Priority'] || validator.priority,
    isDomConstraint: true === isDomConstraint
  });
  this._parseRequirements(parsleyField.options);
};

var capitalize = function(str) {
  var cap = str[0].toUpperCase();
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

