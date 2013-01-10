# new features

* Ajax check
* Existence in a dataSet
* [DONE] required on radio, checkboxes and selects
* create a error summary attached to form
* Add data API to set error messages (by form and by field)
* [NOPE] add special fields features: password stenght detector for example ?
* customize error template
* [DONE] customize error messages placement
* [DONE] customize error and success class names
* [DONE] customize error and success class element

# refactos

* [DONE] stop binding `keypress` and `change` events by default. Must be passed as data 
  arguments. By default, onSubmit validation only


# enhancements

* Add typical use cases in documentation
* [DONE] focus on first or last error on form validation
* [DONE] use `keypress` event when error detected and displayed, to hide it asap when field ok ?
* [DONE] create API doc


# add / improve tests

* customization parsley classes (js & data api)
* customization errorClass handler (js & data api)
* customization error ul position (js & data api)