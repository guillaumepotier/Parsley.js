define('parsley/validator', [
  'parsley/defaults',
  'validator'
], function (ParsleyDefaults, Validator) {

  // This is needed for Browserify usage that requires Validator.js through module.exports
  Validator = 'undefined' !== typeof Validator ? Validator : ('undefined' !== typeof module ? module.exports : null);

  var ParsleyValidator = function (validators, catalog) {
    this.__class__ = 'ParsleyValidator';
    this.Validator = Validator;

    // Default Parsley locale is en
    this.locale = 'en';

    this.init(validators || {}, catalog || {});
  };

  ParsleyValidator.prototype = {
    init: function (validators, catalog) {
      this.catalog = catalog;
      // Copy prototype's validators:
      this.validators = $.extend({}, this.validators);

      for (var name in validators)
        this.addValidator(name, validators[name].fn, validators[name].priority, validators[name].requirementsTransformer);

      window.Parsley.trigger('parsley:validator:init');
    },

    // Set new messages locale if we have dictionary loaded in ParsleyConfig.i18n
    setLocale: function (locale) {
      if ('undefined' === typeof this.catalog[locale])
        throw new Error(locale + ' is not available in the catalog');

      this.locale = locale;

      return this;
    },

    // Add a new messages catalog for a given locale. Set locale for this catalog if set === `true`
    addCatalog: function (locale, messages, set) {
      if ('object' === typeof messages)
        this.catalog[locale] = messages;

      if (true === set)
        return this.setLocale(locale);

      return this;
    },

    // Add a specific message for a given constraint in a given locale
    addMessage: function (locale, name, message) {
      if ('undefined' === typeof this.catalog[locale])
        this.catalog[locale] = {};

      this.catalog[locale][name.toLowerCase()] = message;

      return this;
    },

    validate: function (value, constraints, priority) {
      return new this.Validator.Validator().validate.apply(new Validator.Validator(), arguments);
    },

    // Add a new validator
    addValidator: function (name, fn, priority, requirementsTransformer) {
      if (this.validators[name])
        ParsleyUtils.warn('Validator "' + name + '" is already defined.');
      else if (ParsleyDefaults.hasOwnProperty(name)) {
        ParsleyUtils.warn('"' + name + '" is a restricted keyword and is not a valid validator name.');
        return;
      };
      return this._setValidator(name, fn, priority, requirementsTransformer);
    },

    updateValidator: function (name, fn, priority, requirementsTransformer) {
      if (!this.validators[name]) {
        ParsleyUtils.warn('Validator "' + name + '" is not already defined.');
        return this.addValidator(name, fn, priority, requirementsTransformer);
      }
      return this._setValidator(name, fn, priority, requirementsTransformer);
    },

    removeValidator: function (name) {
      if (!this.validators[name])
        ParsleyUtils.warn('Validator "' + name + '" is not defined.');

      delete this.validators[name];

      return this;
    },

    _setValidator: function (name, fn, priority, requirementsTransformer) {
      this.validators[name] = function (requirements) {
        return $.extend(new Validator.Assert().Callback(fn, requirements), {
          priority: priority,
          requirementsTransformer: requirementsTransformer
        });
      };

      return this;
    },

    getErrorMessage: function (constraint) {
      var message;

      // Type constraints are a bit different, we have to match their requirements too to find right error message
      if ('type' === constraint.name) {
        var typeMessages = this.catalog[this.locale][constraint.name] || {};
        message = typeMessages[constraint.requirements];
      } else
        message = this.formatMessage(this.catalog[this.locale][constraint.name], constraint.requirements);

      return message || this.catalog[this.locale].defaultMessage || this.catalog.en.defaultMessage;
    },

    // Kind of light `sprintf()` implementation
    formatMessage: function (string, parameters) {
      if ('object' === typeof parameters) {
        for (var i in parameters)
          string = this.formatMessage(string, parameters[i]);

        return string;
      }

      return 'string' === typeof string ? string.replace(new RegExp('%s', 'i'), parameters) : '';
    },

    // Here is the Parsley default validators list.
    // This is basically Validatorjs validators, with different API for some of them
    // and a Parsley priority set
    validators: {
      notblank: function () {
        return $.extend(new Validator.Assert().NotBlank(), { priority: 2 });
      },
      required: function () {
        return $.extend(new Validator.Assert().Required(), { priority: 512 });
      },
      type: function (type) {
        var assert;

        switch (type) {
          case 'email':
            assert = new Validator.Assert().Email();
            break;
          // range type just ensure we have a number here
          case 'range':
          case 'number':
            assert = new Validator.Assert().Regexp('^-?(?:\\d+|\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$');
            break;
          case 'integer':
            assert = new Validator.Assert().Regexp('^-?\\d+$');
            break;
          case 'digits':
            assert = new Validator.Assert().Regexp('^\\d+$');
            break;
          case 'alphanum':
            assert = new Validator.Assert().Regexp('^\\w+$', 'i');
            break;
          case 'url':
            // Thanks to https://gist.github.com/dperini/729294
            // Voted best validator in https://mathiasbynens.be/demo/url-regex
            // Modified to make scheme optional and allow local IPs
            assert = new Validator.Assert().Regexp(
              "^" +
                // protocol identifier
                "(?:(?:https?|ftp)://)?" + // ** mod: make scheme optional
                // user:pass authentication
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                  // IP address exclusion
                  // private & local networks
                  // "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +   // ** mod: allow local networks
                  // "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +  // ** mod: allow local networks
                  // "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +  // ** mod: allow local networks
                  // IP address dotted notation octets
                  // excludes loopback network 0.0.0.0
                  // excludes reserved space >= 224.0.0.0
                  // excludes network & broacast addresses
                  // (first & last IP address of each class)
                  "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                  "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                  "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                  // host name
                  "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                  // domain name
                  "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                  // TLD identifier
                  "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                ")" +
                // port number
                "(?::\\d{2,5})?" +
                // resource path
                "(?:/\\S*)?" +
              "$", 'i');
            break;
          default:
            throw new Error('validator type `' + type + '` is not supported');
        }

        return $.extend(assert, { priority: 256 });
      },
      pattern: function (regexp) {
        var flags = '';

        // Test if RegExp is literal, if not, nothing to be done, otherwise, we need to isolate flags and pattern
        if (!!(/^\/.*\/(?:[gimy]*)$/.test(regexp))) {
          // Replace the regexp literal string with the first match group: ([gimy]*)
          // If no flag is present, this will be a blank string
          flags = regexp.replace(/.*\/([gimy]*)$/, '$1');
          // Again, replace the regexp literal string with the first match group:
          // everything excluding the opening and closing slashes and the flags
          regexp = regexp.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
        }

        return $.extend(new Validator.Assert().Regexp(regexp, flags), { priority: 64 });
      },
      minlength: function (value) {
        return $.extend(new Validator.Assert().Length({ min: value }), {
          priority: 30,
          requirementsTransformer: function () {
            return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
          }
        });
      },
      maxlength: function (value) {
        return $.extend(new Validator.Assert().Length({ max: value }), {
          priority: 30,
          requirementsTransformer: function () {
            return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
          }
        });
      },
      length: function (array) {
        return $.extend(new Validator.Assert().Length({ min: array[0], max: array[1] }), { priority: 32 });
      },
      mincheck: function (length) {
        return this.minlength(length);
      },
      maxcheck: function (length) {
        return this.maxlength(length);
      },
      check: function (array) {
        return this.length(array);
      },
      min: function (value) {
        return $.extend(new Validator.Assert().GreaterThanOrEqual(value), {
          priority: 30,
          requirementsTransformer: function () {
            return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
          }
        });
      },
      max: function (value) {
        return $.extend(new Validator.Assert().LessThanOrEqual(value), {
          priority: 30,
          requirementsTransformer: function () {
            return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
          }
        });
      },
      range: function (array) {
        return $.extend(new Validator.Assert().Range(array[0], array[1]), {
          priority: 32,
          requirementsTransformer: function () {
            for (var i = 0; i < array.length; i++)
              array[i] = 'string' === typeof array[i] && !isNaN(array[i]) ? parseInt(array[i], 10) : array[i];

            return array;
          }
        });
      },
      equalto: function (value) {
        return $.extend(new Validator.Assert().EqualTo(value), {
          priority: 256,
          requirementsTransformer: function () {
            return $(value).length ? $(value).val() : value;
          }
        });
      }
    }
  };

  return ParsleyValidator;
});
