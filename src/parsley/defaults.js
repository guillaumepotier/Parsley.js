define('parsley/defaults', function () {
  return {
    namespace: 'data-parsley-',                                               // Default data-namespace for DOM API
    inputs: 'input, textarea, select',                                        // Default supported inputs
    excluded: 'input[type=button], input[type=submit], input[type=reset]',    // Default excluded inputs
    stopOnFirstFailingConstraint: true,                                       // Stop validating field on highest priority failing constraint
    validators: {},                                                           // Register here some custom validators
    focus: 'first',                                                           // Focused field on form validation error. 'fist'|'last'|'none'
    trigger: false,                                                           // $.Event() that will trigger validation. eg: keyup, change..
    listeners: {
      onFieldValidate : function (ParsleyField) {},                           // Executed each time a field is validated
      onFormValidate: function (isFormValid, event, ParsleyForm) {},          // Executed each time a form is validated
      onFieldError: function (ParsleyField) {},                               // Executed when a field fails validation
      onFieldSuccess: function (ParsleyField) {}                              // Executed when a field passes validation
    }
  };
});
