(function () {
var parseRequirement = function (requirement) {
  if (isNaN(+requirement))
    return parseFloat($(requirement).val());
  else
    return +requirement;
};

// gt, gte, lt, lte extra validators
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.validators = window.ParsleyConfig.validators || {};

// Greater than validator
window.ParsleyConfig.validators.gt = {
  fn: function (value, requirement) {
    return parseFloat(value) > parseRequirement(requirement);
  },
  priority: 32
};

// Greater than or equal to validator
window.ParsleyConfig.validators.gte = {
  fn: function (value, requirement) {
    return parseFloat(value) >= parseRequirement(requirement);
  },
  priority: 32
};

// Less than validator
window.ParsleyConfig.validators.lt = {
  fn: function (value, requirement) {
    return parseFloat(value) < parseRequirement(requirement);
  },
  priority: 32
};

// Less than or equal to validator
window.ParsleyConfig.validators.lte = {
  fn: function (value, requirement) {
    return parseFloat(value) <= parseRequirement(requirement);
  },
  priority: 32
};
})();
