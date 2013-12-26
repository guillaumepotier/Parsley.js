define('parsley/utils', function () {
  return {
    // Parsley DOM-API
    attr: function ($element, namespace) {
      var attribute,
        obj = {},
        regex = new RegExp("^" + namespace, 'i');

      if ('undefined' === typeof $element[0])
        return {};

      for (var i in $element[0].attributes) {
        attribute = $element[0].attributes[i];
        if ('undefined' !== typeof attribute && null !== attribute && attribute.specified && regex.test(attribute.name)) {
          obj[this.camelize(attribute.name.replace(namespace, ''))] = this.deserializeValue(attribute.value);
        }
      }

      return obj;
    },

    // Recursive object / array getter
    get: function (obj, path) {
      var i = 0,
      paths = (path || '').split('.');

      while (this.isObject(obj) || this.isArray(obj)) {
        obj = obj[paths[i++]];
        if (i === paths.length)
          return obj;
      }

      return undefined;
    },

    /** Third party functions **/
    // Underscore isArray
    isArray: function (mixed) {
      return Object.prototype.toString.call(mixed) === '[object Array]';
    },

    // Underscore isObject
    isObject: function (mixed) {
      return mixed === Object(mixed);
    },

    // Zepto deserialize function
    deserializeValue: function (value) {
      var num
      try {
        return value ?
          value == "true" ||
          (value == "false" ? false :
          value == "null" ? null :
          !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value)
          : value;
      } catch (e) { return value; }
    },

    // Zepto camelize function
    camelize: function (str) {
      return str.replace(/-+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    },

    // Zepto dasherize function
    dasherize: function (str) {
      return str.replace(/::/g, '/')
             .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
             .replace(/([a-z\d])([A-Z])/g, '$1_$2')
             .replace(/_/g, '-')
             .toLowerCase();
    }
  };
});
