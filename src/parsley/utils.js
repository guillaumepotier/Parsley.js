define('parsley/utils', function () {
  return {
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
