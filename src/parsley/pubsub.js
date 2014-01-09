define('parsley/pubsub', [
  'parsley/field',
  'parsley/form'
], function (ParsleyField, ParsleyForm) {
  // pub/sub mechanism for parsley
  (function($) {
    var o = $({})
      subscribed = {};

    // $.subscribe(name, callback, /* parsleyInstance */);
    // $.subscribe(name, context, callback, /* parsleyInstance */);
    $.subscribe = function (name) {
      if ('undefined' === typeof subscribed[name])
        subscribed[name] = [];

      var sub;

      if ('object' === typeof arguments[1] && 'function' === typeof arguments[2])
        sub = { 'context': arguments[1], 'callback': arguments[2], 'instance': arguments[3] };
      else if ('function' === typeof arguments[1])
        sub = { 'context': undefined, 'callback': arguments[1], 'instance': arguments[2] };
      else
        throw new Error('Wrong arguments');

      if (sub.instance && !(sub.instance instanceof ParsleyField) && !(sub.instance instanceof ParsleyForm))
        throw new Error('Instance should be a Parsley Instance');

      subscribed[name].push(sub);
    };

    $.unsubscribe = function (name) {
      var context, callback;

      if ('undefined' === typeof subscribed[name])
        return;

      if ('object' === typeof arguments[1] && 'function' === typeof arguments[2]) {
        context = arguments[1];
        callback = arguments[2];
        instance = arguments[3];
      } else if ('function' === typeof arguments[1]) {
        callback = arguments[1];
        instance = arguments[2];
      } else {
        throw new Error('Wrong arguments');
      }

      for (var i = 0; i < subscribed[name].length; i++) {
        if (subscribed[name][i].context === context && subscribed[name][i].callback === callback) {
          if ('undefined' !== typeof instance && 'undefined' !== typeof subscribed[name][i].instance && instance.__id__ !== subscribed[name][i].instance.__id__)
            continue;

          subscribed[name].splice(i, 1);
        }
      }
    };

    $.unsubscribeAll = function (name) {
      if ('undefined' === typeof subscribed[name])
        return;

      delete(subscribed[name]);
    };

    $.publish = function (name) {
      if ('undefined' === typeof subscribed[name])
        return;

      var instance = arguments[1] instanceof ParsleyField || arguments[1] instanceof ParsleyForm ? arguments[1] : false;

      for (var i = 0; i < subscribed[name].length; i++) {
        if (instance && 'undefined' !== typeof subscribed[name][i].instance) {
          // if a ParsleyForm is subscribed, him and his fields share same parsleyInstance.
          if (subscribed[name][i] instanceof ParsleyForm && subscribed[name][i].instance.parsleyInstance.__id__ !== instance.parsleyInstance.__id__)
            continue;

          // if a ParsleyField is suscribed
          if (subscribed[name][i] instanceof ParsleyField && instance instanceof ParsleyField && subscribed[name][i].instance.__id__ !== instance.__id__)
            continue;
        }

        subscribed[name][i]['callback'].apply('undefined' !== typeof subscribed[name][i]['context'] ? subscribed[name][i]['context'] : o, Array.prototype.slice.call(arguments, 1));
      }
    };
  }(jQuery));
});
