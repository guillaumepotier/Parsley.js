define('parsley/defaults', function () {
  return {
    namespace: 'data-parsley-',                 // Default data-namespace for DOM API
    inputs: 'input, textarea, select',          // Default supported inputs
    stopOnFirstFailingConstraint: true,         // Stop validating field on highest priority failing constraint
    validators: {}                              // Register here some custom validators
  };
});
