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
    },

    validate: function () {
      return new this.Validator.Validator().validate.apply(new Validator.Validator(), arguments);
    },

    addValidator: function (name, fn, priority) {
      this.validators[name] = function (requirements) {
        return $.extend(new Validator.Assert().Callback(fn, requirements), { priority: priority });
      }

      return this;
    },

    updateValidator: function (name, fn, priority) {
      return addValidator(name, fn, priority);
    },

    removeValidator: function (name) {
      delete(this.validators[name]);

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

    // Kind of `sprintf()` light implementation
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
      notnull: function () {
        return $.extend(new Validator.Assert().NotNull(), { priority: 2 });
      },
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
            assert = new Validator.Assert().Regexp('/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/');
            break;
          case 'digits':
            assert = new Validator.Assert().Regexp('/^\d+$/');
            break;
          case 'alphanum':
            assert = new Validator.Asser().Regexp('/^\w+$/');
            break;
          // TODO
          case 'url':
          case 'urlstrict':
            assert = new Validator.Assert().Regexp("/^(https?|s?ftp|git):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i");
            break;
          case 'dateIso':
            assert = new Validator.Assert().Regexp('/^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/');
            break;
          case 'tel':
            assert = new Validator.Assert().Regexp('/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/');
            break;
          default:
            throw new Error('validator type `' + type + '` is not supported');
        }

        return $.extend(assert, { priority: 256 });
      },
      pattern: function (regexp) {
        return $.extend(new Validator.Assert().Regexp(regexp), { priority: 64 });
      },
      length: function (array) {
        return $.extend(new Validator.Assert().Length({ min: array[0], max: array[1] }), { priority: 32 });
      },
      minlength: function (length) {
        return $.extend(new Validator.Assert().Length({ min: length }), { priority: 32 });
      },
      maxlength: function (length) {
        return $.extend(new Validator.Assert().Length({ max: length }), { priority: 32 });
      },
    }
  };

  return ParsleyValidator;
});
