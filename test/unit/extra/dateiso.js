import $ from 'jquery';

import Parsley from '../../../src/parsley';

import dateiso from '../../../src/extra/validator/dateiso';

describe('extra/validator/dateiso', () => {

  it('should have dateiso validator', () => {
    var expectValidation = function(value, name, requirements) {
      var field = $('<input>').parsley();
      field.options[name] = requirements;
      return expect(field.isValid({force: true, value: value}));
    };

    expectValidation('',           'dateiso').not.to.be(true);
    expectValidation('foo',        'dateiso').not.to.be(true);
    expectValidation('1986-30-01', 'dateiso').not.to.be(true);
    expectValidation('1986-12-45', 'dateiso').not.to.be(true);
    expectValidation('1986-12-01', 'dateiso').to.be(true);
  });
});
