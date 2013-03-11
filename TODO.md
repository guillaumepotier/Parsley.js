# new features

* create a error summary attached to form
* Add native form sumbission parlsey(form).submit()

* [DONE] Add data API to set error messages (by form and by field)
* [DONE] Existence in a dataSet
* [DONE] Add minWords maxWords rangeWords validators
* [DONE] Ajax check
* [DONE] required on radio, checkboxes and selects
* [NOPE] add special fields features: password stenght detector for example ?
* [DONE] customize error template
* [DONE] customize error messages placement
* [DONE] customize error and success class names
* [DONE] customize error and success class element


# refactos

* erroManagement bullshit function
* [DONE] refacto ugly manageErrors() function
* [DONE] stop binding `keypress` and `change` events by default. Must be passed as data 
  arguments. By default, onSubmit validation only


# enhancements

* Add typical use cases in documentation

* [DONE] focus on first or last error on form validation
* [DONE] use `keypress` event when error detected and displayed, to hide it asap when field ok ?
* [DONE] create API doc
* [DONE] Do not bind twice keyup if set by user with data-trigger="keyup"


# add / improve tests

* test that remote validator imply field has onchange event validation
* [DONE] customization parsley classes (js & data api)
* [DONE] customization errorClass handler (js & data api)
* [DONE] customization error ul position (js & data api)