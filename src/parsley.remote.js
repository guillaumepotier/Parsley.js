// `window.ParsleyExtend`, like `ParsleyAbstract`, is inherited by `ParsleyField` and `ParsleyForm`
// That way, we could add new methods or redefine some for these both classes. In particular case
// We are adding async validation methods that returns promises, bind them properly to triggered
// Events like onkeyup when field is invalid or on form submit. These validation methods adds an
// Extra `remote` validator which could not be simply added like other `ParsleyExtra` validators
// Because returns promises instead of booleans.
window.ParsleyExtend = $.extend(window.ParsleyExtend || {}, {
  asyncValidate: function (group, event) {
    if ('ParsleyForm' === this.__class__)
      return this._asyncValidateForm(group, event);

    return this._asyncValidateField();
  },

  asyncIsValid: function (group) {
    if ('ParsleyField' === this.__class__)
      return this._asyncIsValidField();

    return this._asyncIsValidForm(group);
  },

  onSubmitValidate: function (event) {
    var that = this;

    if ( event instanceof $.Event)
      event.preventDefault();

    return this._asyncValidateForm(undefined, event)
      .done(function () {
        that.$element
          .off('submit.Parsley')
          .trigger($.Event('submit'));
      });
  },

  eventValidate: function (event) {
    // For keyup, keypress, keydown.. events that could be a little bit obstrusive
    // do not validate if val length < min threshold on first validation. Once field have been validated once and info
    // about success or failure have been displayed, always validate with this trigger to reflect every yalidation change.
    if (new RegExp('key').test(event.type))
      if (!this._ui.validationInformationVisible  && this.getValue().length <= this.options.validationThreshold)
        return;

    this._ui.validatedOnce = true;
    this.asyncValidate();
  },

  // Returns Promise
  _asyncValidateForm: function (group, event) {
    var that = this,
      promises = [];
    this.submitEvent = event;

    this._refreshFields();

    $.emit('parsley:form:validate', this);

    for (var i = 0; i < this.fields.length; i++) {

      // do not validate a field if not the same as given validation group
      if (group && group !== this.fields[i].options.group)
        continue;

      promises.push(this.fields[i]._asyncValidateField());
    }

    return $.when.apply($, promises)
      .always(function () {
        $.emit('parsley:form:validated', that);
      });
  },

  _asyncIsValidForm: function (group) {
    var promises = [];
    this._refreshFields();

    for (var i = 0; i < this.fields.length; i++) {

      // do not validate a field if not the same as given validation group
      if (group && group !== this.fields[i].options.group)
        continue;

      promises.push(this.fields[i]._asyncIsValidField());
    }

    return $.when.apply($, promises);
  },

  _asyncValidateField: function () {
    var that = this;

    $.emit('parsley:field:validate', this);

    return this._asyncIsValidField()
      .done(function () {
        $.emit('parsley:field:success', that);
      })
      .fail(function () {
        $.emit('parsley:field:error', that);
      })
      .always(function () {
        $.emit('parsley:field:validated', that);
      });
  },

  _asyncIsValidField: function () {
    var deferred = $.Deferred(),
      remoteConstraintIndex;

    // If regular isValid (matching regular constraints) retunrs `false`, no need to go further
    // Directly reject promise, do not run remote validator and save server load
    if (false === this.isValid())
      deferred.rejectWith(this);

    // If regular constraints are valid, and there is a remote validator registered, run it
    else if (-1 !== this._constraintIndex('remote'))
      this._remote(deferred);

    // Otherwise all is good, resolve promise
    else
      deferred.resolveWith(this);

    // Return promise
    return deferred.promise();
  },

  _remote: function (deferred) {
    var promise,
      data = {},
      that = this,
      value = this.getValue(),
      csr = value + this.$element.attr(this.options.namespace + 'remote-options');

    // Already validated values are stored to save some calls..
    if ('undefined' !== typeof this._remote && 'undefined' !== typeof this._remote[csr])
      promise = this._remote[csr] ? deferred.resolveWith(that) : deferred.rejectWith(that);
    else {
      data[that.$element.attr('name') || that.$element.attr('id')] = value;

      // All `$.ajax(options)` could be overriden or extended directly from DOM in `data-parsley-remote-options`
      promise = $.ajax($.extend(true, {}, {
        url: that.options.remote,
        data: data,
        type: 'GET'
      }, that.options.remoteOptions || {}));
    }

    // Depending on promise result, manage `validationResult` for UI
    promise
      .done(function () {
        that._handleRemoteResult(true, deferred, csr);
      })
      .fail(function () {
        that._handleRemoteResult(false, deferred, csr);
      });
  },

  _handleRemoteResult: function (status, deferred, csr) {
    // Store remote call result to avoid next calls with exact same parameters
    this._remote[csr] = status;

    // If reverse option is set, a failing ajax request is considered successful
    if ('undefined' !== typeof this.options.remoteReverse && true === this.options.remoteReverse)
      status = !status;

    // If true, simply resolve and exit
    if (status) {
      deferred.resolveWith(this);
      return;
    }

    // Else, create a proper remote validation Violation to trigger right UI
    this.validationResult = [
      new window.ParsleyValidator.Validator.Violation(
        this.constraints[this._constraintIndex('remote')],
        this.getValue(),
        null
      )
    ];

    deferred.rejectWith(this);
  }
});

// Remote validator is just an always true sync validator with lowest (-1) priority possible
// It will be overloaded in `validateThroughValidator()` that will do the heavy async work
// This 'hack' is needed not to mess up too much with error messages and stuff in `ParsleyUI`
window.ParsleyConfig = $.extend(window.ParsleyConfig || {}, {
  validators: {
    remote: {
      fn: function () {
        return true;
      },
      priority: -1
    }
  }
});
