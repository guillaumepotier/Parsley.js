import $ from 'jquery';
import ParsleyField from '../../src/parsley/field';
import Parsley from '../../src/parsley';

describe('ParsleyField', () => {
  it('should be a function', () => {
    expect(ParsleyField).to.be.a('function');
  });
  it('should throw an error if no parsleyInstance given', () => {
    expect(ParsleyField).to.throwException();
  });
  it('should properly bind DOM constraints', () => {
    $('body').append('<input type="text" id="element" data-parsley-required />');
    var parsleyField = $('#element').parsley();
    expect(parsleyField.constraints.length).to.be(1);
    expect(parsleyField.constraints[0].name).to.be('required');
    expect(parsleyField.constraints[0].isDomConstraint).to.be(true);
  });
  it('should properly bind HTML DOM supported constraints', () => {
    $('body').append('<input type="email" id="element" />');
    var parsleyField = $('#element').parsley();
    expect(parsleyField.constraints.length).to.be(1);
    expect(parsleyField.constraints[0].name).to.be('type');
    expect(parsleyField.constraints[0].isDomConstraint).to.be(true);
  });
  it('should ignore unknown types', () => {
    $('body').append('<input type="" id="element" />');
    var parsleyField = $('#element').parsley();
    expect(parsleyField.constraints.length).to.be(0);
  });
  it('should ignore mistyped types', () => {
    $('body').append('<input type="    email" id="element" />');
    var parsleyField = $('#element').parsley();
    expect(parsleyField.constraints.length).to.be(0);
  });
  it('should have a proper addConstraint() javascript method', () => {
    $('body').append('<input type="text" id="element" />');
    var parsleyField = $('#element').parsley()
      .addConstraint('required', true);
    expect(parsleyField.constraints.length).to.be(1);
    expect(parsleyField.constraints[0].name).to.be('required');
    expect(parsleyField.constraints[0].requirements).to.be(true);
    expect(parsleyField.constraints[0].priority).to.be(512);
    expect(parsleyField.constraints[0].isDomConstraint).to.be(false);

    // trying to add an existing constraint result in an update
    parsleyField.addConstraint('required', false, 64);
    expect(parsleyField.constraints.length).to.be(1);
    expect(parsleyField.constraints[0].name).to.be('required');
    expect(parsleyField.constraints[0].requirements).to.be(false);
    expect(parsleyField.constraints[0].priority).to.be(64);
  });
  it('should have a proper updateConstraint() javascript method', () => {
    $('body').append('<input type="text" id="element" />');
    var parsleyField = $('#element').parsley()
      .addConstraint('required', true);

    // same as above test where addConstraint resulted in an updateConstraint
    parsleyField.updateConstraint('required', false, 64);
    expect(parsleyField.constraints.length).to.be(1);
    expect(parsleyField.constraints[0].name).to.be('required');
    expect(parsleyField.constraints[0].requirements).to.be(false);
    expect(parsleyField.constraints[0].priority).to.be(64);
  });
  it('should have a proper removeConstraint() javascript method', () => {
    $('body').append('<input type="text" id="element" />');
    var parsleyField = $('#element').parsley()
      .addConstraint('required', true)
      .addConstraint('notblank', true)
      .removeConstraint('required');
    expect(parsleyField.constraints.length).to.be(1);
    expect(parsleyField.constraints[0].name).to.be('notblank');
    expect(parsleyField._isRequired()).to.be(false);
  });
  it('should return true for fields without constraints', () => {
    $('body').append('<input type="text" id="element" value="hola" data-parsley-minlength="5" />');
    var parsleyField = $('#element').parsley();
    // Start with some validation errors:
    expect(parsleyField.isValid()).to.eql(false);
    // The remove constraint and check result:
    $('#element').removeAttr('data-parsley-minlength');
    expect(parsleyField.isValid()).to.be(true);
  });
  it('should properly bind HTML5 supported constraints', () => {
    $('body').append('<input type="email" pattern="\\w+" id="element" required min="5" max="100" minlength="1" maxlength="3" />');
    var parsleyField = $('#element').parsley();
    // 5 validators: type=email, pattern, required, (min+max => range) and (minlength+maxlength => length)
    expect(parsleyField.constraints.length).to.be(5);
    $('#element').removeAttr('min');
    // still 5 validators, with max instead of range now
    expect(parsleyField.actualizeOptions().constraints.length).to.be(5);
    $('#element').removeAttr('minlength');
    // still 5 validators, with maxlength instead of length now
    expect(parsleyField.actualizeOptions().constraints.length).to.be(5);
  });

  var itShouldFollowSpecForNumber = (step, min, initial, value, valid) => {
    var attrs = [
      step ? `step="${step}" ` : '',
      min  ? `min="${min}" ` : '',
      initial ? `value="${initial}" ` : ''
    ].join('');
    it('should follow HTML5 spec to validate "number" type ' +
    (attrs ? `with attributes ${attrs}` : '') +
    `by ${valid ? 'accepting' : 'rejecting'} "${value}"`, () => {
      var $input = $(`<input type="number" ${attrs}>`);
      expect($input.parsley().isValid({value})).to.be(valid);
    });
  };

  var checks = [
    // step | min | initial | good        | bad values
    //      |     |  value  | values      |
    // ---- | --- | ------- | ----------- | ----------
    "       |     |         | 1, -2, 4.0  | 1.1, 4.       ",
    "  any  |     |         | -2, 4.3, .1 | 4., hi, ., 1. ",
    "  AnY  |     |         | .1e+2, -.2  | 4e, 4e-, .e+2 ",
    "  0.1  |     |         | -2, 4.3     | 4.03          ",
    "  0.01 |     |         | 1.11        | 1.111         ", // Bug #1056
    "       | 0.3 |         | 4.3         | -2, -2.7, 4.0 ",
    "       |     |   0.3   | -2.7, 4.3   | -2, -2.3, 4.0 ",
    "  0.4  | 0.3 |         | 1.1         | -2.9, 1.6, 1.8",
    "  0.4  |     |   0.3   | -2.9, 1.1   | 1.6, 1.8      ",
    "  0.4  | 0.3 |   0.5   | 1.1         | -2.9, 1.6, 1.8"
  ];
  $.each(checks, (_, check) => {
    var trim = val => { return val.trim(); };
    var [step, min, initial, ...goodAndBad] = check.split('|').map(trim);
    var xs = goodAndBad.map(values => {
      return values.split(',').map(trim);
    });
    var [good, bad] = xs;
    $.each(good, (_, val) => {
      itShouldFollowSpecForNumber(step, min, initial, val, true);
      itShouldFollowSpecForNumber(step, min, initial, val.trim() + '0', true);
    });
    $.each(bad, (_, val) => {
      itShouldFollowSpecForNumber(step, min, initial, val, false);
    });
  });
  // 'any' must be exact match
  itShouldFollowSpecForNumber('   any    ', '', '', '4.2', false);
  // min / initial should be auto-trimmed
  itShouldFollowSpecForNumber('0.2', '   0.3    ', '', '0.3', true);
  // scientific notation
  itShouldFollowSpecForNumber('', '0.3', '', '43e-1', true);
  // commas are not accepted in the spec
  itShouldFollowSpecForNumber('any', '', '', '1,000', false);


  var itShouldFollowSpecForNumber = (step, min, initial, value, valid) => {
    var attrs = [
      step ? `step="${step}" ` : '',
      min  ? `min="${min}" ` : '',
      initial ? `value="${initial}" ` : ''
    ].join('');
    it('should follow HTML5 spec to validate "number" type ' +
    (attrs ? `with attributes ${attrs}` : '') +
    `by ${valid ? 'accepting' : 'rejecting'} "${value}"`, () => {
      var $input = $(`<input type="number" ${attrs}>`);
      expect($input.parsley().isValid({value})).to.be(valid);
    });
  };

  it('should have a default step of "any" for data-parsley-type="number"', () => {
    var $input = $(`<input data-parsley-type="number" value="4.444">`);
    expect($input.parsley().isValid()).to.be(true);
    $input.attr('data-parsley-type-step', '1');
    expect($input.parsley().isValid()).to.be(false);
  });
  it('should valid simple validator', () => {
    $('body').append('<input type="text" id="element" value="" />');
    var parsleyField = $('#element').parsley()
      .addConstraint('required', true);
    expect(parsleyField.isValid()).to.be(false);
    $('#element').val('foo');
    expect(parsleyField.isValid()).to.be(true);
  });
  it('should valid more complex `type` validator', () => {
    $('body').append('<input type="text" id="element" value="foo" />');
    var parsleyField = $('#element').parsley()
      .addConstraint('type', 'email');
    expect(parsleyField.isValid()).to.be(false);
    $('#element').val('foo');
    expect(parsleyField.isValid()).to.be(false);
    $('#element').val('foo@bar.baz');
    expect(parsleyField.isValid()).to.be(true);
  });
  it('should valid most complex Callback() validator', () => {
    $('body').append('<input type="text" id="element" value="" />');
    window.Parsley.addValidator('ismultiple', (value, multiple) => {
      if (!isNaN(parseFloat(value)) && isFinite(value))
        return !(Number(value) % multiple);

      return false;
    }, 512);

    var parsleyField = $('#element').parsley()
      .addConstraint('ismultiple', 2);
    expect(parsleyField.isValid()).to.eql(true);
    $('#element').val('1');
    expect(parsleyField.isValid()).to.be(false);
    $('#element').val('2');
    expect(parsleyField.isValid()).to.be(true);
    parsleyField.updateConstraint('ismultiple', 3);
    expect(parsleyField.isValid()).to.be(false);
    $('#element').val('9');
    expect(parsleyField.isValid()).to.be(true);
    window.Parsley.removeValidator('ismultiple');
  });
  it('should properly compute constraints on each validation', () => {
    $('body').append('<input type="email" data-parsley-required id="element" />');
    window.Parsley.addValidator('foobazer', value => {
      return 'foobar' === value;
    }, 2);
    window.Parsley.addValidator('ismultiple', (value, multiple) => {
      if (!isNaN(parseFloat(value)) && isFinite(value))
        return !(Number(value) % multiple);

      return false;
    }, 512);

    var parsleyField = $('#element').parsley()
      .addConstraint('ismultiple', 4)
      .addConstraint('foobazer', true);
    parsleyField.refreshConstraints();
    expect(parsleyField.constraints.length).to.be(4);
    $('#element').removeAttr('data-parsley-required');
    parsleyField.refreshConstraints();
    expect(parsleyField.constraints.length).to.be(3);
    parsleyField
      .removeConstraint('ismultiple')
      .refreshConstraints();
    expect(parsleyField.constraints.length).to.be(2);
    window.Parsley.removeValidator('foobazer');
    window.Parsley.removeValidator('ismultiple');
  });
  it('should handle constraints priorities on validation', () => {
    $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
    var parsleyField = $('#element').parsley();
    expect(parsleyField.isValid()).to.be(false);
    expect(parsleyField.validationResult.length).to.be(1);
    expect(parsleyField.validationResult[0].assert.name).to.be('required');
    $('#element').val('foo');
    expect(parsleyField.isValid()).to.be(false);
    expect(parsleyField.validationResult.length).to.be(1);
    expect(parsleyField.validationResult[0].assert.name).to.be('type');
    $('#element').val('foo@bar.baz');
    expect(parsleyField.isValid()).to.be(false);
    expect(parsleyField.validationResult.length).to.be(1);
    expect(parsleyField.validationResult[0].assert.name).to.be('pattern');
  });
  it('should handle all violations if `priorityEnabled` is set to false', () => {
    $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
    var parsleyField = $('#element').parsley({priorityEnabled: false});
    expect(parsleyField.isValid()).to.be(false);
    expect(parsleyField.validationResult.length).to.be(3);
  });
  it('should trigger field:validate event', done => {
    $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
    $('#element').psly()
    .on('field:validate', function () {
      // we are before validation!
      expect(this.validationResult).to.be(true);
      done();
    })
    .validate();
  });
  it('should trigger field:validated event', done => {
    $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
    $('#element').psly()
    .on('field:validated', function () {
      // we are after validation!
      expect(this.validationResult.length).to.be(1);
      done();
    })
    .validate();
  });
  it('should trigger field:error event', done => {
    $('body').append('<input type="email" pattern="[A-F][0-9]{5}" required id="element" />');
    $('#element').psly()
    .on('field:error', function () {
      expect(this.validationResult.length).to.be(1);
      done();
    })
    .validate();
  });
  it('should trigger parsley:field:success event', done => {
    $('body').append('<input type="email" required id="element" value="foo@bar.baz" />');
    $('#element').psly()
    .on('field:success', function () {
      expect(this.validationResult).to.be(true);
      done();
    })
    .validate();
  });

  it('should have the validationResult be changeable', () => {
    var submitted = false;
    $('<form id="element"><input/></form>')
    .appendTo('body')
    .parsley()
    .on('field:success', field => {
      field.validationResult = false;
    })
    .on('field:error', field => {
      field.validationResult = true;
    })
    .on('form:submit', form => {
      submitted = true;
      return false;
    });
    $('#element').submit();
    expect(submitted).to.be(false);
    $('#element input').attr('required', true);
    $('#element').submit();
    expect(submitted).to.be(true);
  });

  it('should have validateIfEmpty option', () => {
    $('body').append('<input type="email" data-parsley-rangelength="[5, 10]" id="element" />');
    expect($('#element').psly().isValid()).to.be.eql(true);
    $('#element').attr('data-parsley-validate-if-empty', '');
    expect($('#element').psly().isValid()).to.be.eql(false);
  });
  it('should allow `this.value` alteration with field:validate.parsley event', () => {
    $('body').append('<input type="email" required id="element" value="foo@bar.baz" />');
    expect($('#element').parsley().validate()).to.be(true);

    $('#element').parsley().on('field:validate', function () {
      this.value = '';
    });

    expect($('#element').parsley().validate()).not.to.be(true);
  });
  it('should have an optional force option for validate and isValid methods', () => {
    $('body').append('<input type="email" id="element" />');
    expect($('#element').parsley().isValid()).to.be.eql(true);
    expect($('#element').parsley().validate()).to.be.eql(true);
    expect($('#element').parsley().isValid({force: true})).to.be(false);
    expect($('#element').parsley().validate({force: true}).length).to.be(1);
    expect($('#element').parsley().isValid({value: 'not an email'})).to.be(false);
    expect($('#element').parsley().isValid({value: 'foo@example.com'})).to.be(true);
  });
  it('should allow passing a specific value to `isValid` method', () => {
    expect($('<input type="email" value="foo">').parsley().isValid()).to.be(false);
    expect($('<input type="email" value="foo">').parsley().isValid({value: ''})).to.be(true);
    expectWarning(() => {
      expect($('<input type="email" value="foo">').parsley().isValid(true, '')).to.be(false);
    });
  });
  it('should have a whitespace="squish" option', () => {
    $('body').append('<input type="text" id="element" value=" foo    bar " />');
    expect($('#element').parsley().getValue()).to.be(' foo    bar ');
    $('#element').attr('data-parsley-whitespace', 'squish').parsley().actualizeOptions();
    expect($('#element').parsley().getValue()).to.be('foo bar');
  });
  it('should have a whitespace="trim" option', () => {
    $('body').append('<input type="text" id="element" value=" foo " />');
    expect($('#element').parsley().getValue()).to.be(' foo ');
    $('#element').attr('data-parsley-whitespace', 'trim').parsley().actualizeOptions();
    expect($('#element').parsley().getValue()).to.be('foo');
  });
  it('should have a trim-value option', () => {
    $('body').append('<input type="text" id="element" value=" foo " />');
    expect($('#element').parsley().getValue()).to.be(' foo ');
    $('#element').attr('data-parsley-trim-value', true).parsley().actualizeOptions();
    expectWarning(() => {
      expect($('#element').parsley().getValue()).to.be('foo');
    });
  });

  it('should delay validation if debounce option specified', done => {
    // Use a an initially valid input. Any success event will be a sign that validation completed
    // and treated as a failure. We will make the field invalid before delayed validation occurs,
    // so only error event will be a test success.
    $('body').append('<input data-parsley-debounce="100" value="x" required data-parsley-trigger="validatenow" id="element"/>');
    $('#element').parsley()
    .on('field:error', () => done())
    .on('field:success', () => expect().fail('validation should not happen yet'));

    // Trigger validation immediately
    $('#element').trigger('validatenow');
    // and a bit later, which should reset the counter
    setTimeout(() => $('#element').trigger('validatenow'), 50);
    // Set final condition after a delay longer than our debounce, less than 50+debounce
    setTimeout(() => $('#element').val(''), 140);
  });

  it('should inherit options from the form, even if the form is bound after', () => {
    $('body').append('<form id="element" data-parsley-required>' +
      '<input type="text"/></form>');
    var psly = $('#element input').parsley();
    expect(psly.isValid()).not.to.be(false);
    $('#element').parsley();
    expect(psly.isValid()).to.be(false);
  });
  it('should have options that can be set easily', () => {
    var psly = $('<input type="text"/>').parsley();
    psly.options.required = true;
    expect(psly.isValid()).to.be(false);
  });
  it('should have a value option', () => {
    $('body').append('<input type="text" id="element"/>');
    expect($('#element').parsley({value: 'foo'}).getValue()).to.be('foo');
  });
  it('should accept a function as value option', () => {
    $('body').append('<input type="text" id="element"/>');
    var str = 'fo';
    var parsley = $('#element').parsley({value: () => { return str = str + 'o';}});
    expect(parsley.getValue()).to.be('foo');
    expect(parsley.getValue()).to.be('fooo');
  });
  it('should properly handle null or undefined values', () => {
    $('body').append('<input type="text" id="element" required value/>');
    expect($('#element').parsley().isValid()).to.be(false);
  });
  afterEach(() => {
    $('#element, .parsley-errors-list').remove();
  });
});
