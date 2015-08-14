(function($){

$.extend(true, window.Parsley, {
  asyncValidators: {
    'default': {
      fn: function (xhr) {
        return 'resolved' === xhr.state();
      },
      url: false
    },
    reverse: {
      fn: function (xhr) {
        // If reverse option is set, a failing ajax request is considered successful
        return 'rejected' === xhr.state();
      },
      url: false
    }
  },

  addAsyncValidator: function (name, fn, url, options) {
    window.Parsley.asyncValidators[name.toLowerCase()] = {
      fn: fn,
      url: url || false,
      options: options || {}
    };

    return this;
  },

  eventValidate: function (event) {
    // For keyup, keypress, keydown.. events that could be a little bit obstrusive
    // do not validate if val length < min threshold on first validation. Once field have been validated once and info
    // about success or failure have been displayed, always validate with this trigger to reflect every yalidation change.
    if (new RegExp('key').test(event.type))
      if (!this._ui.validationInformationVisible && this.getValue().length <= this.options.validationThreshold)
        return;

    this._ui.validatedOnce = true;
    this.whenValidate();
  }
});

window.Parsley.addValidator('remote', {
  requirementType: {
    '': 'string',
    'validator': 'string',
    'reverse': 'boolean',
    'options': 'object'
  },

  validateString: function (value, url, options, instance) {
    var
      data = {},
      ajaxOptions,
      csr,
      validator = options.validator || (true === options.reverse ? 'reverse' : 'default');

    if ('undefined' === typeof window.Parsley.asyncValidators[validator])
      throw new Error('Calling an undefined async validator: `' + validator + '`');

    // Fill data with current value
    data[instance.$element.attr('name') || instance.$element.attr('id')] = value;

    // Merge options passed in from the function with the ones in the attribute
    var remoteOptions = $.extend(true, options.options || {} , window.Parsley.asyncValidators[validator].options);

    // All `$.ajax(options)` could be overridden or extended directly from DOM in `data-parsley-remote-options`
    ajaxOptions = $.extend(true, {}, {
      url: window.Parsley.asyncValidators[validator].url || url,
      data: data,
      type: 'GET'
    }, remoteOptions);

    // Generate store key based on ajax options
    csr = $.param(ajaxOptions);

    // Initialise querry cache
    if ('undefined' === typeof window.Parsley._remoteCache)
      window.Parsley._remoteCache = {};

    // Try to retrieve stored xhr
    var xhr = window.Parsley._remoteCache[csr] = window.Parsley._remoteCache[csr] || $.ajax(ajaxOptions);

    var handleXhr = function() {
      var result = window.Parsley.asyncValidators[validator].fn.call(instance, xhr, url, options);
      if (!result) // Map falsy results to rejected promise
        result = $.Deferred().reject();
      return $.when(result);
    };

    return xhr.then(handleXhr, handleXhr);
  },

  priority: -1
});

window.Parsley.on('form:submit', function () {
  window.Parsley._remoteCache = {};
});

window.ParsleyExtend.addAsyncValidator = function () {
  window.ParsleyUtils.warnOnce('Accessing the method `addAsyncValidator` through an instance is deprecated. Simply call `window.Parsley.addAsyncValidator(...)`');
  return window.Parsley.apply(window.Parsley.addAsyncValidator, arguments);
};

})(jQuery);
