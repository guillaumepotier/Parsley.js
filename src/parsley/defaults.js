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
    },
    ui: {
      errorClass: 'parsley-error',
      successClass: 'parsley-success',
      classHandler: function (ParsleyField) {},                                // Return the $element that will receive success or error classes
      errorsContainer: function (ParsleyField) {},                             // Return the $element where errors will be appended
      errorsWrapper: '<ul class="parsley-errors-list"></ul>',                   // ul elem that would receive errors' lis
      errorTemplate: '<li></li>'
    }
  };
});
