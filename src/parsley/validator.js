define('parsley/validator', [
  'validator'
], function (Validator) {
  var ParsleyValidator = function (options) {
    this.__class__ = 'ParsleyValidator';
    this.Validator = Validator;

    this.init(options || {});
  };

  ParsleyValidator.prototype = {
    init: function (options) {
      for (var name in options.validators)
        this.addValidator(name, options.validators[name].fn, options.validators[name].priority);
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
      regexp: function (regExp) {
        return $.extend(new Validator.Assert().Regexp(regExp));
      }
    }
  };

  return ParsleyValidator;
});
