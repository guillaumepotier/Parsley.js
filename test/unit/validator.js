import ParsleyValidator from '../../src/parsley/validator';

describe('Validator', () => {
  var testParsing = function(type, input, output, extraOptions) {
    it(`parses ${type} requirements`, () => {
      var c = new ParsleyValidator({requirementType: type});
      expect(c.parseRequirements(input, extraOptions)).to.eql(output);
    });
  };

  testParsing('integer', '42', [42]);
  testParsing('number', '4.2', [4.2]);
  testParsing('string', '42', ['42']);
  testParsing(['number', 'string'], '[4.2, 4.2]', [4.2, '4.2']);
  testParsing({
      '': 'number',
      'foo': 'string',
      'bar': 'string'
    }, '4.2',
    [4.2, {foo: 'FOO', bar: 'BAR'}],
    value => { return value.toUpperCase(); }
  );
});
