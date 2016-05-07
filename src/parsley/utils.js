import $ from 'jquery';

var globalID = 1;
var pastWarnings = {};

var ParsleyUtils = {
  // Parsley DOM-API
  // returns object from dom attributes and values
  attr: function ($element, namespace, obj) {
    var i;
    var attribute;
    var attributes;
    var regex = new RegExp('^' + namespace, 'i');

    if ('undefined' === typeof obj)
      obj = {};
    else {
      // Clear all own properties. This won't affect prototype's values
      for (i in obj) {
        if (obj.hasOwnProperty(i))
          delete obj[i];
      }
    }

    if ('undefined' === typeof $element || 'undefined' === typeof $element[0])
      return obj;

    attributes = $element[0].attributes;
    for (i = attributes.length; i--; ) {
      attribute = attributes[i];

      if (attribute && attribute.specified && regex.test(attribute.name)) {
        obj[this.camelize(attribute.name.slice(namespace.length))] = this.deserializeValue(attribute.value);
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

  warn: function () {
    if (window.console && 'function' === typeof window.console.warn)
      window.console.warn(...arguments);
  },

  warnOnce: function(msg) {
    if (!pastWarnings[msg]) {
      pastWarnings[msg] = true;
      this.warn(...arguments);
    }
  },

  _resetWarnings: function () {
    pastWarnings = {};
  },

  trimString: function(string) {
    return string.replace(/^\s+|\s+$/g, '');
  },

  namespaceEvents: function(events, namespace) {
    events = this.trimString(events || '').split(/\s+/);
    if (!events[0])
      return '';
    return $.map(events, evt => { return `${evt}.${namespace}`; }).join(' ');
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
  })(),

  // http://underscorejs.org/#now
  now: Date.now || function () {
    return new Date().getTime();
  },

  // http://underscorejs.org/#debounce
  debounce: function (func, wait, immediate) {
    var timeout;
    var args;
    var context;
    var timestamp;
    var result;

    var later = function () {
      var last = ParsleyUtils.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function () {
      context = this;
      args = arguments;
      timestamp = ParsleyUtils.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  }
};

export default ParsleyUtils;
