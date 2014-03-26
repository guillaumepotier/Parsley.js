# UPGRADE FROM 1.x to 2.0

## General

- default namespace is now `data-parsley-` for DOM-API
  (not anymore 1.2.x `parsley-` or 1.1.x `data-`)
- there is only one global `ParsleyValidator` instance. Adding / removing
  validators is not made on `ParsleyForm` or `ParsleyField` instances anymore,
  but directly against `ParsleyValidator`. Same goes for errors messages.


## Options / Configuration

- `options` is now a flat 1 dim depth object.
- These options have been removed:
    - `listeners`
    - `validators`
    - `useHtml5Constraints`
    - `messages`
    - `validateIfUnchanged`
- These options have been renamed:
    - `validationMinlength` into `validationTreshold`
    - `errors.classHandler` into `classHandler`
    - `errors.container` into `errorsContainer`
    - `errors.errorsWrapper` into `errorsWrapper`
    - `errors.errorEleme` into `errorTemplate`


## Validators

  - `required` validator now accepts `false` value and becomes inactive.
  - `rangelength` validator is now renamed as `length`. Same requirements.
  - `rangecheck` validator is now renamed as `check`. Same requirements.
  - `notnull`, `type="urlstrict"`, `type="tel"` have disappeared from built-in
    validators.
  - types `phone`, `urlstrict`, `dateIso` have been removed. They could be
    crafted and submitted by someone in `extra/`


## UI/UX

  - `.parsley-validated` class is not added anymore on bound fields
  - `novalidate` attr is now automatically added to `<form>`
  - `.parsley-error-list` is now `.parsley-errors-list`
  - to customize `type` validator error message, you do not need to add
    the precise type anymore.
    eg: `parsley-type-email-message="msg"` becomes
    `data-parsley-type-message="msg"`


## Javascript

  - `.parsley('method')` API is deprecated. Use .parsley().method() now
    eg: `$('#form').parsley('validate')` is now `$('#form').parsley().validate()`


## Listeners

  - can now be global with `$.listen()` and listen for every Parsley instance
    firing it (the way `ParsleyUI` works)
  - can be Field / Form specific by using `.subscribe()` and `.unsubscribe()`
    on a Parsley instance.


## Misc

  - parsley `remote` validator is shipped now in parsley.remote.js
  - parsley.extend is no more. Instead, extra validators are now placed in a
    dir and can be built with a script into a single file.
