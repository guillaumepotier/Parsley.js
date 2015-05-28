define(function () {
  return function (Validator) {
    describe('Validator', function () {
      var testParsing = function(type, input, output) {
        it('parses '+type+' requirements', function () {
          var c = new Validator({requirementType: type});
          expect(c.parseRequirements(input)).to.eql(output);
        });
      }

      testParsing('integer', '42', [42]);
      testParsing('number', '4.2', [4.2]);
      testParsing('string', '42', ['42']);
      testParsing(['number', 'string'], '[4.2, 4.2]', [4.2, '4.2']);
    });
  };
});
