# Parsley 2.x changelog

## master

## 2.0.0-rc5

  - totally reworked multiple fields (#542):
    - created a new Class: `ParsleyFieldMultiple`
    - multiple fields returns now same `ParsleyFieldMultiple` instance
  - `dist/parsley+remote.js` and `dist/parsley+remote.min.js` have been renamed
    to `dist/parsley.remote.js` and `dist/parsley.remote.min.js`
  - changed the way `asyncValidate` handle events
  - fix warning if parsley called on a page without elements to validate (#562)
  - fixed `ParsleyUtils.attr()` attribute checking (#564)
  - updated `ParsleyUtils.get()` method. Do not support anymore placeholder
    feature since `ParsleyUtils.get() || placeholder` writing is more readable
  - select and select multiple elements both handle the `parsley-success` and
    `parsley-error` classes directly and not their parent.
  - added pattern flags support (#566, #550)
  - fixed ParsleyFieldMultiple optional fields if not explicitely required
  - fixed ParsleyFieldMultiple trigger
  - fixed select UI auto-bind change on error (#537)
  - fixed `asyncIsValid()` and `asyncValidate()` API to support `force` option

## 2.0.0-rc4

  - fixed js error if wrong data-parsley-errors-container is given
  - fixed js error if `name=""` or `id=""` for parlsey multiple fields (#533)
  - fixed dynamically added fields form inheritance (#532)
  - fixed parsley-remote.js remote validator registration that overrided
    other extra validators.
  - added multiple xhr queries aborting in parsley.remote to avoid unneeded
    server overload with keyup trigger
  - fixed excluded fields option and added some doc for it (#546)
  - fixed `range` validator with `0` value (#543)
  - added `data-parsley-trim-value` option
  - updated validator.js
  - added `this.submitEvent.preventDefault()` support for parsley.remote
    call twice form / field tests with parsley.remote for better support (#552)
  - fixed global leaks shown by test suite
  - new $ Parsley API behavior:
    - returns `undefined` if called on non existing DOM element
      + console warn (#548)
    - returns an array of instances if called on selector with multiple
      elements (#547)
  - fixed `min`, `max`, `range` validators (#556)

## 2.0.0-rc3

  - fixed $ conflict (#525)
  - added `force` validation for `isValid()` and `validate()`
  - added doc events example
  - added doc Help section
  - added `data-parsley-errors-messages-disabled` option

## 2.0.0-rc2

  - added `data-parsley-validate-if-empty` field option (#489)
  - fixed select multiple bug (#522)
  - allowed checkbox, radio and select multiple inputs to have either a `name`
    or an `id` to be binded (instead of just a name)

## 2.0.0-rc1

  - initial 2.x public release
