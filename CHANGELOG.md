#Changelog

**master**

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

**2.0.0-rc3**

  - fixed $ conflict (#525)
  - added `force` validation for `isValid()` and `validate()`
  - added doc events example
  - added doc Help section
  - added `data-parsley-errors-messages-disabled` option

**2.0.0-rc2**

  - added `data-parsley-validate-if-empty` field option (#489)
  - fixed select multiple bug (#522)
  - allowed checkbox, radio and select multiple inputs to have either a `name`
    or an `id` to be binded (instead of just a name)
