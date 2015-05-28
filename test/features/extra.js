define('features/extra', [
  'extra/validator/comparison',
  'extra/validator/dateiso',
  'extra/validator/words',
  'extra/validator/notequalto',
], function () {

  return function (ParsleyValidator) {
    describe('ParsleyExtras validators', function () {
      it('should have dateiso validator', function () {
        expect(window.ParsleyConfig.validators).to.have.key('dateiso');
        var parsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators);

        var expectValidation = function(value, name, requirements) {
          var validator = parsleyValidator.validators[name](requirements);
          return expect(parsleyValidator.validate(value, validator));
        };

        expectValidation('',           'dateiso').not.to.be(true);
        expectValidation('foo',        'dateiso').not.to.be(true);
        expectValidation('1986-30-01', 'dateiso').not.to.be(true);
        expectValidation('1986-12-45', 'dateiso').not.to.be(true);
        expectValidation('1986-12-01', 'dateiso').to.be(true);
      });
      it('should have gt validator', function () {
        expect(window.ParsleyValidator.validators).to.have.key('gt');
        var number = 5;

        // Check with a selector
        $('body').append('<input type="text" id="element" data-parsley-gt="#gt" required /><input type="text" id="gt" value="' + number + '" />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number + 1);
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val(number);
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number - 1);
        expect($('#element').psly().isValid()).to.be(false);

        // Check with a (different) number
        number = 42;
        $('#element').attr('data-parsley-gt', number);
        $('#element').val(number + 1);
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val(number);
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number - 1);
        expect($('#element').psly().isValid()).to.be(false);

        $('#gt').remove();
      });
      it('should have gte validator', function () {
        expect(window.ParsleyValidator.validators).to.have.key('gte');
        var number = 5;

        // Check with a selector
        $('body').append('<input type="text" id="element" data-parsley-gte="#gte" required /><input type="text" id="gte" value="' + number + '" />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number + 1);
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val(number);
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val(number - 1);
        expect($('#element').psly().isValid()).to.be(false);

        // Check with a (different) number
        number = 42;
        $('#element').attr('data-parsley-gte', number);
        $('#element').val(number + 1);
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val(number);
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val(number - 1);
        expect($('#element').psly().isValid()).to.be(false);

        $('#gte').remove();
      });
      it('should have lt validator', function () {
        expect(window.ParsleyValidator.validators).to.have.key('lt');
        var number = 5;

        // Check with a selector
        $('body').append('<input type="text" id="element" data-parsley-lt="#lt" required /><input type="text" id="lt" value="' + number + '" />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number + 1);
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number);
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number - 1);
        expect($('#element').psly().isValid()).to.be(true);

        // Check with a (different) number
        number = 42;
        $('#element').attr('data-parsley-lt', number);
        $('#element').val(number + 1);
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number);
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number - 1);
        expect($('#element').psly().isValid()).to.be(true);

        $('#lt').remove();
      });
      it('should have lte validator', function () {
        expect(window.ParsleyValidator.validators).to.have.key('lte');
        var number = 5;

        // Check with a selector
        $('body').append('<input type="text" id="element" data-parsley-lte="#lte" required /><input type="text" id="lte" value="' + number + '" />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number + 1);
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number);
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val(number - 1);
        expect($('#element').psly().isValid()).to.be(true);

        // Check with a (different) number
        number = 42;
        $('#element').attr('data-parsley-lte', number);
        $('#element').val(number + 1);
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val(number);
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val(number - 1);
        expect($('#element').psly().isValid()).to.be(true);

        $('#lte').remove();
      });
      it('should have a minwords validator', function () {
        expect(window.ParsleyValidator.validators).to.have.key('minwords');
        $('body').append('<input type="text" id="element" data-parsley-minwords="2" required />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo bar');
        expect($('#element').psly().isValid()).to.be(true);
      });
      it('should have a maxwords validator', function () {
        expect(window.ParsleyValidator.validators).to.have.key('maxwords');
        $('body').append('<input type="text" id="element" data-parsley-maxwords="2" required />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo bar');
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val('foo bar baz');
        expect($('#element').psly().isValid()).to.be(false);
      });
      it('should have a words validator', function () {
        expect(window.ParsleyValidator.validators).to.have.key('words');
        $('body').append('<input type="text" id="element" data-parsley-words="[2, 4]" required />');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo');
        expect($('#element').psly().isValid()).to.be(false);
        $('#element').val('foo bar baz');
        expect($('#element').psly().isValid()).to.be(true);
        $('#element').val('foo bar baz qux bux');
        expect($('#element').psly().isValid()).to.be(false);
      });

      it('should have a notequalto validator', function () {
        $('body').append('<input type="text" id="element" data-parsley-notequalto="hello" value="hello"/>'
            + '<input type="text" class="fixture not" value="world"/>');
        var p = $('#element').psly();
        expect(p.isValid()).to.be(false);
        $('#element').val('world');
        expect(p.isValid()).to.be(true);
        $('#element').attr('data-parsley-notequalto', '.not');
        expect(p.isValid()).to.be(false);
        $('#element').val('hello');
        expect(p.isValid()).to.be(true);
      });

      it('should have a bind.js plugin allowing to give pure json validation config to parsley constructor', function (done) {
        require(['extra/plugin/bind'], function () {
          $('body').append(
          '<form id="element" >' +
            '<input type="text" name="name" />' +
            '<input type="text" name="email" id="email" />' +
            '<input type="checkbox" name="sexe" id="sexe" value="male" />' +
            '<input type="checkbox" name="sexe" value="female" />' +
          '</form>');

        var parsleyInstance = $('#element').parsley({
          fields: {
            '[name="name"]': {
              required: true,
              length: [4, 20]
            },
            '#email': {
              type: 'email'
            },
            '#sexe': {
              required: true
            }
          }
        });
        expect($('[name="name"]').parsley().constraints.length).to.be(2);
        expect($('#email').parsley().constraints.length).to.be(1);
        expect($('#sexe').parsley().constraints.length).to.be(1);
        expect($('#sexe').parsley().constraints[0].name).to.be('required');
        done();
        });
      });
      afterEach(function () {
        $('#element, .fixture, .parsley-errors-list').remove();
      });
    });
  };
});
