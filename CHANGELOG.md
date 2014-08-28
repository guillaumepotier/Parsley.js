# Parsley 2.x changelog

## next stable release

## 2.0.5

  - fixed AMD

## 2.0.4

  - added ParsleyField context to asyncValidator callback functions (#702)
  - fixed AMD loading of Validator.js (#691, #693)
  - added extra/words.js validators (#700)
  - added support of multiple groups (#706)

## 2.0.3

  - fix not AMD loading for Wordpress case (#685)

## 2.0.2

  - proper version number in `dist/` files

## 2.0.1

  - fixed "attr.specified is deprecated." console warning (#608)
  - fixed package.json config with main dep (#617)
  - fixed `addValidator()` method
  - added support for `requirementsTransformer` for custom validators
  - updated jQuery needed version from README and doc
  - fixed case when a multiple item were dynamically removed from DOM (#634)
  - added proper `type="range"` support (#668)

## 2.0.0

  - fixed remote re-entering already validated value (#576)
  - added `stopImmediatePropagation()` un `onSubmit()` method to avoid conflicts
    with other libraries (#561)
  - fixed parsleyFieldMultiple behavior that tried to bind non radio or checkbox
    fields as a multiple field (#589)
  - `input[type=hidden]` are now excluded by default (#589)
  - fixed constraints unicity on fields belonging to same multiple group
  - added `data-parsley-remote-validator` feature (#587)
  - now support custom messages placeholders (#602)
  - fix exception when ParsleyField or ParsleyFieldMultiple value is null or
    undefined (#598)
  - fixed `destroy()` method + added test (#555)
  - added requirejs AMD support for `dist/parsley.js` and `dist/parsley.min.js`
    versions (#606)
  - fixed custom namespace -multiple that didn't re-evaluated correctly (#595)
  - added `ParsleyUI.getErrorsMessages()` (Closes #607)

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
