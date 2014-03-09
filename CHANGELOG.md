#Changelog

**master**

  - fixed js error if wrong data-parsley-errors-container is given
  - fixed js error if `name=""` or `id=""` for parlsey multiple fields (#533)
  - fixed dynamically added fields form inheritance (#532)
  - fixed parsley-remote.js remote validator registration that overrided
    other extra validators.

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
