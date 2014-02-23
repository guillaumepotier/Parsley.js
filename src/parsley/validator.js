define('parsley/validator', [
  'validator'
], function (Validator) {
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

      for (var name in validators)
        this.addValidator(name, validators[name].fn, validators[name].priority);

      $.emit('parsley:validator:init');
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
      if (undefined === typeof this.catalog[locale])
        this.catalog[locale] = {};

      this.catalog[locale][name] = message;
    },

    validate: function (value, constraints, priority) {
      return new this.Validator.Validator().validate.apply(new Validator.Validator(), arguments);
    },

    // Add a new validator
    addValidator: function (name, fn, priority) {
      this.validators[name] = function (requirements) {
        return $.extend(new Validator.Assert().Callback(fn, requirements), { priority: priority });
      };

      return this;
    },

    updateValidator: function (name, fn, priority) {
      return addValidator(name, fn, priority);
    },

    removeValidator: function (name) {
      delete this.validators[name];

      return this;
    },

    getErrorMessage: function (constraint) {
      var message;

      // Type constraints are a bit different, we have to match their requirements too to find right error message
      if ('type' === constraint.name)
        message = window.ParsleyConfig.i18n[this.locale][constraint.name][constraint.requirements];
      else
        message = this.formatMesssage(window.ParsleyConfig.i18n[this.locale][constraint.name], constraint.requirements);

      return '' !== message ? message : window.ParsleyConfig.i18n[this.locale].defaultMessage;
    },

    // Kind of light `sprintf()` implementation
    formatMesssage: function (string, parameters) {
      if ('object' === typeof parameters) {
        for (var i in parameters)
          string = this.formatMesssage(string, parameters[i]);

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
            assert = new Validator.Assert().Regexp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)', 'i');
            break;
          default:
            throw new Error('validator type `' + type + '` is not supported');
        }

        return $.extend(assert, { priority: 256 });
      },
      pattern: function (regexp) {
        return $.extend(new Validator.Assert().Regexp(regexp), { priority: 64 });
      },
      minlength: function (length) {
        return $.extend(new Validator.Assert().Length({ min: length }), { priority: 30 });
      },
      maxlength: function (length) {
        return $.extend(new Validator.Assert().Length({ max: length }), { priority: 30 });
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
        return $.extend(new Validator.Assert().GreaterThanOrEqual(value), { priority: 30 });
      },
      max: function (value) {
        return $.extend(new Validator.Assert().LessThanOrEqual(value), { priority: 30 });
      },
      range: function (array) {
        return $.extend(new Validator.Assert().Range(array[0], array[1]), { priority: 32 });
      },
      equalto: function (identifier) {
        return $.extend(new Validator.Assert().Callback(function (value, identifier) {
          return value === $(identifier).val();
        }, identifier), { priority: 256 });
      }
    }
  };

  return ParsleyValidator;
});
