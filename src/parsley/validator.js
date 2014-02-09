define('parsley/validator', [
  'validator'
], function (Validator) {
  var ParsleyValidator = function (validators) {
    this.__class__ = 'ParsleyValidator';
    this.Validator = Validator;

    // Default Parsley locale is en
    this.locale = 'en';

    this.init(validators || {});
  };

  ParsleyValidator.prototype = {
    init: function (validators) {
      for (var name in validators)
        this.addValidator(name, validators[name].fn, validators[name].priority);

      $.emit('parsley:validator:init');
    },

    validate: function (value, constraints, priority) {
      return new this.Validator.Validator().validate.apply(new Validator.Validator(), arguments);
    },

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

    // Set new messages locale if we have dictionary loaded in ParsleyConfig.i18n
    setLocale: function (locale) {
      if ('undefined' === typeof window.ParsleyConfig.i18n[locale])
        throw new Error(locale + ' is not available in i18n dictionary');

      this.locale = locale;

      return this;
    },

    getErrorMessage: function (constraint) {
      var message;

      // Type constraints are a bit different, we have to match their requirements too to find right error message
      if ('type' === constraint.name)
        message = window.ParsleyConfig.i18n[this.locale].messages[constraint.name][constraint.requirements];
      else
        message = this.formatMesssage(window.ParsleyConfig.i18n[this.locale].messages[constraint.name], constraint.requirements);

      return '' !== message ? message : window.ParsleyConfig.i18n[this.locale].messages.defaultMessage;
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
          case 'digits':
            assert = new Validator.Assert().Regexp('^\\d+$');
            break;
          case 'alphanum':
            assert = new Validator.Assert().Regexp('^\\w+$', 'i');
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
      }
    }
  };

  return ParsleyValidator;
});
