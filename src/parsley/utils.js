define('parsley/utils', function () {
  var globalID = 1,
    // http://support.microsoft.com/kb/167820
    // http://stackoverflow.com/questions/19999388/jquery-check-if-user-is-using-ie
    msie = (function () {
          var
            ua = window.navigator.userAgent,
            msie = ua.indexOf('MSIE ');

          if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);

          return 0;
       })();

  var ParsleyUtils = {
    // Parsley DOM-API
    // returns object from dom attributes and values
    attr: function ($element, namespace, obj) {
      var
        attribute,
        regex = new RegExp('^' + namespace, 'i');

      if ('undefined' === typeof obj)
        obj = {};
      else {
        // Clear all own properties. This won't affect prototype's values
        for (var i in obj) {
          if (obj.hasOwnProperty(i))
            delete obj[i];
        }
      }

      if ('undefined' === typeof $element || 'undefined' === typeof $element[0])
        return obj;

      for (var i in $element[0].attributes) {
        attribute = $element[0].attributes[i];

        if ('undefined' !== typeof attribute && null !== attribute && (!msie || msie >= 8 || attribute.specified) && regex.test(attribute.name)) {
          obj[this.camelize(attribute.name.replace(namespace, ''))] = this.deserializeValue(attribute.value);
        }
      }

      return obj;
    },

    checkAttr: function ($element, namespace, checkAttr) {
      return $element.is('[' + namespace + checkAttr + ']');
    },

    setAttr: function ($element, namespace, attr, value) {
      $element[0].setAttribute(this.dasherize(namespace + attr), String(value));
    },

    generateID: function () {
      return '' + globalID++;
    },

    /** Third party functions **/
    // Zepto deserialize function
    deserializeValue: function (value) {
      var num;

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
      return str.replace(/-+(.)?/g, function (match, chr) {
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
    },

    // Object.create polyfill, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
    objectCreate: Object.create || (function () {
      var Object = function () {};
      return function (prototype) {
        if (arguments.length > 1) {
          throw Error('Second argument not supported');
        }
        if (typeof prototype != 'object') {
          throw TypeError('Argument must be an object');
        }
        Object.prototype = prototype;
        var result = new Object();
        Object.prototype = null;
        return result;
      };
    })()
  };

  return ParsleyUtils;
});
