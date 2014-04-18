define('features/extra', [
  'extra/validator/dateiso'
], function () {

  return function (ParsleyValidator) {
    describe('ParsleyExtras validators', function () {
      it('should have dateiso validator', function () {
        expect(window.ParsleyConfig.validators).to.have.key('dateiso');
        var parsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators);

        expect(parsleyValidator.validate('', parsleyValidator.validators.dateiso())).not.to.be(true);
        expect(parsleyValidator.validate('foo', parsleyValidator.validators.dateiso())).not.to.be(true);
        expect(parsleyValidator.validate('1986-30-01', parsleyValidator.validators.dateiso())).not.to.be(true);
        expect(parsleyValidator.validate('1986-12-45', parsleyValidator.validators.dateiso())).not.to.be(true);
        expect(parsleyValidator.validate('1986-12-01', parsleyValidator.validators.dateiso())).to.be(true);
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
        if ($('#element').length)
          $('#element').remove();

        if ($('.parsley-errors-list').length)
          $('.parsley-errors-list').remove();
      });
    });
  };
});
