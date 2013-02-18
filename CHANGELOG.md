#Changelog

**1.1.11-dev**

  - added `change` auto binded event for select inputs to have same behavior w/ fields
  - fixed bug on radio buttons and required constraint
  - added afterDate and beforeDate validators in parsley.extend

**1.1.10**

  - **BC Break** changed errors.classHandler and errors.container
  - animating errors show / hide now
  - fixed radio/checkboxes data-trigger behavior (#115)
  - added `change` event to quickly remove radio/checkboxes errors (#115)
  - added ability to group radio / checkboxes by `data-group` attribute intead of name

**1.1.9**

  - added `addItem` and `removeItem` functions to validate dynamically created fields
  - added addConstraint, updateConstraint and removeConstraint API to dynamically
    update fields constraints (#52)
  - `.delete()` method removes now all parsley related classes (#102)
  - added validateIfUnchanged option to force fields validation even if value is
    unchanged since last validation (#104)
  - fixed equalTo, lessThan and greaterThan validators (#78)

**1.1.8**

  - ParsleyForm.items are now ParsleyField instances!!
  - fixed needsValidation function if element is reseted (#77)
  - fixed addListener for onFormSubmit (#72)
  - fixed focus 'none' bug (#73)

**1.1.7**

  - fixed a lot of typos
  - added .parsley( 'destroy' ) method

**1.1.6**

  - fixed custom error message bug (displayed once by validator that failed)
  - fixed error messages validators overrinding on multiple forms
  - added data-API error message customization
  - corrected lot of typo / mistakes on doc

**1.1.5**

  - added data-error-message="message" customization ability
  - fixed inheritence problem with ParsleyField and ParsleyFieldMultiple

**1.1.4**

  - passed now ParsleyForm and ParsleyField when appropriated to listeners
  - fixed bug on select multiple and required constraint

**1.1.3**

  - fixed bug on onFieldValidate listener that do not reseted Parsley validation
    on return = false;

**1.1.2**

  - added html5 types supports for existing validators

**1.1.1**

  - two new parsley.extra validators: greaterthan & lowerthen

**1.1.0**

  - added localization and extra validator configuration in external files.

**1.0.0**

  - added ajax remote validator and go live !

**0.2.0**

  - heavy radio / checkbox refacto. Now dedicated class `ParsleyFieldMultiple`
  - added 3 custom checkbox validators: mincheck, maxcheck and rangecheck

**0.1.4**

  - added html5 api required="required" support
  - added radio and checkbox required (only) validation support. For now, to display
    nice errors, checkbox and radio with same name must be wrapped in a dedicated
    DOM parent on which parsley-error class would be binded and ul errors apend

**0.1.3**

  - fixed bug on addListener when added after Parsley initialisation. @gmajoulet

**0.1.2**

  - renamed listeners and added a public API to add / override these listeners