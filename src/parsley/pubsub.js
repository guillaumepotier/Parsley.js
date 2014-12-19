define('parsley/pubsub', [
  'parsley/field',
  'parsley/form'
], function (ParsleyField, ParsleyForm) {
  var
    o = $({}),
    subscribed = {};

  // $.listen(name, callback);
  // $.listen(name, context, callback);
  $.listen = function (name) {
    if ('undefined' === typeof subscribed[name])
      subscribed[name] = [];

    if ('function' === typeof arguments[1])
      return subscribed[name].push({ fn: arguments[1] });

    if ('object' === typeof arguments[1] && 'function' === typeof arguments[2])
      return subscribed[name].push({ fn: arguments[2], ctxt: arguments[1] });

    throw new Error('Wrong parameters');
  };

  $.listenTo = function (instance, name, fn) {
    if ('undefined' === typeof subscribed[name])
      subscribed[name] = [];

    if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
      throw new Error('Must give Parsley instance');

    if ('string' !== typeof name || 'function' !== typeof fn)
      throw new Error('Wrong parameters');

    subscribed[name].push({ instance: instance, fn: fn });
  };

  $.unsubscribe = function (name, fn) {
    if ('undefined' === typeof subscribed[name])
      return;

    if ('string' !== typeof name || 'function' !== typeof fn)
      throw new Error('Wrong arguments');

    for (var i = 0; i < subscribed[name].length; i++)
      if (subscribed[name][i].fn === fn)
        return subscribed[name].splice(i, 1);
  };

  $.unsubscribeTo = function (instance, name) {
    if ('undefined' === typeof subscribed[name])
      return;

    if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
      throw new Error('Must give Parsley instance');

    for (var i = 0; i < subscribed[name].length; i++)
      if ('undefined' !== typeof subscribed[name][i].instance && subscribed[name][i].instance.__id__ === instance.__id__)
        return subscribed[name].splice(i, 1);
  };

  $.unsubscribeAll = function (name) {
    if ('undefined' === typeof subscribed[name])
      return;

    delete subscribed[name];
  };

  // $.emit(name [, arguments...]);
  // $.emit(name, instance [, arguments...]);
  $.emit = function (name, instance) {
    if ('undefined' === typeof subscribed[name])
      return;

    // loop through registered callbacks for this event
    for (var i = 0; i < subscribed[name].length; i++) {
      // if instance is not registered, simple emit
      if ('undefined' === typeof subscribed[name][i].instance) {
        subscribed[name][i].fn.apply('undefined' !== typeof subscribed[name][i].ctxt ? subscribed[name][i].ctxt : o, Array.prototype.slice.call(arguments, 1));
        continue;
      }

      // if instance registered but no instance given for the emit, continue
      if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
        continue;

      // if instance is registered and same id, emit
      if (subscribed[name][i].instance.__id__ === instance.__id__) {
        subscribed[name][i].fn.apply(o, Array.prototype.slice.call(arguments, 1));
        continue;
      }

      // if registered instance is a Form and fired one is a Field, loop over all its fields and emit if field found
      if (subscribed[name][i].instance instanceof ParsleyForm && instance instanceof ParsleyField)
        for (var j = 0; j < subscribed[name][i].instance.fields.length; j++)
          if (subscribed[name][i].instance.fields[j].__id__ === instance.__id__) {
            subscribed[name][i].fn.apply(o, Array.prototype.slice.call(arguments, 1));
            continue;
          }
    }
  };

  $.subscribed = function () { return subscribed; };
});
