# new features

* required on radio, checkboxes and selects
* create a error summary attached to form
* Add data API to set error messages (by form and by field)
* [NOPE] add special fields features: password stenght detector for example ?


# refactos

* [DONE] stop binding `keypress` and `change` events by default. Must be passed as data 
  arguments. By default, onSubmit validation only


# enhancements

* [DONE] focus on first or last error on form validation
* [DONE] use `keypress` event when error detected and displayed, to hide it asap when field ok ?
* [DONE] create API doc
