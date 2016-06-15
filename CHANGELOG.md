# Parsley 2.x changelog

## master

## 2.4.2

- `$('...').parsley({someOption: 'value'})` will always set the option `someOptions`. Previously if the field/form was already initialized, options were ignored.

## 2.3.1

- Parsley now relies on `input` events instead of `change` and `keyup` events
  to revalidate after the first failure. This is now customizable with the
  `triggerAfterFailure` option. Triggers specified with the `trigger` option
  are unbound once a field has failed.
- Parsley updates the UI before firing success/error/validated events
- Deprecated uses of ParsleyUI. Methods are now instance methods of ParsleyField,
  with modernized interfaces.

## 2.2.0

- type="number" now follows HTML5 spec. In particular, commas are no longer accepted. (#1037)
- Calls to validate, isValid, whenValidate, whenValid use named arguments
  (e.g. validate({force: true, group: 'foo'})). Previous API is supported for
  isValid/validate but is deprecated.
- Drop support for undocumented option `eventValidate`.

## 2.2.0-rc3

- Merged both versions (remote and basic) of Parsley.
  There is now a single version that is remote & promise aware.
- Converted src/ and test/ to ECMAScript 6.
  Requires es5-shim if you need compatibility with IE8.

## 2.2.0-rc2

- A custom validator may specify an error message by simply passing it as first argument
  when rejecting the promise. (#560)
- Submit buttons: data now included in the submitted form (#826) and
  attribute 'formnovalidate' is supported (#972)
- Remote: use HTTP status code for what is considered valid or not (#956)
- Remote: allow RESTful urls where "{value}" is replaced by the value to validate
- Remote: add field:ajaxoptions to allow customizing of the ajax parameters (#894)
- pattern validator is now anchored, unless it looks like /pattern/flag (#861)
- Parsley won't try to correct names with caps (#990)

## 2.2.0-rc1

- Major validators refactor:
  - Compatible with promises from the ground up. Previous API (e.g. `isValid`)
    remains, but promise-aware API is now recommended (e.g. `whenValid`).
  - New API to define custom validators (old API is still there but deprecated).
  - Shorter code, removed dependency on `validators` lib.
  - The `remote` validator is much smaller now, will probably be merged in the future.

- Deprecated `data-parsley-trim-value` in favour of new `whitespace` API
- Added `whitespace` API with two options: `trim` and `squish`

## 2.1.2

- fix custom triggers after a `reset()` (#926)
- fix documentation and generated dist files

## 2.1.1

- Bug fix for reentrant validations

## 2.1.0

- Event remodel
  - New API `on` and `off` to register for events
  - Global listeners added with `Parsley.on`
  - Using the new API, event names no longer have their ".parsley" ending
  - Compatibility with previous API is maintained, but `$.emit`, `$.listen`,
    etc. are now deprecated  (#899)

- New features
  - New event 'form:submit' fired before a form is submitted.
  - The `value` option can now be a function
  - Parsley.version is now the best way to get the current version
  - Additional translations

- Changes
  - Error containers are created only the first time they are needed.
  - [BC Break] `isValid()` field method now returns just a boolean, `[]` is no
  more returned when field is optional and empty. `needsValidation()` appears
  now to indicate if a valid field needed a validation.

- Bug fixes
  - Speed optimization (#855)
  - Eemote cache now cleared after form submission (#813)
  - Event 'field:reset' now fired if a field is no longer validated (because it
    is excluded, or removed) (#841)
  - Support for validators with compound names by restoring full case
    sensitivity to error messages. (#805)
  - Fix conflict between different forms on the same page (#888)
  - Handles checkbox names containing spaces (#881)
  - Detects name conflicts between validators and regular options
  - Compatible with jQuery.noConflict() (#859)

## 2.0.7

- support of html5 `maxlength` and `minlength` (#731)
- various doc updates
- improved test suite
- various small code simplifications
- updated TLD range for URL validator (#829)

## 2.0.6

- removed buggy special char in remote.js plugin (#755)
- fixed bug where isValid returned old errors on field with no constraints
  anymore (#776)
- fix a lot of tests

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
