#Changelog

**1.1.18 (current stable)**

  - `onFormSubmit` now prevent form submission if returns (bool) false.
    It allows adding another custom check on top of Parsley.
  - Similarly, `onFieldSuccess` if returns (bool) false would make
    field invalid, even if Parsley validators are all green

**1.1.17**

  - various localizations updates + new localizations
  - Ability to bind Parsley on a DOM elem, not only form (#245)
  - accept higher jquery versions in bower.json
  - added spanish codes validation in i10n/

**1.1.16**

  - fixed IE7 bug with checkboxes / radio buttons that were always required.
  - html error messages could be used (#220)
  - fixed show / remove error with data-remote validator (#200)
  - added option to silence errors `data-show-errors="false"`
  - added / modified some i18n localizations
  - Override value by using data-value attribute
  - added americanDate validator in parsley.extend

**1.1.15**

  - **BC Break** removed `.parsley('isFieldValid');` in favor of `.parsley('isValid');`
    (#177)
  - added type="phone" validator
  - this.constraints is now an object instead of an array. **BC Break** with onFieldError
    listener.
  - removed default 'i' flag with data-regex validator. Added data-regex-flag attribute
    (#168)
  - specific behavior when field have required constraint. Do not show required error
    along another errors, and reciprocally (#142)

**1.1.14**

  - added luhn validator in parsley.extra (#150)
  - added inlist validator in parsley.extra (#153)
  - added _messages.en.js template in localization folder
  - fixed "Uncaught RangeError: Maximum call stack size exceeded" on jQuery `.off()`
    Refs #136
  - added $('#form').parsley('isValid') to know if form constraints fails, without
    adding DOM errors. Refs #94

**1.1.13**

  - added jquery plugin manifest

**1.1.12**

  - added some more localizations
  - `reset()` action now totaly reset field behavior, since never validated before
  - added `data-error-container` data-attribute to easily specify where to put errors

**1.1.11**

  - fixed `fadeIn()` undefined function with standalone version. Had to update Zepto
    with fx_module and fx loaded (#137)
  - fixed bug "Uncaught RangeError: Maximum call stack size exceeded" on
    bindEventValidation (#138)
  - fixed remote validator method (#130)
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