define('parsley/pubsub', [
  'parsley/field',
  'parsley/form'
], function (ParsleyField, ParsleyForm) {
  var
    o = $({}),
    deprecated = function () {
      if (window.console && window.console.log)
        window.console.log("Parsley's pubsub module is deprecated; use the corresponding jQuery event method instead");
      // Warn only once:
      deprecated = function () {};
    };

  // Returns an event handler that calls `fn` with the arguments it expects
  function adapt(fn, context) {
    // Store to allow unbinding
    if (!fn.parsleyAdaptedCallback) {
      fn.parsleyAdaptedCallback = function (evt, parsley) {
        var args = Array.prototype.slice.call(arguments, 2);
        args.unshift(parsley);
        fn.apply(context || o, args);
      };
    }
    return fn.parsleyAdaptedCallback;
  }

  var eventPrefix = 'parsley:';
  // Converts 'parsley:form:validate' into 'form:validate.parsley'
  function eventName(name) {
    if (name.lastIndexOf(eventPrefix, 0) === 0)
      return name.substr(eventPrefix.length) + '.parsley';
    return name;
  }

  // $.listen is deprecated. Use jQuery events instead.
  $.listen = function (name, callback) {
    var context;
    deprecated();
    if ('object' === typeof arguments[1] && 'function' === typeof arguments[2]) {
      context = arguments[1];
      callback = arguments[2];
    }

    if ('function' !== typeof arguments[1])
      throw new Error('Wrong parameters');

    $(document).on(eventName(name), adapt(callback, context));
  };

  $.listenTo = function (instance, name, fn) {
    deprecated();
    if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
      throw new Error('Must give Parsley instance');

    if ('string' !== typeof name || 'function' !== typeof fn)
      throw new Error('Wrong parameters');

    $(instance.$element).on(eventName(name), adapt(fn));
  };

  $.unsubscribe = function (name, fn) {
    deprecated();
    if ('string' !== typeof name || 'function' !== typeof fn)
      throw new Error('Wrong arguments');
    $(document).off(eventName(name), fn.parsleyAdaptedCallback);
  };

  $.unsubscribeTo = function (instance, name) {
    deprecated();
    if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
      throw new Error('Must give Parsley instance');
    $(instance.$element).off(eventName(name));
  };

  $.unsubscribeAll = function (name) {
    deprecated();
    $(document).off(eventName(name));
    $('form,input').off(eventName(name));
  };

  // $.emit is deprecated. Use jQuery events instead.
  $.emit = function (name, instance) {
    var $target = $(document);
    deprecated();
    if ((instance instanceof ParsleyField) || (instance instanceof ParsleyForm)) {
      $target = instance.$element;
    }
    $target.trigger(eventName(name), Array.prototype.slice.call(arguments, 1));
  };

});
